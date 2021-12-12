import electron from 'electron'
import path from 'path'
import * as fs from 'fs/promises'
import { marked } from 'marked'
import { parse as parseHtml } from 'node-html-parser'

const { BrowserWindow, app, screen, ipcMain } = electron

const isDevelopment = process.env.NODE_ENV === 'development'

if (isDevelopment) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
    forceHardReset: true,
    hardResetMethod: 'exit',
  })
}

let mainWindow: Electron.BrowserWindow
let suggestItems: { title: string; contents: string }[] = []

app.whenReady().then(async () => {
  await prepareUserData()

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

  mainWindow.setSize(800, 752)
  // event.reply('responseSearch', sampleSuggestItems)
  mainWindow.webContents.send('responseSearch', suggestItems)
})

ipcMain.handle('clearSearch', (event) => {
  mainWindow.setSize(800, 94)
})

const prepareUserData = async () => {
  const userDataDir = app.getPath('userData')
  const knowledgeDir = path.join(userDataDir, 'knowledge')

  await ensureDirectoryExists(knowledgeDir)

  const files = await fs.readdir(knowledgeDir, { withFileTypes: true })
  const markdownFiles = files.filter((file) => file.isFile() && file.name.endsWith('.md'))

  suggestItems = await Promise.all(
    markdownFiles.map(async (mdFile) => {
      const fileText = await fs.readFile(path.join(knowledgeDir, mdFile.name), 'utf8')
      const parsedMd = marked.parse(fileText)
      const parsedHtml = parseHtml(parsedMd)
      return {
        title: parsedHtml.getElementsByTagName('h1')[0].text,
        contents: fileText,
      }
    })
  )
}

const ensureDirectoryExists = async (dirPath: string) => {
  let isFile = false

  try {
    const stat = await fs.stat(dirPath)
    if (stat.isFile()) {
      isFile = true
    }
  } catch (error) {
    await fs.mkdir(dirPath)
  }

  if (isFile) {
    throw new Error('Specified path is file path')
  }
}
