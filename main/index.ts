import * as fs from 'fs/promises'
import path from 'path'
import electron from 'electron'
import log from 'electron-log'
import ElectronStore from 'electron-store'
import { marked } from 'marked'
import { parse as parseHtml } from 'node-html-parser'
import open from 'open'
import randomstring from 'randomstring'
import { ErrorReport } from './lib/error'
import {
  ensureDirectoryExists,
  isDirectoryExists,
  prepareSearchEngine,
  searchKnowledge,
} from './lib/functions'
import { loadUserSettings, Settings } from './lib/settings'

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

// 通知領域に表示させるアイコンの画像のパス
let treyIconPath: string

// ウィンドウを非表示にする挙動を無効にするかどうか（開発時に使用）
const isDisabledDeactivation = isDevelopment && process.env.DISABLE_DEACTIVATION === 'true'

const trayIconFileName = nativeTheme.shouldUseDarkColors ? 'trayIcon-dark.png' : 'trayIcon.png'

if (isDevelopment) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
    forceHardReset: true,
    hardResetMethod: 'exit',
  })

  treyIconPath = path.join(__dirname, '..', 'assets', trayIconFileName)
} else {
  Object.assign(console, log.functions)
  treyIconPath = path.join(process.resourcesPath, 'assets', trayIconFileName)
}

const nonce = Buffer.from(randomstring.generate()).toString('base64')

let mainWindow: Electron.BrowserWindow
let tray: electron.Tray | null = null
let currentSettings: Settings | null = null
let suggestItems: { title: string; contents: string }[] = []

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

  const store = new ElectronStore()
  const knowledgeDir = store.get('knowledgeStoreDirectory', null)

  // noinspection SuspiciousTypeOfGuard
  if (typeof knowledgeDir !== 'string' || !(await isDirectoryExists(knowledgeDir))) {
    throw new Error(`Invalid knowledgeStoreDirectory setting: ${knowledgeDir}`)
  }

  const destFilePath = path.join(knowledgeDir, `${Date.now()}.md`)

  await fs.copyFile(templateFilePath, destFilePath)
  await open(destFilePath)
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

  if (mode === 'preference') {
    mainWindow.webContents.send('toggleMode', mode, currentSettings)
  } else {
    mainWindow.webContents.send('toggleMode', mode)
  }
}

const selectDirectory = async (): Promise<string | null> => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  })

  if (canceled || !filePaths) {
    return null
  }

  return filePaths[0]
}

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
    const dirPath = await selectDirectory()

    if (!dirPath) {
      mainWindow.webContents.send('responseSelectingDirectory', {
        dirPath: null,
        isValid: false,
      })
      return
    }

    const store = new ElectronStore()
    store.set('knowledgeStoreDirectory', dirPath)

    mainWindow.webContents.send('responseSelectingDirectory', {
      dirPath: dirPath,
      isValid: true,
    })
  } catch (e) {
    log.error(`An error occurred while selecting knowledge directory: ${e}`)
    mainWindow.webContents.send('responseSelectingDirectory', {
      dirPath: null,
      isValid: false,
    })
  }
})

ipcMain.handle('requestNonce', () => nonce)

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    hideWindow()
  } else {
    showWindow()
  }
}

const prepareKnowledge = async (knowledgeStoreDirectoryPath: string) => {
  await ensureDirectoryExists(knowledgeStoreDirectoryPath)

  const files = await fs.readdir(knowledgeStoreDirectoryPath, { withFileTypes: true })
  const markdownFiles = files.filter((file) => file.isFile() && file.name.endsWith('.md'))

  suggestItems = await Promise.all(
    markdownFiles.map(async (mdFile) => {
      const fileText = await fs.readFile(
        path.join(knowledgeStoreDirectoryPath, mdFile.name),
        'utf8'
      )
      const parsedMd = marked.parse(fileText)
      const parsedHtml = parseHtml(parsedMd)
      return {
        title: parsedHtml.getElementsByTagName('h1')[0].text,
        contents: fileText,
      }
    })
  )
}

app.whenReady().then(async () => {
  const userDataDir = app.getPath('userData')

  try {
    currentSettings = await loadUserSettings(userDataDir)
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new ErrorReport('初期化中にエラーが発生しました。', e.message)
    } else {
      throw e
    }
  }

  await prepareKnowledge(currentSettings.knowledgeStoreDirectory)
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
    { label: 'Preference', click: () => toggleMode('preference') },
    { label: 'Quit', role: 'quit' },
  ])
  tray.setContextMenu(contextMenu)

  const primaryDisplay = screen.getPrimaryDisplay()
  const { width } = primaryDisplay.workAreaSize

  mainWindow = new BrowserWindow({
    width: 800,
    height: 94,
    backgroundColor: '#0092a5',
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

  globalShortcut.register('Alt+Command+Space', () => {
    toggleWindow()
  })

  await mainWindow.loadFile('build/index.html')

  app.on('browser-window-blur', () => {
    if (mainWindow.isVisible()) {
      hideWindow()
    }
  })
})

process.on('uncaughtException', (error) => {
  log.error(error)
  dialog.showErrorBox('エラーが発生しました', error.message)
  app.quit()
})
