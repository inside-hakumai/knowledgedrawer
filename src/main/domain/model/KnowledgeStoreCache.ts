import { Knowledge } from './Knowledge'
import { Failure, Result, Success } from '../../../shared/result'

export class KnowledgeStoreCache {
  private static instance: KnowledgeStoreCache
  private cache: Knowledge[] | null = null

  public static getInstance(): KnowledgeStoreCache {
    if (!KnowledgeStoreCache.instance) {
      KnowledgeStoreCache.instance = new KnowledgeStoreCache()
    }
    return KnowledgeStoreCache.instance
  }

  public get(): Result<Knowledge[], string> {
    if (this.cache === null) {
      return Failure('Cache is empty')
    } else {
      return Success(this.cache)
    }
  }

  public set(value: Knowledge[]): void {
    this.cache = value
  }
}
