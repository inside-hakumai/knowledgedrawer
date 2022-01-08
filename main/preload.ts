import { contextBridge, ipcRenderer } from 'electron'
import { IPCFunctions } from '../@types/preload'

contextBridge.exposeInMainWorld('api', <IPCFunctions>{
  search: async (query: string): Promise<string[]> => {
    console.debug('REQUEST MESSAGE: requestSearch')
    return await ipcRenderer.invoke('requestSearch', query)
  },

  clearSearch: async (): Promise<void> => {
    console.debug('REQUEST MESSAGE: clearSearch')
    return await ipcRenderer.invoke('clearSearch')
  },

  onReceiveSuggestions: (callback: Function) => {
    ipcRenderer.on('responseSearch', (event, result) => {
      console.debug('RECEIVE MESSAGE: responseSearch, result:', result)
      callback(result)
    })
  },

  writeClipboard: async (text: string): Promise<void> => {
    console.debug('REQUEST MESSAGE: writeClipboard')
    return await ipcRenderer.invoke('writeClipboard', text)
  },

  onDoneWriteClipboard: (callback: Function) => {
    ipcRenderer.on('doneWriteClipboard', (event, result) => {
      console.debug('RECEIVE MESSAGE: doneWriteClipboard')
      callback()
    })
  },

  requestDeactivate: async (): Promise<void> => {
    console.debug('REQUEST MESSAGE: requestDeactivate')
    return await ipcRenderer.invoke('requestDeactivate')
  },

  onDoneDeactivate: (callback: Function) => {
    ipcRenderer.on('doneDeactivate', (event, result) => {
      console.debug('RECEIVE MESSAGE: doneDeactivate')
      callback()
    })
  },
})
