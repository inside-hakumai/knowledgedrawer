import zod, { ZodSchema } from 'zod'
import { DateTimeString, KnowledgeId } from '../../../shared/type'

export interface KnowledgeMetadata {
  id: KnowledgeId
  title: string
  createdAt: DateTimeString
  updatedAt: DateTimeString
}

export type Knowledge = {
  contents: string
} & KnowledgeMetadata

export const knowledgeMetadataSchema = zod.object({
  id: zod.string().uuid().transform(KnowledgeId) as unknown as ZodSchema<KnowledgeId>,
  title: zod.string(),
  createdAt: zod
    .string()
    .datetime()
    .transform(DateTimeString) as unknown as ZodSchema<DateTimeString>,
  updatedAt: zod
    .string()
    .datetime()
    .transform(DateTimeString) as unknown as ZodSchema<DateTimeString>,
}) satisfies ZodSchema<KnowledgeMetadata>

export const knowledgeSchema = zod.object({
  contents: zod.string(),
  ...knowledgeMetadataSchema.shape,
}) satisfies ZodSchema<Knowledge>
