import { Knowledge, knowledgeSchema } from '../model'
import { Failure, Result, Success } from '../../shared/result'
import zod, { ZodSchema } from 'zod'
import { DateTimeString, KnowledgeId } from '@shared/type'

const apiKnowledgeSchema = zod.array(
  zod.object({
    id: zod.string().uuid(),
    title: zod.string(),
    contents: zod.string(),
    createdAt: zod.string().datetime(),
    updatedAt: zod.string().datetime(),
  }),
)

export const useIpcApi = () => {
  const search = async (query: string): Promise<Result<Knowledge[], string>> => {
    const result = await window.api.search(query)

    if (!result.isSuccess) {
      return result
    }

    const { data } = result

    const parseResult = apiKnowledgeSchema.safeParse(data)

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

  return { search }
}
