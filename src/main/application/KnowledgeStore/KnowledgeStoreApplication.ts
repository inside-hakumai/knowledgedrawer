import { Knowledge } from '../../domain/model/Knowledge'
import { Result } from '../../../shared/result'
import { KnowledgeRepository } from '../../domain/repository/KnowledgeRepository'
import { inject, injectable } from 'tsyringe'

export interface KnowledgeStoreApplication {
  loadKnowledges: () => Promise<Result<Knowledge[], string>>
}

@injectable()
export class KnowledgeStoreApplicationImpl implements KnowledgeStoreApplication {
  constructor(@inject('KnowledgeRepository') private knowledgeRepository: KnowledgeRepository) {}

  loadKnowledges() {
    return this.knowledgeRepository.getAll()
  }
}
