import electron from 'electron'
import path from 'path'

const { BrowserWindow, app, screen } = electron

const isDevelopment = process.env.NODE_ENV === 'development'

if (isDevelopment) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
    forceHardReset: true,
    hardResetMethod: 'exit',
  })
}

app.whenReady().then(async () => {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  const mainWindow = new BrowserWindow({
    width: 600,
    height: 100,
    resizable: false,
    transparent: true,
    frame: false,
    maximizable: false,
  })

  mainWindow.setPosition(Math.floor((width - 600) / 2), 200)

  mainWindow.webContents.openDevTools({ mode: 'detach' })
  await mainWindow.loadFile('dist/index.html')
})
