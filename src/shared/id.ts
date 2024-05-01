import { validate as uuidValidate } from 'uuid'

export declare class Id<T extends string> {
  private __identity: T
}

export type KnowledgeId = Id<'Knowledge'> & string
export function KnowledgeId(id: string) {
  if (!uuidValidate(id)) {
    throw new Error(`Invalid id: ${id}`)
  }

  return id
}
