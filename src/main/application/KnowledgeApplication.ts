import { Knowledge } from '../domain/model/Knowledge'
import { Failure, Ok, Result, Success } from '../../shared/result'
import { KnowledgeRepository } from '../domain/repository/KnowledgeRepository'
import { inject, injectable } from 'tsyringe'
import Fuse from 'fuse.js'
import { KnowledgeStoreCache } from '../domain/model/KnowledgeStoreCache'
import { KnowledgeId } from '../../shared/type'
import { ElectronApiRepository } from '../domain/repository/ElectronApiRepository'
import log from 'electron-log'

const logger = log.scope('KnowledgeApplication')

export interface KnowledgeApplication {
  loadKnowledges: () => Promise<Result<Knowledge[], string>>
  searchKnowledges: (query: string) => Promise<Result<Knowledge[], string>>
  createEmptyKnowledgeWithTitle: (title: string) => Promise<Result<Knowledge, string>>
  startKnowledgeEdit: (knowledgeId: KnowledgeId) => Promise<Result<void, string>>
}

@injectable()
export class KnowledgeApplicationImpl implements KnowledgeApplication {
  private cache = KnowledgeStoreCache.getInstance()

  constructor(
    @inject('KnowledgeRepository') private knowledgeRepository: KnowledgeRepository,
    @inject('ElectronApiRepository') private electronApiRepository: ElectronApiRepository,
  ) {
    try {
      ;(async () => {
        await this.reloadCache()

        this.knowledgeRepository.addKnowledgeChangedListener(async (knowledgeId) => {
          await this.reloadCache()
        })
      })()
    } catch (e) {
      throw new Error(`Failed to initialize KnowledgeApplicationImpl: ${e}`)
    }
  }

  public async loadKnowledges() {
    const cacheResult = this.cache.get()
    if (cacheResult.isSuccess) {
      return cacheResult
    }

    const result = await this.knowledgeRepository.getAll()
    if (!result.isSuccess) {
      return Failure(result.data)
    }

    this.cache.set(result.data)
    return Success(result.data)
  }

  public async reloadCache(): Promise<Result<void, string>> {
    const result = await this.knowledgeRepository.getAll()
    if (!result.isSuccess) {
      return Failure(result.data)
    }

    this.cache.set(result.data)
    logger.log(`Reloaded cache: ${result.data.length} knowledges`)

    return Ok()
  }

  public async searchKnowledges(query: string) {
    const knowledgesResult = await this.loadKnowledges()
    if (!knowledgesResult.isSuccess) {
      return Failure(knowledgesResult.data)
    }

    const knowledges = knowledgesResult.data

    const fuse = new Fuse(knowledges, {
      keys: ['title', 'contents'],
    })

    const searchResult = fuse.search(query).map((result) => result.item)
    return Success(searchResult)
  }

  public async createEmptyKnowledgeWithTitle(title: string) {
    const result = await this.knowledgeRepository.createEmptyKnowledgeWithTitle(title)
    if (!result.isSuccess) {
      return Failure(result.data)
    }

    await this.reloadCache()
    return Success(result.data)
  }

  public async startKnowledgeEdit(knowledgeId: KnowledgeId) {
    const filePathResult = await this.knowledgeRepository.getFilePath(knowledgeId)
    if (!filePathResult.isSuccess) {
      return Failure(`Failed to get knowledge file path: ${filePathResult.data}`)
    }

    const openFileResult = await this.electronApiRepository.openFile(filePathResult.data)
    if (!openFileResult.isSuccess) {
      return Failure(`Failed to open knowledge file: ${openFileResult.data}`)
    }

    return Ok()
  }
}
