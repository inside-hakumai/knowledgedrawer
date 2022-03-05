/* eslint-disable no-unused-vars */
import IpcRendererEvent = Electron.IpcRendererEvent

export interface IPCFunctions {
  search: (query: string) => Promise<string[]>
  clearSearch: () => Promise<void>
  onReceiveSuggestions: (
    callback: (suggestions: { title: string; contents: string }[]) => void
  ) => void
  writeClipboard: (text: string) => Promise<void>
  onDoneWriteClipboard: (callback: () => void) => void
  requestDeactivate: () => Promise<void>
  onDoneDeactivate: (callback: () => void) => void
  createNewKnowledge: () => Promise<void>
  onToggleMode: (callback: (event: IpcRendererEvent, ...args: any[]) => void) => void
  exitPreference: () => Promise<void>
  cleanupOnUnmountWorkbench: (listeners: [string, (...args: any) => void][]) => Promise<void>
  requestUserSettings: () => Promise<void>
  onReceiveUserSettings: (callback: Function) => void
  requestSelectingDirectory: () => Promise<void>
  onReceiveSelectingDirectory: (callback: Function) => void
  requestNonce: () => Promise<string>
  requestSelectingApplication: () => Promise<void>
  onReceiveSelectingApplication: (callback: Function) => void
}
