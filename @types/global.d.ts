import { IPCFunctions } from 'preload'

declare global {
  interface Window {
    api: IPCFunctions
  }
}
