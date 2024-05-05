import { Knowledge } from '../model/Knowledge'
import { Result } from '../../../shared/result'
import { KnowledgeId } from '../../../shared/type'

export interface KnowledgeRepository {
  getAll(): Promise<Result<Knowledge[], string>>
  createEmptyKnowledgeWithTitle(title: string): Promise<Result<Knowledge, string>>
  getFilePath(knowledgeId: KnowledgeId): Promise<Result<string, string>>
}
