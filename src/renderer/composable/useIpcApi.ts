import zod from 'zod'
import { Knowledge } from '@/model'
import { Failure, Result, Success } from '@shared/result'
import { DateTimeString, KnowledgeId } from '@shared/type'

const apiKnowledgeSchema = zod.object({
  id: zod.string().uuid(),
  title: zod.string(),
  contents: zod.string(),
  createdAt: zod.string().datetime(),
  updatedAt: zod.string().datetime(),
})

const searchResponseSchema = zod.array(apiKnowledgeSchema)

export const useIpcApi = () => {
  const search = async (query: string): Promise<Result<Knowledge[], string>> => {
    const result = await window.api.search(query)

    if (!result.isSuccess) {
      return result
    }

    const { data } = result

    const parseResult = searchResponseSchema.safeParse(data)

    if (!parseResult.success) {
      return Failure(parseResult.error.message)
    }

    const knowledges = parseResult.data.map((data) => ({
      ...data,
      isTentative: false,
      id: KnowledgeId(data.id),
      createdAt: DateTimeString(data.createdAt),
      updatedAt: DateTimeString(data.updatedAt),
    })) satisfies Knowledge[]

    return Success(knowledges)
  }

  const createEmptyKnowledge = async (title: string): Promise<Result<Knowledge, string>> => {
    const result = await window.api.createEmptyKnowledge(title)

    if (!result.isSuccess) {
      return Failure(result.data)
    }

    const { data } = result

    const parseResult = apiKnowledgeSchema.safeParse(data)

    if (!parseResult.success) {
      return Failure(parseResult.error.message)
    }

    const knowledge = {
      ...parseResult.data,
      isTentative: false,
      id: KnowledgeId(parseResult.data.id),
      createdAt: DateTimeString(parseResult.data.createdAt),
      updatedAt: DateTimeString(parseResult.data.updatedAt),
    } satisfies Knowledge

    return Success(knowledge)
  }

  return { search, createEmptyKnowledge }
}
