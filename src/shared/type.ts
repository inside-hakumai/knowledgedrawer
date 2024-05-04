import { validate as uuidValidate } from 'uuid'
import dayjs from 'dayjs'

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

export declare class String<T extends string> {
  private __identity: T
}

export type DateTimeString = String<'DateTime'> & string
export function DateTimeString(date: string) {
  if (!dayjs(date).isValid()) {
    throw new Error(`Invalid date: ${date}`)
  }

  return date
}
