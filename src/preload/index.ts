import { contextBridge, ipcRenderer } from 'electron'
import { KnowledgeId } from '../shared/type'

contextBridge.exposeInMainWorld('api', {
  search: async (query: string) => ipcRenderer.invoke('search', query),
  createEmptyKnowledge: async (title: string) => ipcRenderer.invoke('createEmptyKnowledge', title),
  startKnowledgeEdit: async (knowledgeId: KnowledgeId) =>
    ipcRenderer.invoke('startKnowledgeEdit', knowledgeId),
})
