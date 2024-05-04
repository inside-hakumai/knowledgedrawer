import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  search: async (query: string) => ipcRenderer.invoke('search', query),
})
