import { shell } from 'electron'
import { ElectronApiRepository as IElectronApiRepository } from '@/domain/repository/ElectronApiRepository'
import { Failure, Ok, Result } from '@shared/result'

export class ElectronApiRepository implements IElectronApiRepository {
  public async openFile(filePath: string): Promise<Result<void, string>> {
    try {
      await shell.openPath(filePath)
    } catch (e) {
      return Failure(String(e))
    }

    return Ok()
  }
}
