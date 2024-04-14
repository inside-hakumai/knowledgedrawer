import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'

const getPreloadScriptPath = () => {
  if (process.env.NODE_ENV === 'development') {
    return path.join(__dirname, '..', 'preload', 'index.js')
  } else {
    // ビルド後のメインプロセスのファイルがout/main.jsであり、同階層にpreload.jsがあるという想定
    return path.join(__dirname, 'preload.js')
  }
}

let mainWindow: BrowserWindow | null

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      // preload: getPreloadScriptPath()
    },
    frame: false,
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
    await mainWindow.loadFile('out/renderer/index.html')
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

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
