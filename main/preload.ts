import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  search: async (query: string): Promise<String[]> => {
    console.debug('REQUEST MESSAGE: requestSearch')
    return await ipcRenderer.invoke('requestSearch', query)
  },

  clearSearch: async (): Promise<void> => {
    console.debug('REQUEST MESSAGE: clearSearch')
    return await ipcRenderer.invoke('clearSearch')
  },

  onReceiveSuggest: (callback: Function) => {
    ipcRenderer.on('responseSearch', (event, result) => {
      console.debug('RECEIVE MESSAGE: responseSearch, result:', result)
      callback(result)
    })
  },

  requestDeactivate: async (): Promise<void> => {
    console.debug('REQUEST MESSAGE: requestDeactivate')
    return await ipcRenderer.invoke('requestDeactivate')
  },

  onDoneDeactivate: (callback: Function) => {
    ipcRenderer.on('doneDeactivate', (event, result) => {
      console.debug('RECEIVE MESSAGE: doneDeactivate')
      callback(result)
    })
  },
})
