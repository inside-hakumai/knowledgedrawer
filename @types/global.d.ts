import { IPCFunctions } from './preload'

declare global {
  interface Window {
    api: IPCFunctions
  }
}

interface SettingProperties {
  knowledgeStoreDirectory: string
  appForOpeningKnowledgeFile: string | null
  shouldShowTutorial: boolean
}
