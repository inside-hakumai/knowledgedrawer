import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
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
    ipcRenderer.on('doneWriteClipboard', (_event, _result) => {
      console.debug('RECEIVE MESSAGE: doneWriteClipboard')
      callback()
    })
  },

  requestDeactivate: async (): Promise<void> => {
    console.debug('REQUEST MESSAGE: requestDeactivate')
    return await ipcRenderer.invoke('requestDeactivate')
  },

  onDoneDeactivate: (callback: Function) => {
    ipcRenderer.on('doneDeactivate', (_event, _result) => {
      console.debug('RECEIVE MESSAGE: doneDeactivate')
      callback()
    })
  },

  createNewKnowledge: async (): Promise<void> => {
    await ipcRenderer.invoke('createNewKnowledge')
  },

  onToggleMode: (callback: (_event: IpcRendererEvent, ..._args: any[]) => void) => {
    ipcRenderer.on('toggleMode', callback)
    // ipcRenderer.on('toggleMode', (_event, mode) => {
    //   console.log(callback)
    //   console.debug('RECEIVE MESSAGE: toggleMode')
    //   callback(mode)
    // })
  },

  exitPreference: async (): Promise<void> => {
    await ipcRenderer.invoke('exitPreference')
  },

  cleanupOnUnmountWorkbench: async (listeners: [string, (..._args: any) => void][]) => {
    console.log(listeners)
    listeners.forEach(([event, listener]) => {
      ipcRenderer.removeListener(event, listener)
    })
  },

  requestUserSettings: async (): Promise<void> => {
    console.debug('REQUEST MESSAGE: requestUserSettings')
    await ipcRenderer.invoke('requestUserSettings')
  },

  onReceiveUserSettings: (callback: Function) => {
    ipcRenderer.on('responseUserSettings', (event, settings) => {
      console.debug('RECEIVE MESSAGE: responseUserSettings, result:', settings)
      callback(settings)
    })
  },

  requestSelectingDirectory: async (): Promise<void> => {
    console.debug('REQUEST MESSAGE: requestSelectingDirectory')
    await ipcRenderer.invoke('requestSelectingDirectory')
  },

  onReceiveSelectingDirectory: (callback: Function) => {
    ipcRenderer.on(
      'responseSelectingDirectory',
      (event, result: { dirPath: string | null; isValid: boolean; isCancelled: boolean }) => {
        const { dirPath } = result

        console.debug('RECEIVE MESSAGE: responseSelectingDirectory, result:', dirPath)
        callback(result)
      }
    )
  },

  requestNonce: () => ipcRenderer.invoke('requestNonce'),

  requestSelectingApplication: async (): Promise<void> => {
    console.debug('REQUEST MESSAGE: requestSelectingApplication')
    await ipcRenderer.invoke('requestSelectingApplication')
  },

  onReceiveSelectingApplication: (callback: Function) => {
    ipcRenderer.on(
      'responseSelectingApplication',
      (event, result: { appPath: string | null; isValid: boolean; isCancelled: boolean }) => {
        const { appPath } = result

        console.debug('RECEIVE MESSAGE: responseSelectingApplication, result:', appPath)
        callback(result)
      }
    )
  },

  requestResetApplication: async (): Promise<void> => {
    console.debug('REQUEST MESSAGE: requestResetApplication')
    await ipcRenderer.invoke('requestResetApplication')
  },

  onReceiveResetApplication: (callback: Function) => {
    ipcRenderer.on(
      'responseResetApplication',
      (event, result: { isDone: boolean; message: string | null }) => {
        console.debug('RECEIVE MESSAGE: responseResetApplication, result:', result)
        callback(result)
      }
    )
  },

  removeAllListenersForPreference: () => {
    ipcRenderer.removeAllListeners('responseSelectingDirectory')
    ipcRenderer.removeAllListeners('responseSelectingApplication')
    ipcRenderer.removeAllListeners('responseResetApplication')
  },

  showContextMenuToEditKnowledge: async (knowledgeId: number): Promise<void> => {
    await ipcRenderer.invoke('showContextMenuToEditKnowledge', knowledgeId)
  },
})
