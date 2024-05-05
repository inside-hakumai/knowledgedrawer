import { KnowledgeRepository } from '../../domain/repository/KnowledgeRepository'
import { Knowledge, knowledgeMetadataSchema } from '../../domain/model/Knowledge'
import { getExecMode } from '../../lib/environment'
import path from 'path'
import fs from 'fs/promises'
import { Failure, Result, Success } from '../../../shared/result'
import zod from 'zod'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { DateTimeString, KnowledgeId } from '../../../shared/type'

/**
 * リポジトリのディレクトリルート直下の「dev-knowledge」ディレクトリからナレッジを取得するリポジトリです。
 * 開発環境かつ未パッケージ状態でのみ使用できます。
 */
export class KnowledgeLocalFileBasedRepository implements KnowledgeRepository {
  constructor() {
    if (getExecMode() !== 'development-unpackaged') {
      throw new Error(
        'KnowledgeLocalFileBasedRepository can only be used in development-unpackaged mode',
      )
    }
  }

  async getAll(): Promise<Result<Knowledge[], string>> {
    const identifyResult = await identifyKnowledgeDirPath()
    if (!identifyResult.isSuccess) {
      return Failure(`Failed to get knowledge: ${identifyResult.data}`)
    }

    const knowledgeDirPath = identifyResult.data

    let metadataJson
    try {
      metadataJson = JSON.parse(
        await fs.readFile(path.join(knowledgeDirPath, 'metadata.json'), {
          encoding: 'utf-8',
        }),
      )
    } catch (e) {
      return Failure(`Failed to read metadata.json: ${e}`)
    }

    const parseResult = zod.array(knowledgeMetadataSchema).safeParse(metadataJson)
    if (!parseResult.success) {
      return Failure(`Failed to parse metadata.json: ${parseResult.error.message}`)
    }

    const knowledgeMetadataList = parseResult.data

    const knowledgeList: Knowledge[] = []
    for (const metadata of knowledgeMetadataList) {
      const knowledgeFilePath = path.join(knowledgeDirPath, `${metadata.id}.md`)

      let contents
      try {
        contents = await fs.readFile(knowledgeFilePath, { encoding: 'utf-8' })
      } catch (e) {
        return Failure(`Failed to read knowledge file: ${e}`)
      }

      knowledgeList.push({
        ...metadata,
        contents,
      })
    }

    return Success(knowledgeList)
  }

  async createEmptyKnowledgeWithTitle(title: string): Promise<Result<Knowledge, string>> {
    const identifyResult = await identifyKnowledgeDirPath()
    if (!identifyResult.isSuccess) {
      return Failure(`Failed to create knowledge: ${identifyResult.data}`)
    }

    const knowledgeDirPath = identifyResult.data

    const newKnowledgeId = uuidv4()
    const newKnowledgeFilePath = path.join(knowledgeDirPath, `${newKnowledgeId}.md`)

    try {
      await fs.writeFile(newKnowledgeFilePath, '')
    } catch (e) {
      return Failure(`Failed to create knowledge file: ${e}`)
    }

    const newKnowledgeMetadata = {
      id: KnowledgeId(newKnowledgeId),
      title,
      createdAt: DateTimeString(dayjs().toISOString()),
      updatedAt: DateTimeString(dayjs().toISOString()),
    }

    const metadataJson = await fs.readFile(path.join(knowledgeDirPath, 'metadata.json'), {
      encoding: 'utf-8',
    })

    const parseResult = zod.array(knowledgeMetadataSchema).safeParse(JSON.parse(metadataJson))
    if (!parseResult.success) {
      return Failure(`Failed to parse metadata.json: ${parseResult.error.message}`)
    }

    const knowledgeMetadataList = parseResult.data
    knowledgeMetadataList.push(newKnowledgeMetadata)

    try {
      await fs.writeFile(
        path.join(knowledgeDirPath, 'metadata.json'),
        JSON.stringify(knowledgeMetadataList, null, 2),
      )
    } catch (e) {
      return Failure(`Failed to write metadata.json: ${e}`)
    }

    return Success({
      ...newKnowledgeMetadata,
      contents: '',
    })
  }

  async getFilePath(knowledgeId: KnowledgeId): Promise<Result<string, string>> {
    const identifyResult = await identifyKnowledgeDirPath()
    if (!identifyResult.isSuccess) {
      return Failure(`Failed to get knowledge file path: ${identifyResult.data}`)
    }

    const knowledgeDirPath = identifyResult.data
    const knowledgeFilePath = path.join(knowledgeDirPath, `${knowledgeId}.md`)

    try {
      const status = await fs.lstat(knowledgeFilePath)
      if (!status.isFile()) {
        return Failure('Knowledge file is not a file')
      }
    } catch (e) {
      return Failure(`Failed to get knowledge file attributes: ${e}`)
    }

    return Success(path.join(knowledgeDirPath, `${knowledgeId}.md`))
  }
}

/**
 * 「dev-knowledge」ディレクトリの絶対パスを特定します。
 * package.jsonと同じディレクトリに「dev-knowledge」ディレクトリが存在することを前提としています。
 */
const identifyKnowledgeDirPath = async (): Promise<Result<string, string>> => {
  // 現在のファイルから親ディレクトリをたどり、package.jsonが存在するディレクトリを特定する
  let currentDir = __dirname
  while (true) {
    // ディレクトリ自体が存在しなかったりアクセス権限がなかったり、ディレクトリではない場合はfalseを返す
    try {
      if (!(await fs.lstat(currentDir)).isDirectory()) {
        return Failure('Failed to identify the dev-knowledge directory path')
      }
    } catch (e) {
      return Failure('Failed to identify the dev-knowledge directory path')
    }

    const packageJsonPath = path.join(currentDir, 'package.json')
    try {
      if ((await fs.lstat(packageJsonPath)).isFile()) {
        break
      }
    } catch (e) {
      // do nothing
    }

    currentDir = path.join(currentDir, '..')
  }

  const knowledgeDirPath = path.join(currentDir, 'dev-knowledge')

  return Success(knowledgeDirPath)
}
