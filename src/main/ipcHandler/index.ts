import { Knowledge } from '../domain/model/Knowledge'
import { Result } from '../../shared/result'
import { KnowledgeStoreApplication } from '../application/KnowledgeStore/KnowledgeStoreApplication'
import { inject, injectable } from 'tsyringe'
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent

export interface IpcHandler {
  handleSearch: (
    event: IpcMainInvokeEvent,
    ...args: [string]
  ) => Promise<Result<Knowledge[], string>>
}

@injectable()
export class IpcHandlerImpl implements IpcHandler {
  constructor(
    @inject('KnowledgeStoreApplication')
    private knowledgeStoreApplication: KnowledgeStoreApplication,
  ) {}

  async handleSearch(
    event: IpcMainInvokeEvent,
    ...args: [string]
  ): Promise<Result<Knowledge[], string>> {
    return await this.knowledgeStoreApplication.searchKnowledges(args[0])
  }
}
