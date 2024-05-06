import { createEmptyKnowledge, startKnowledgeEdit } from '@/applicaiton/IpcApiApplication'
import { Knowledge } from '@/model'
import { Result, Failure, Success } from '@shared/result'

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
