import 'reflect-metadata'
import './diContainer'
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { color } from '../constants'
import { container } from 'tsyringe'
import { KnowledgeApplication } from './application/KnowledgeApplication'
import { IpcHandler } from './ipcHandler'
import { getExecMode } from './lib/environment'

const ipcHandler = container.resolve<IpcHandler>('IpcHandler')

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

  if (process.env.NODE_ENV === 'development') {
    await mainWindow.loadURL('http://localhost:51645')
    mainWindow.webContents.openDevTools({
      mode: 'detach',
    })
  } else {
    await mainWindow.loadFile('renderer/index.html')
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
