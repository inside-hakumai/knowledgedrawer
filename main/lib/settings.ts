import { Stats } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import { ensureDirectoryExists } from './functions'

export interface Settings {
  knowledgeStoreDirectory: string
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

  const settingsJsonPath = path.join(userDataDir, 'settings.json')

  let stat: Stats
  try {
    stat = await fs.stat(settingsJsonPath)
  } catch (error) {
    // fs.statはファイルが存在しなかった場合にエラーを返す
    const defaultSettings: Settings = {
      knowledgeStoreDirectory: path.join(userDataDir, 'knowledge'),
    }
    await fs.writeFile(settingsJsonPath, JSON.stringify(defaultSettings))

    return defaultSettings
  }

  if (stat.isFile()) {
    try {
      return parseSettingsString(settingsJsonPath)
    } catch (e) {
      throw new Error('設定ファイルの中身が不正です。')
    }
  } else {
    // TODO: 設定ファイルが置いてある想定のパスにファイル以外のものがあった場合のユーザーに見せるエラーメッセージを検討する
    throw new Error('設定ファイルのファイル形式が不正です。')
  }
}
