import { Knowledge } from '../../main/domain/model/Knowledge'

declare global {
  interface Window {
    api: {
      search: (query: string) => Promise<Result<Knowledge>>
    }
  }
}
