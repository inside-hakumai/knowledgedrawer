import { Knowledge } from '../../domain/model/Knowledge'
import { Failure, Result, Success } from '../../../shared/result'
import { KnowledgeRepository } from '../../domain/repository/KnowledgeRepository'
import { inject, injectable } from 'tsyringe'
import Fuse from 'fuse.js'
import { KnowledgeStoreCache } from '../../domain/model/KnowledgeStoreCache'

export interface KnowledgeStoreApplication {
  loadKnowledges: () => Promise<Result<Knowledge[], string>>
  searchKnowledges: (query: string) => Promise<Result<Knowledge[], string>>
}

@injectable()
export class KnowledgeStoreApplicationImpl implements KnowledgeStoreApplication {
  private cache = KnowledgeStoreCache.getInstance()

  constructor(@inject('KnowledgeRepository') private knowledgeRepository: KnowledgeRepository) {}

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
}
