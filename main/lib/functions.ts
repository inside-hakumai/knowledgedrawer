import fs from 'fs/promises'
import Fuse from 'fuse.js'

let fuse: Fuse<{ title: string; contents: string }> | null = null

export const prepareSearchEngine = (collection: { title: string; contents: string }[]) => {
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
