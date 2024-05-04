import { Knowledge, knowledgeSchema } from '../model'
import { Failure, Result, Success } from '../../shared/result'
import zod from 'zod'

export const useIpcApi = () => {
  const search = async (query: string): Promise<Result<Knowledge[], string>> => {
    const result = await window.api.search(query)

    if (!result.isSuccess) {
      return result
    }

    const { data } = result

    const parseResult = zod.array(knowledgeSchema).safeParse(data)

    if (!parseResult.success) {
      return Failure(parseResult.error.message)
    }

    return Success(parseResult.data)
  }

  return { search }
}
