import zod from 'zod'
import { Failure, Ok, Result, Success } from '@shared/result'
import { DateTimeString, KnowledgeId } from '@shared/type'

const apiKnowledgeSchema = zod.object({
  id: zod.string().uuid().transform(KnowledgeId) as unknown as zod.ZodSchema<KnowledgeId>,
  title: zod.string(),
  contents: zod.string(),
  createdAt: zod
    .string()
    .datetime()
    .transform(DateTimeString) as unknown as zod.ZodSchema<DateTimeString>,
  updatedAt: zod
    .string()
    .datetime()
    .transform(DateTimeString) as unknown as zod.ZodSchema<DateTimeString>,
})

export const createEmptyKnowledge = async (
  title: string,
): Promise<Result<zod.infer<typeof apiKnowledgeSchema>, string>> => {
  const apiResult = await window.api.createEmptyKnowledge(title)
  if (!apiResult.isSuccess) {
    return Failure(`Failed to create empty knowledge: ${apiResult.data}`)
  }

  const parseResult = apiKnowledgeSchema.safeParse(apiResult.data)
  if (!parseResult.success) {
    return Failure(parseResult.error.message)
  }

  return Success(parseResult.data)
}

export const startKnowledgeEdit = async (
  knowledgeId: KnowledgeId,
): Promise<Result<void, string>> => {
  const apiResult = await window.api.startKnowledgeEdit(knowledgeId)
  if (!apiResult.isSuccess) {
    return Failure(`Failed to start knowledge edit: ${apiResult.data}`)
  }

  return Ok()
}
