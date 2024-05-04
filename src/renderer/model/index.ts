import { KnowledgeId } from '../../shared/id'
import zod, { date, ZodSchema } from 'zod'

export interface Knowledge {
  id: KnowledgeId
  title: string
  contents: string
  createdAt: Date
  updatedAt: Date
}

export const knowledgeSchema = zod.object({
  id: zod.string().uuid().transform(KnowledgeId) as unknown as ZodSchema<KnowledgeId>,
  title: zod.string(),
  contents: zod.string(),
  createdAt: zod
    .string()
    .datetime()
    .transform((date) => new Date(date)) as unknown as ZodSchema<Date>,
  updatedAt: zod
    .string()
    .datetime()
    .transform((date) => new Date(date)) as unknown as ZodSchema<Date>,
}) satisfies ZodSchema<Knowledge>
