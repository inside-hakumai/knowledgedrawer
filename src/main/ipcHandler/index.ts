import { IpcMainInvokeEvent } from 'electron'
import { inject, injectable } from 'tsyringe'
import { KnowledgeApplication } from '@/application/KnowledgeApplication'
import { Knowledge } from '@/domain/model/Knowledge'
import { Result } from '@shared/result'
import { KnowledgeId } from '@shared/type'

export interface IpcHandler {
  handleSearch: (
    event: IpcMainInvokeEvent,
    ...args: [string]
  ) => Promise<Result<Knowledge[], string>>
  handleCreateEmptyKnowledge: (
    event: IpcMainInvokeEvent,
    ...args: [string]
  ) => Promise<Result<Knowledge, string>>
  handleStartKnowledgeEdit: (
    event: IpcMainInvokeEvent,
    ...args: [KnowledgeId]
  ) => Promise<Result<void, string>>
}

@injectable()
export class IpcHandlerImpl implements IpcHandler {
  constructor(
    @inject('KnowledgeApplication')
    private knowledgeApplication: KnowledgeApplication,
  ) {}

  async handleSearch(
    event: IpcMainInvokeEvent,
    ...args: [string]
  ): Promise<Result<Knowledge[], string>> {
    return await this.knowledgeApplication.searchKnowledges(args[0])
  }

  async handleCreateEmptyKnowledge(
    event: IpcMainInvokeEvent,
    ...args: [string]
  ): Promise<Result<Knowledge, string>> {
    return await this.knowledgeApplication.createEmptyKnowledgeWithTitle(args[0])
  }

  async handleStartKnowledgeEdit(
    event: IpcMainInvokeEvent,
    ...args: [KnowledgeId]
  ): Promise<Result<void, string>> {
    return await this.knowledgeApplication.startKnowledgeEdit(args[0])
  }
}
