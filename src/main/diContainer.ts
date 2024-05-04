import { container } from 'tsyringe'
import { KnowledgeLocalFileBasedRepository } from './infrastructure/repository/KnowledgeLocalFileBasedRepository'
import { KnowledgeRepository } from './domain/repository/KnowledgeRepository'
import {
  KnowledgeStoreApplication,
  KnowledgeStoreApplicationImpl,
} from './application/KnowledgeStore/KnowledgeStoreApplication'
import { IpcHandler, IpcHandlerImpl } from './ipcHandler'

container.register<IpcHandler>('IpcHandler', {
  useClass: IpcHandlerImpl,
})
container.register<KnowledgeStoreApplication>('KnowledgeStoreApplication', {
  useClass: KnowledgeStoreApplicationImpl,
})
container.register<KnowledgeRepository>('KnowledgeRepository', {
  useClass: KnowledgeLocalFileBasedRepository,
})
