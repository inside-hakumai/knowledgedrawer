import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  search: async (query: string): Promise<String[]> => {
    return await ipcRenderer.invoke('requestSearch', query)
  },

  clearSearch: async (): Promise<void> => {
    return await ipcRenderer.invoke('clearSearch')
  },

  onReceiveSuggest: (callback: Function) => {
    ipcRenderer.on('responseSearch', (event, result) => {
      console.debug('Search response:', result)
      callback(result)
    })
  },
})
