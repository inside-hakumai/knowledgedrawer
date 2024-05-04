import zod, { ZodSchema } from 'zod'
import { KnowledgeId } from '../../../shared/type'

export interface KnowledgeMetadata {
  id: KnowledgeId
  title: string
  createdAt: Date
  updatedAt: Date
}

export type Knowledge = {
  contents: string
} & KnowledgeMetadata

export const knowledgeMetadataSchema = zod.object({
  id: zod.string().uuid().transform(KnowledgeId) as unknown as ZodSchema<KnowledgeId>,
  title: zod.string(),
  createdAt: zod.string().datetime() as unknown as ZodSchema<Date>,
  updatedAt: zod.string().datetime() as unknown as ZodSchema<Date>,
}) satisfies ZodSchema<KnowledgeMetadata>

export const knowledgeSchema = zod.object({
  contents: zod.string(),
  ...knowledgeMetadataSchema.shape,
}) satisfies ZodSchema<Knowledge>
