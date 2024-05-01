import { container } from 'tsyringe'
import { KnowledgeLocalFileBasedRepository } from './infrastructure/repository/KnowledgeLocalFileBasedRepository'
import { KnowledgeRepository } from './domain/repository/KnowledgeRepository'
import {
  KnowledgeStoreApplication,
  KnowledgeStoreApplicationImpl,
} from './application/KnowledgeStore/KnowledgeStoreApplication'

container.register<KnowledgeStoreApplication>('KnowledgeStoreApplication', {
  useClass: KnowledgeStoreApplicationImpl,
})
container.register<KnowledgeRepository>('KnowledgeRepository', {
  useClass: KnowledgeLocalFileBasedRepository,
})
