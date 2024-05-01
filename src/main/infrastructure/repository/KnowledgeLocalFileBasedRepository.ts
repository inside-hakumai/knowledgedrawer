import { KnowledgeRepository } from '../../domain/repository/KnowledgeRepository'
import { Knowledge, knowledgeMetadataSchema } from '../../domain/model/Knowledge'
import { getExecMode } from '../../lib/environment'
import path from 'path'
import fs from 'fs/promises'
import { Failure, Result, Success } from '../../../shared/result'
import zod from 'zod'

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

    console.debug(metadataJson)
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
