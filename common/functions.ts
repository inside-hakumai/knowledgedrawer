import { SettingProperties } from '../@types/global'

export const isSettings = (value: any): value is SettingProperties => {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.knowledgeStoreDirectory === 'string' &&
    (typeof value.appForOpeningKnowledgeFile === 'string' ||
      value.appForOpeningKnowledgeFile === null) &&
    typeof value.shouldShowTutorial === 'boolean'
  )
}
