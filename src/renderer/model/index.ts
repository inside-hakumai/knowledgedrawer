import { DateTimeString, KnowledgeId } from '@shared/type'
import zod, { ZodSchema, ZodTypeAny } from 'zod'

export interface Knowledge {
  isTentative: false
  id: KnowledgeId
  title: string
  contents: string
  createdAt: DateTimeString
  updatedAt: DateTimeString
}

export interface TentativeKnowledge {
  isTentative: true
  id: KnowledgeId
  title: string
}

export const isKnowledgeId = zod
  .string()
  .uuid()
  .transform(KnowledgeId) as unknown as ZodSchema<KnowledgeId>

export const isDateTimeString: ZodSchema<DateTimeString> = zod
  .string()
  .datetime()
  .transform(DateTimeString) as unknown as ZodSchema<DateTimeString>

export const knowledgeSchema = zod.object({
  isTentative: zod.literal(false),
  id: isKnowledgeId,
  title: zod.string(),
  contents: zod.string(),
  createdAt: isDateTimeString,
  updatedAt: isDateTimeString,
}) satisfies ZodSchema<Knowledge>

export const tentativeKnowledgeSchema = zod.object({
  isTentative: zod.literal(true),
  id: isKnowledgeId,
  title: zod.string(),
}) satisfies ZodSchema<TentativeKnowledge>

export const isValidAs = <T extends ZodTypeAny>(schema: T, data: unknown): data is zod.infer<T> => {
  return schema.safeParse(data).success
}
