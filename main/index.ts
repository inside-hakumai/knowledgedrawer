import electron from 'electron'
import path from 'path'

const { BrowserWindow, app, screen, ipcMain, ipcRenderer } = electron

const isDevelopment = process.env.NODE_ENV === 'development'

if (isDevelopment) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
    forceHardReset: true,
    hardResetMethod: 'exit',
  })
}

let mainWindow: Electron.BrowserWindow

app.whenReady().then(async () => {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  mainWindow = new BrowserWindow({
    width: 800,
    height: 94,
    resizable: false,
    transparent: true,
    frame: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  mainWindow.setPosition(Math.floor((width - 600) / 2), 200)

  if (isDevelopment) {
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  }

  await mainWindow.loadFile('dist/index.html')
})

ipcMain.handle('requestSearch', (event, query: string) => {
  console.debug(`Search request: ${query}`)

  // ここに検索処理を書く

  const sampleSuggestItems = [
    'SpringBoot @Transactional',
    'SpringBoot Mybatisのテスト',
    'SpringBoot Thymeleafのテスト',
    'WHERE句でnullを指定する',
    'hoge',
    'huga',
  ]

  mainWindow.setSize(800, 752)
  // event.reply('responseSearch', sampleSuggestItems)
  mainWindow.webContents.send('responseSearch', sampleSuggestItems)
})

ipcMain.handle('clearSearch', (event) => {
  mainWindow.setSize(800, 94)
})
