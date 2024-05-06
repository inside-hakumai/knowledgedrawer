import { container } from 'tsyringe'
import { KnowledgeApplication, KnowledgeApplicationImpl } from '@/application/KnowledgeApplication'
import { ElectronApiRepository as IElectronApiRepository } from '@/domain/repository/ElectronApiRepository'
import { KnowledgeRepository } from '@/domain/repository/KnowledgeRepository'
import { ElectronApiRepository } from '@/infrastructure/repository/ElectronApiRepository'
import { KnowledgeLocalFileBasedRepository } from '@/infrastructure/repository/KnowledgeLocalFileBasedRepository'
import { KnowledgeUserDataBasedRepository } from '@/infrastructure/repository/KnowledgeUserDataBasedRepository'
import { IpcHandler, IpcHandlerImpl } from '@/ipcHandler'
import { getExecMode } from '@/lib/environment'

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

  if (getExecMode() === 'production') {
    container.register<KnowledgeRepository>('KnowledgeRepository', {
      useClass: KnowledgeUserDataBasedRepository,
    })
  }
}
