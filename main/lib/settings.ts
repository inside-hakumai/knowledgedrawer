import path from 'path'
import { app } from 'electron'
import ElectronStore from 'electron-store'
import { SettingProperties } from '../../@types/global'

const getStore = (): ElectronStore<SettingProperties> => {
  return new ElectronStore<SettingProperties>({
    defaults: {
      knowledgeStoreDirectory: path.join(app.getPath('userData'), 'knowledge'),
      appForOpeningKnowledgeFile: null,
      shouldShowTutorial: true,
      isLaunchedPreviously: false,
    },
  })
}

const isValidPropertyValue = (field: keyof SettingProperties, value: any): boolean => {
  if (field === 'knowledgeStoreDirectory') {
    return typeof value === 'string'
  } else if (field === 'appForOpeningKnowledgeFile') {
    return value === null || typeof value === 'string'
  } else if (field === 'shouldShowTutorial') {
    return typeof value === 'boolean'
  } else if (field === 'isLaunchedPreviously') {
    return typeof value === 'boolean'
  } else {
    throw new Error(`Unexpected property: ${field}`)
  }
}

export const getSetting = (field: keyof SettingProperties): string | boolean | null => {
  return getStore().get(field)
}

export const putSetting = (
  field: keyof SettingProperties,
  value: string | boolean | null
): void => {
  if (!isValidPropertyValue(field, getStore().get(field))) {
    throw new Error(`Invalid property value for ${field}: ${value}`)
  }

  getStore().set(field, value)
}

export const getAllSettings = (): SettingProperties => {
  // TODO: ファイルから取得した設定値の妥当性を検証する
  return getStore().store
}
