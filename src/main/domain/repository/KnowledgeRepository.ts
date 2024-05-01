import { Knowledge } from '../model/Knowledge'
import { Result } from '../../../shared/result'

export interface KnowledgeRepository {
  getAll(): Promise<Result<Knowledge[], string>>
}
