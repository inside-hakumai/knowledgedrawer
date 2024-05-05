import { container } from 'tsyringe'
import { KnowledgeLocalFileBasedRepository } from './infrastructure/repository/KnowledgeLocalFileBasedRepository'
import { KnowledgeRepository } from './domain/repository/KnowledgeRepository'
import { KnowledgeApplication, KnowledgeApplicationImpl } from './application/KnowledgeApplication'
import { IpcHandler, IpcHandlerImpl } from './ipcHandler'
import { ElectronApiRepository as IElectronApiRepository } from './domain/repository/ElectronApiRepository'
import { ElectronApiRepository } from './infrastructure/repository/ElectronApiRepository'

container.register<IpcHandler>('IpcHandler', {
  useClass: IpcHandlerImpl,
})
container.register<KnowledgeApplication>('KnowledgeApplication', {
  useClass: KnowledgeApplicationImpl,
})
container.register<KnowledgeRepository>('KnowledgeRepository', {
  useClass: KnowledgeLocalFileBasedRepository,
})
container.register<IElectronApiRepository>('ElectronApiRepository', {
  useClass: ElectronApiRepository,
})
