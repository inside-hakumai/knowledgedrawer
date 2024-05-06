import { Result } from '@shared/result'
import { KnowledgeId } from '@shared/type'
import { Knowledge } from '../../main/domain/model/Knowledge'

declare global {
  interface Window {
    api: {
      search: (query: string) => Promise<Result<Knowledge, string>>
      createEmptyKnowledge: (title: string) => Promise<Result<Knowledge, string>>
      startKnowledgeEdit: (knowledgeId: KnowledgeId) => Promise<Result<void, string>>
    }
  }
}
