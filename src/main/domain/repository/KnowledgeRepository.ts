import { Result } from '../../../shared/result'
import { KnowledgeId } from '../../../shared/type'
import { Knowledge } from '../model/Knowledge'

export interface KnowledgeRepository {
  getAll(): Promise<Result<Knowledge[], string>>
  createEmptyKnowledgeWithTitle(title: string): Promise<Result<Knowledge, string>>
  getFilePath(knowledgeId: KnowledgeId): Promise<Result<string, string>>
  addKnowledgeChangedListener(listener: (knowledgeId: KnowledgeId) => void): void
}
