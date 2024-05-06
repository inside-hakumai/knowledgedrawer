import { Knowledge } from '../model'
import { createEmptyKnowledge, startKnowledgeEdit } from './IpcApiApplication'
import { Result, Failure, Success, Ok } from '@shared/result'
import { DateTimeString, KnowledgeId } from '@shared/type'

/**
 * 指定したタイトルで新しいナレッジを作成し、そのナレッジの編集を開始します。
 */
export const startNewKnowledgeEdit = async (title: string): Promise<Result<Knowledge, string>> => {
  if (title === '') {
    return Failure('Title is empty')
  }

  const createResult = await createEmptyKnowledge(title)
  if (!createResult.isSuccess) {
    return Failure(`Failed to create empty knowledge: ${createResult.data}`)
  }
  const entity = createResult.data

  const startEditResult = await startKnowledgeEdit(entity.id)
  if (!startEditResult.isSuccess) {
    return Failure(`Failed to start knowledge edit: ${startEditResult.data}`)
  }

  return Success({
    ...entity,
    isTentative: false,
  })
}
