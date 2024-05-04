import { DateTimeString, KnowledgeId } from '@shared/type'
import zod, { ZodSchema } from 'zod'

export interface Knowledge {
  id: KnowledgeId
  title: string
  contents: string
  createdAt: DateTimeString
  updatedAt: DateTimeString
}

export const knowledgeSchema = zod.object({
  id: zod.string().uuid().transform(KnowledgeId) as unknown as ZodSchema<KnowledgeId>,
  title: zod.string(),
  contents: zod.string(),
  createdAt: zod
    .string()
    .datetime()
    .transform(DateTimeString) as unknown as ZodSchema<DateTimeString>,
  updatedAt: zod
    .string()
    .datetime()
    .transform(DateTimeString) as unknown as ZodSchema<DateTimeString>,
}) satisfies ZodSchema<Knowledge>
