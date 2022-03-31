import * as fs from 'fs/promises'
import path from 'path'
import electron from 'electron'
import log from 'electron-log'
import ElectronStore from 'electron-store'
import { marked } from 'marked'
import { parse as parseHtml } from 'node-html-parser'
import randomstring from 'randomstring'
import { SettingProperties } from '../@types/global'
import { ErrorReport } from './lib/error'
import {
  countKnowledge,
  ensureDirectoryExists,
  isDirectoryExists,
  openKnowledgeFile,
  prepareSearchEngine,
  searchKnowledge,
} from './lib/functions'
import { getAllSettings, getSetting } from './lib/settings'

const {
  BrowserWindow,
  app,
  screen,
  ipcMain,
  Tray,
  Menu,
  globalShortcut,
  clipboard,
  nativeTheme,
  dialog,
  session,
} = electron

const isDevelopment = !app.isPackaged

// ウィンドウを非表示にする挙動を無効にするかどうか（開発時に使用）
const isDisabledDeactivation = isDevelopment && process.env.DISABLE_DEACTIVATION === 'true'

const trayIconFileName = nativeTheme.shouldUseDarkColors ? 'trayIcon-dark.png' : 'trayIcon.png'

const assetsDirPath = isDevelopment
  ? path.join(__dirname, '..', 'assets')
  : path.join(process.resourcesPath, 'assets')

// 通知領域に表示させるアイコンの画像のパス
const treyIconPath = path.join(assetsDirPath, trayIconFileName)

if (isDevelopment) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
    forceHardReset: true,
    hardResetMethod: 'exit',
  })

  const isSandboxMode = process.env.SANDBOX_MODE === 'true'
  if (isSandboxMode) {
    log.debug('SANDBOX MODE IS ENABLED!')
    app.setPath('appData', path.join(__dirname, '..', 'appdata-dev'))
  }
} else {
  Object.assign(console, log.functions)
}

const nonce = Buffer.from(randomstring.generate()).toString('base64')

let currentAppMode: 'workbench' | 'workbench-suggestion' | 'preference' = 'workbench'
let mainWindow: Electron.BrowserWindow
let tray: electron.Tray | null = null
const currentSettings: SettingProperties | null = null
let suggestItems: { id: number; title: string; contents: string; fileName: string }[] = []

const hideWindow = () => {
  if (isDisabledDeactivation) {
    console.debug('Hiding window is requested but ignored because DISABLE_DEACTIVATION is "true"')
  } else {
    mainWindow.hide()
    mainWindow.webContents.send('doneDeactivate')
  }
}

const showWindow = () => {
  mainWindow.show()
}

const createNewKnowledgeFile = async () => {
  const templateFilePath = isDevelopment
    ? path.join(__dirname, '..', 'assets', 'template.md')
    : path.join(process.resourcesPath, 'assets', 'template.md')

  const knowledgeDir = getSetting('knowledgeStoreDirectory')

  if (!(typeof knowledgeDir === 'string' && (await isDirectoryExists(knowledgeDir)))) {
    throw new Error(`Invalid knowledgeStoreDirectory setting: ${knowledgeDir}`)
  }

  const destFilePath = path.join(knowledgeDir, `${Date.now()}.md`)

  await fs.copyFile(templateFilePath, destFilePath)

  openKnowledgeFile(destFilePath)
}

const toggleMode = (mode: 'workbench' | 'workbench-suggestion' | 'preference') => {
  switch (mode) {
    case 'workbench':
      mainWindow.setSize(800, 94)
      break
    case 'workbench-suggestion':
      mainWindow.setSize(800, 752)
      break
    case 'preference':
      mainWindow.setSize(800, 564)
      break
  }

  if (mode === 'workbench' || mode === 'workbench-suggestion') {
    const shouldShowTutorial = getSetting('shouldShowTutorial')
    if (typeof shouldShowTutorial !== 'boolean') {
      throw new ErrorReport('エラーが発生しました。', '設定ファイルが不正です。')
    }
    mainWindow.webContents.send('toggleMode', mode, shouldShowTutorial)
  }
  if (mode === 'preference') {
    mainWindow.webContents.send('toggleMode', mode, getAllSettings())

    if (!mainWindow.isVisible()) {
      showWindow()
    }
  }

  log.debug(`Toggled mode: ${currentAppMode} -> ${mode}`)

  currentAppMode = mode
}

const selectDirectory = async (): Promise<
  { dirPath: null; isCancelled: true } | { dirPath: string | null; isCancelled: false }
> => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  })

  if (canceled) {
    return {
      dirPath: null,
      isCancelled: true,
    }
  }

  if (!filePaths) {
    return {
      dirPath: null,
      isCancelled: false,
    }
  }

  return {
    dirPath: filePaths[0],
    isCancelled: false,
  }
}

const selectApplication = async (): Promise<
  { appPath: null; isCancelled: true } | { appPath: string | null; isCancelled: false }
> => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      {
        name: 'Application',
        extensions: ['app'],
      },
    ],
  })

  if (canceled) {
    return {
      appPath: null,
      isCancelled: true,
    }
  }

  if (!filePaths) {
    return {
      appPath: null,
      isCancelled: false,
    }
  }

  return {
    appPath: filePaths[0],
    isCancelled: false,
  }
}

ipcMain.handle('ready', () => {
  console.debug('RECEIVE MESSAGE: ready')
  toggleMode('workbench')
})

ipcMain.handle('requestSearch', (event, query: string) => {
  console.debug(`RECEIVE MESSAGE: requestSearch, QUERY: ${query}`)

  const suggestionResult = searchKnowledge(query)
  const suggestions = suggestionResult
    .sort((a, b) => {
      if (a.score! > b.score!) {
        return -1
      } else if (a.score! < b.score!) {
        return 1
      } else {
        return 0
      }
    })
    .map((item) => {
      return {
        id: item.item.id,
        title: item.item.title,
        contents: item.item.contents,
      }
    })

  toggleMode('workbench-suggestion')
  mainWindow.webContents.send('responseSearch', suggestions)
})

ipcMain.handle('clearSearch', (_event) => {
  console.debug('RECEIVE MESSAGE: clearSearch')
  toggleMode('workbench')
})

ipcMain.handle('writeClipboard', (event, text: string) => {
  console.debug(`RECEIVE MESSAGE: writeClipboard, TEXT: ${text.replace(/\n/g, ' ')}`)
  clipboard.writeText(text)
  mainWindow.webContents.send('doneWriteClipboard')
})

ipcMain.handle('requestDeactivate', () => {
  console.debug('RECEIVE MESSAGE: requestDeactivate')
  hideWindow()
})

ipcMain.handle('createNewKnowledge', async () => {
  await createNewKnowledgeFile()
})

ipcMain.handle('exitPreference', () => {
  console.debug('RECEIVE MESSAGE: exitPreference')
  toggleMode('workbench')
})

ipcMain.handle('requestUserSettings', () => {
  console.debug('RECEIVE MESSAGE: requestUserSettings')
  mainWindow.webContents.send('responseUserSettings', currentSettings)
})

ipcMain.handle('requestSelectingDirectory', async () => {
  try {
    const { isCancelled, dirPath } = await selectDirectory()

    if (!dirPath) {
      mainWindow.webContents.send('responseSelectingDirectory', {
        dirPath: null,
        isValid: false,
        isCancelled,
      })
      return
    }

    const store = new ElectronStore<SettingProperties>()
    store.set('knowledgeStoreDirectory', dirPath)

    mainWindow.webContents.send('responseSelectingDirectory', {
      dirPath: dirPath,
      isValid: true,
      isCancelled,
    })
  } catch (e) {
    log.error(`An error occurred while selecting knowledge directory: ${e}`)
    mainWindow.webContents.send('responseSelectingDirectory', {
      dirPath: null,
      isValid: false,
      isCancelled: false,
    })
  }
})

ipcMain.handle('requestSelectingApplication', async () => {
  try {
    const { isCancelled, appPath } = await selectApplication()

    if (!appPath) {
      mainWindow.webContents.send('responseSelectingApplication', {
        appPath: null,
        isValid: false,
        isCancelled,
      })
      return
    }

    const store = new ElectronStore<SettingProperties>()
    store.set('appForOpeningKnowledgeFile', appPath)

    mainWindow.webContents.send('responseSelectingApplication', {
      appPath: appPath,
      isValid: true,
      isCancelled,
    })
  } catch (e) {
    log.error(`An error occurred while selecting knowledge application: ${e}`)
    mainWindow.webContents.send('responseSelectingApplication', {
      appPath: null,
      isValid: false,
      isCancelled: false,
    })
  }
})

ipcMain.handle('requestResetApplication', async () => {
  try {
    const store = new ElectronStore<SettingProperties>()
    store.set('appForOpeningKnowledgeFile', null)

    mainWindow.webContents.send('responseResetApplication', {
      isDone: true,
      message: null,
    })
  } catch (e) {
    log.error(`An error occurred while resetting knowledge application: ${e}`)
    mainWindow.webContents.send('responseResetApplication', {
      isDone: false,
      message: e,
    })
  }
})

ipcMain.handle('requestNonce', () => nonce)

ipcMain.handle('showContextMenuToEditKnowledge', async (_event, knowledgeId: number) => {
  console.debug(`RECEIVE MESSAGE: showContextMenuToEditKnowledge id: ${knowledgeId}`)
  const template = [
    {
      label: 'このナレッジを編集する',
      click: () => {
        const targetKnowledgeFile = suggestItems.filter((item) => item.id === knowledgeId)[0]
        const knowledgeStoreDirectory = getSetting('knowledgeStoreDirectory')
        if (typeof knowledgeStoreDirectory !== 'string') {
          throw new ErrorReport('エラーが発生しました。', '設定ファイルが不正です。')
        }
        openKnowledgeFile(path.join(knowledgeStoreDirectory, targetKnowledgeFile.fileName))
      },
    },
  ]
  const menu = Menu.buildFromTemplate(template)
  menu.popup({
    window: mainWindow,
  })
})

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    if (currentAppMode === 'preference') {
      toggleMode('workbench')
    } else {
      hideWindow()
    }
  } else {
    toggleMode('workbench')
    showWindow()
  }
}

const prepareKnowledge = async (knowledgeStoreDirectoryPath: string) => {
  const files = await fs.readdir(knowledgeStoreDirectoryPath, { withFileTypes: true })
  const markdownFiles = files.filter((file) => file.isFile() && file.name.endsWith('.md'))

  suggestItems = await Promise.all(
    markdownFiles.map(async (mdFile, index) => {
      const fileText = await fs.readFile(
        path.join(knowledgeStoreDirectoryPath, mdFile.name),
        'utf8'
      )
      const parsedMd = marked.parse(fileText)
      const parsedHtml = parseHtml(parsedMd)
      return {
        id: index,
        title: parsedHtml.getElementsByTagName('h1')[0].text,
        contents: fileText,
        fileName: mdFile.name,
      }
    })
  )
}

const putTutorialKnowledge = async (knowledgeStoreDirectoryPath: string) => {
  const tutorialMarkdownDirPath = path.join(assetsDirPath, 'tutorial-md')
  const files = await fs.readdir(tutorialMarkdownDirPath, { withFileTypes: true })
  files
    .filter((file) => file.isFile() && file.name.endsWith('.md'))
    .forEach((file) => {
      const src = path.join(tutorialMarkdownDirPath, file.name)
      const dest = path.join(knowledgeStoreDirectoryPath, file.name)
      fs.copyFile(src, dest)
      log.info(`File copied: ${src} -> ${dest}`)
    })
}

app.whenReady().then(async () => {
  const setting = getAllSettings()

  await ensureDirectoryExists(setting.knowledgeStoreDirectory)

  if (
    !setting.isLaunchedPreviously &&
    (await countKnowledge(setting.knowledgeStoreDirectory)) === 0
  ) {
    await putTutorialKnowledge(setting.knowledgeStoreDirectory)
  }

  await prepareKnowledge(setting.knowledgeStoreDirectory)
  prepareSearchEngine(suggestItems)

  // 本番環境かつMacOSでの起動時、Dockにアイコンを表示させない
  if (app.isPackaged && process.platform === 'darwin') {
    app.dock.hide()
  }

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [`style-src 'self' 'nonce-${nonce}'; default-src 'self'`],
      },
    })
  })

  // 通知領域に表示させるアイコンの設定
  tray = new Tray(treyIconPath)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Toggle Knowledgebase', click: toggleWindow },
    { type: 'separator' },
    {
      label: 'Preference',
      accelerator: 'CommandOrControl+,',
      click: () => toggleMode('preference'),
    },
    { label: 'Quit', role: 'quit' },
  ])
  tray.setContextMenu(contextMenu)

  const primaryDisplay = screen.getPrimaryDisplay()
  const { width } = primaryDisplay.workAreaSize

  mainWindow = new BrowserWindow({
    width: 800,
    height: 94,
    backgroundColor: '#303032',
    resizable: false,
    transparent: false,
    frame: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // レンダラプロセスにおけるネットワーク疎通を無効化する
  mainWindow.webContents.session.enableNetworkEmulation({
    offline: true,
  })

  mainWindow.setPosition(Math.floor((width - 600) / 2), 200)

  if (isDevelopment) {
    mainWindow.webContents.openDevTools({ mode: 'detach', activate: false })
  }

  await mainWindow.loadFile('build/index.html')

  // ショートカットキーの設定
  globalShortcut.register('CommandOrControl+Alt+Space', toggleWindow)
  globalShortcut.register('CommandOrControl+,', () => toggleMode('preference'))

  app.on('browser-window-focus', () => {
    log.debug('Event: browser-window-focus')
    globalShortcut.register('CommandOrControl+,', () => toggleMode('preference'))
  })

  app.on('browser-window-blur', () => {
    log.debug('Event: browser-window-blur')
    if (mainWindow.isVisible() && currentAppMode !== 'preference') {
      hideWindow()
    }
    globalShortcut.unregister('CommandOrControl+,')
  })
})

process.on('uncaughtException', (error) => {
  log.error(error)
  dialog.showErrorBox('エラーが発生しました', error.message)
  app.quit()
})
