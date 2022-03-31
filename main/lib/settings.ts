import path from 'path'
import { app } from 'electron'
import ElectronStore from 'electron-store'
import { SettingProperties } from '../../@types/global'

export const getSetting = (field: keyof SettingProperties): string | boolean | null => {
  const store = new ElectronStore<SettingProperties>({
    defaults: {
      knowledgeStoreDirectory: path.join(app.getPath('userData'), 'knowledge'),
      appForOpeningKnowledgeFile: null,
      shouldShowTutorial: true,
      isLaunchedPreviously: false,
    },
  })
  return store.get(field)
}

export const getAllSettings = (): SettingProperties => {
  const store = new ElectronStore<SettingProperties>({
    defaults: {
      knowledgeStoreDirectory: path.join(app.getPath('userData'), 'knowledge'),
      appForOpeningKnowledgeFile: null,
      shouldShowTutorial: true,
      isLaunchedPreviously: false,
    },
  })

  // TODO: ファイルから取得した設定値の妥当性を検証する

  return store.store
}
