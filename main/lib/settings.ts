import fs from 'fs/promises'
import path from 'path'
import ElectronStore from 'electron-store'
import { ensureDirectoryExists } from './functions'

export interface Settings {
  knowledgeStoreDirectory: string
  appForOpeningKnowledgeFile: string | null
}

const parseSettingsString = async (settingsJsonPath: string) => {
  const settingsRawString = await fs.readFile(settingsJsonPath, 'utf8')
  const settings = JSON.parse(settingsRawString)

  // if (settings.hasOwnProperty('fontSize')) {
  //   const fontSize = settings.fontSize
  //   if (fontSize < 8 || fontSize > 24) {
  //     throw new Error('Invalid font size')
  //   }
  // }

  return settings
}

export const loadUserSettings = async (userDataDir: string): Promise<Settings> => {
  await ensureDirectoryExists(userDataDir)

  const store = new ElectronStore({
    defaults: {
      knowledgeStoreDirectory: path.join(userDataDir, 'knowledge'),
      appForOpeningKnowledgeFile: null,
    },
  })

  return store.store
}
