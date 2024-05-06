import { container } from 'tsyringe'
import { KnowledgeLocalFileBasedRepository } from './infrastructure/repository/KnowledgeLocalFileBasedRepository'
import { KnowledgeRepository } from './domain/repository/KnowledgeRepository'
import { KnowledgeApplication, KnowledgeApplicationImpl } from './application/KnowledgeApplication'
import { IpcHandler, IpcHandlerImpl } from './ipcHandler'
import { ElectronApiRepository as IElectronApiRepository } from './domain/repository/ElectronApiRepository'
import { ElectronApiRepository } from './infrastructure/repository/ElectronApiRepository'
import { getExecMode } from './lib/environment'
import { KnowledgeUserDataBasedRepository } from './infrastructure/repository/KnowledgeUserDataBasedRepository'

export const initContainer = () => {
  container.register<IpcHandler>('IpcHandler', {
    useClass: IpcHandlerImpl,
  })
  container.register<KnowledgeApplication>('KnowledgeApplication', {
    useClass: KnowledgeApplicationImpl,
  })
  container.register<IElectronApiRepository>('ElectronApiRepository', {
    useClass: ElectronApiRepository,
  })

  if (getExecMode() === 'development-devserver') {
    container.register<KnowledgeRepository>('KnowledgeRepository', {
      useClass: KnowledgeLocalFileBasedRepository,
    })
  }

  if (getExecMode() === 'development-unpackaged') {
    container.register<KnowledgeRepository>('KnowledgeRepository', {
      useClass: KnowledgeUserDataBasedRepository,
    })
  }
}
