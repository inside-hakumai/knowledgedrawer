import { validate as uuidValidate } from 'uuid'
import dayjs from 'dayjs'

export declare class Id<T extends string> {
  private __identity: T
}

export const NULL_KNOWLEDGE_ID: KnowledgeId = KnowledgeId('00000000-0000-0000-0000-000000000000')
export const TENTATIVE_KNOWLEDGE_ID = NULL_KNOWLEDGE_ID

export type KnowledgeId = Id<'Knowledge'> & string
export function KnowledgeId(id: string): KnowledgeId {
  if (!uuidValidate(id)) {
    throw new Error(`Invalid id: ${id}`)
  }

  return id as KnowledgeId
}

export declare class String<T extends string> {
  private __identity: T
}

export type DateTimeString = String<'DateTime'> & string
export function DateTimeString(date: string) {
  if (!dayjs(date).isValid()) {
    throw new Error(`Invalid date: ${date}`)
  }

  return date as DateTimeString
}
