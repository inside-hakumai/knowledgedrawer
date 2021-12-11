import electron from 'electron'
import path from 'path'

const { BrowserWindow, app } = electron

const isDevelopment = process.env.NODE_ENV === 'development'

if (isDevelopment) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
    forceHardReset: true,
    hardResetMethod: 'exit',
  })
}

app.whenReady().then(async () => {
  const mainWindow = new BrowserWindow({ width: 800, height: 1500 })

  mainWindow.webContents.openDevTools({ mode: 'detach' })
  await mainWindow.loadFile('dist/index.html')
})
