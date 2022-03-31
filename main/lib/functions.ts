import { constants } from 'fs'
import fs from 'fs/promises'
import log from 'electron-log'
import Fuse from 'fuse.js'
import open from 'open'
import { getSetting } from './settings'

let fuse: Fuse<{ id: number; title: string; contents: string }> | null = null

export const prepareSearchEngine = (
  collection: { id: number; title: string; contents: string }[]
) => {
  fuse = new Fuse(collection, {
    includeScore: true,
    keys: ['title', 'contents'],
  })
}

export const searchKnowledge = (query: string) => {
  if (fuse === null) {
    throw new Error('Fuse instance is not initialized')
  }

  return fuse.search(query)
}

export const isExecutable = async (path: string) => {
  try {
    await fs.access(path, constants.X_OK)
    return true
  } catch (error) {
    return false
  }
}

export const isDirectoryExists = async (dirPath: string) => {
  try {
    const stat = await fs.stat(dirPath)
    return stat.isDirectory()
  } catch (error) {
    return false
  }
}

export const ensureDirectoryExists = async (dirPath: string) => {
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

export const countKnowledge = async (knowledgeStoreDirectoryPath: string): Promise<number> => {
  const files = await fs.readdir(knowledgeStoreDirectoryPath, { withFileTypes: true })
  return files.filter((file) => file.isFile() && file.name.endsWith('.md')).length
}

export const openKnowledgeFile = async (filePath: string) => {
  const appForOpen = getSetting('appForOpeningKnowledgeFile')

  if (!(appForOpen === null || typeof appForOpen === 'string')) {
    throw new Error('Invalid appForOpeningKnowledgeFile setting: ' + appForOpen)
  }

  if (appForOpen === null) {
    await open(filePath)
    log.info(`Open ${filePath} with system default application`)
  } else if (!(await isExecutable(appForOpen))) {
    log.warn(`Invalid appForOpeningKnowledgeFile setting: ${appForOpen}`)
    await open(filePath)
    log.info(`Open ${filePath} with system default application`)
  } else {
    await open(filePath, {
      app: {
        name: appForOpen,
      },
    })
    log.info(`Open ${filePath} with ${appForOpen}`)
  }
}
