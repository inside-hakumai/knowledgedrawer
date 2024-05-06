import { Result } from '@shared/result'

export interface ElectronApiRepository {
  openFile(filePath: string): Promise<Result<void, string>>
}
