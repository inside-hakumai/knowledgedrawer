import fs from 'fs/promises'
import { Failure, Ok, Result } from '../../shared/result'
import log from 'electron-log'

const logger = log.scope('lib/helper')

/**
 * 指定したパスのディレクトリが存在することを確認します。ディレクトリが存在しない場合は、新しくディレクトリを作成します。
 *
 * @param dirPath 存在を確認したいディレクトリのパス
 * @return ディレクトリが存在するか、新しく作成に成功したかどうかを表す {@see Result}
 */
export const ensureDirectoryExists = async (dirPath: string): Promise<Result<void, string>> => {
  let shouldCreateDir = false

  try {
    const stat = await fs.lstat(dirPath)
    if (!stat.isDirectory()) {
      return Failure(`${dirPath} is not a directory`)
    }
  } catch (e) {
    if (typeof e === 'object' && e !== null && 'code' in e && e.code === 'ENOENT') {
      shouldCreateDir = true
    } else {
      return Failure(`Failed to ensure directory exists: ${e}`)
    }
  }

  if (shouldCreateDir) {
    try {
      await fs.mkdir(dirPath, { recursive: true })
      logger.log(`Created directory: ${dirPath}`)
    } catch (e) {
      return Failure(`Failed to create directory: ${e}`)
    }
  }

  return Ok()
}

/**
 * 指定したパスのファイルが存在することを確認します。
 * ファイルが存在しない場合、新しくファイルを作成し、指定した内容を書き込みます。
 *
 * @param filePath 存在を確認したいファイルのパス
 * @param contents ファイルが存在しない場合に作成するファイルの内容
 *
 * @return ディレクトリが存在するか、新しく作成に成功したかどうかを表す {@see Result}
 */
export const ensureFileExists = async (
  filePath: string,
  contents: string,
): Promise<Result<void, string>> => {
  let shouldCreateFile = false

  try {
    const stat = await fs.lstat(filePath)
    if (!stat.isFile()) {
      return Failure(`${filePath} is not a file`)
    }
  } catch (e) {
    if (typeof e === 'object' && e !== null && 'code' in e && e.code === 'ENOENT') {
      shouldCreateFile = true
    } else {
      return Failure(`Failed to ensure file exists: ${e}`)
    }
  }

  if (shouldCreateFile) {
    try {
      await fs.writeFile(filePath, contents)
      logger.log(`Created file: ${filePath}`)
    } catch (e) {
      return Failure(`Failed to create file: ${e}`)
    }
  }

  return Ok()
}
