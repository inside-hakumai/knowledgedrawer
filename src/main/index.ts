import 'reflect-metadata'
import { app, BrowserWindow, ipcMain } from 'electron'
import log from 'electron-log'
import path from 'path'
import { container } from 'tsyringe'
import { initContainer } from '@/diContainer'
import { IpcHandler } from '@/ipcHandler'
import { getExecMode } from '@/lib/environment'
import { color } from '@shared/constants'

log.transports.console.format =
  '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}][{processType}]{scope} {text}'
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}][{processType}]{scope} {text}'

log.initialize()

const logger = log.scope('index')

switch (getExecMode()) {
  case 'development-devserver':
  case 'development-unpackaged':
    app.setName('knowledgedrawer-development')

    const userDataDirPath = path.join(app.getPath('appData'), 'KnowledgeDrawer-development')
    app.setPath('userData', userDataDirPath)
    break
  case 'production':
    break
}

logger.log(`Log file path: ${log.transports.file.getFile().path}`)
logger.log(`Exec mode: ${getExecMode()}`)

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  app.quit()
})

let ipcHandler: IpcHandler
try {
  initContainer()
  ipcHandler = container.resolve<IpcHandler>('IpcHandler')
} catch (e) {
  logger.error(`Failed to initialize container: ${e}`)
  app.quit()
}

const getPreloadScriptPath = () => {
  // ビルド後のメインプロセスのファイルがout/main.jsであり、同階層にpreload.jsがあるという想定
  return path.join(__dirname, 'preload.js')
}

let mainWindow: BrowserWindow | null

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    backgroundColor: color.bg.l0,
    resizable: false,
    transparent: false,
    frame: false,
    maximizable: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: getPreloadScriptPath(),
    },
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  switch (getExecMode()) {
    case 'development-devserver':
      await mainWindow.loadURL('http://localhost:51645')
      mainWindow.webContents.openDevTools({
        mode: 'detach',
      })
      break
    case 'development-unpackaged':
      await mainWindow.loadFile('renderer/index.html')
      break
    case 'production':
      await mainWindow.loadFile('out/renderer/index.html')
      break
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  ipcMain.handle('search', ipcHandler.handleSearch.bind(ipcHandler))
  ipcMain.handle('createEmptyKnowledge', ipcHandler.handleCreateEmptyKnowledge.bind(ipcHandler))
  ipcMain.handle('startKnowledgeEdit', ipcHandler.handleStartKnowledgeEdit.bind(ipcHandler))

  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
