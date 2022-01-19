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
}
