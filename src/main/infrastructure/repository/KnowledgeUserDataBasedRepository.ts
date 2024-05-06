import dayjs from 'dayjs'
import { app as electronApp } from 'electron'
import log from 'electron-log'
import { watch } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import zod from 'zod'
import { Knowledge, knowledgeMetadataSchema } from '@/domain/model/Knowledge'
import { KnowledgeRepository } from '@/domain/repository/KnowledgeRepository'
import { ensureDirectoryExists, ensureFileExists } from '@/lib/helper'
import { Failure, Ok, Result, Success } from '@shared/result'
import { DateTimeString, KnowledgeId } from '@shared/type'

const logger = log.scope('KnowledgeUserDataBasedRepository')

export class KnowledgeUserDataBasedRepository implements KnowledgeRepository {
  knowledgeFileChangedListeners: ((knowledgeId: KnowledgeId) => void)[] = []

  constructor() {
    ;(async () => {
      const knowledgeDirPathResult = identifyKnowledgeDirPath()
      if (!knowledgeDirPathResult.isSuccess) {
        throw new Error(
          `Failed to identify knowledge directory path: ${knowledgeDirPathResult.data}`,
        )
      } else {
        logger.log(`Knowledge directory path: ${knowledgeDirPathResult.data}`)
      }

      await ensureDirectoryExists(knowledgeDirPathResult.data).catch((e) => {
        throw new Error(`Failed to ensure knowledge directory: ${e}`)
      })

      await ensureFileExists(path.join(knowledgeDirPathResult.data, 'metadata.json'), '[]').catch(
        (e) => {
          throw new Error(`Failed to ensure metadata.json: ${e}`)
        },
      )

      await this.watchKnowledges().catch((e) => {
        throw new Error(
          `Failed to start watching knowledge in KnowledgeUserDataBasedRepository constructor: ${e}`,
        )
      })
    })()
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

  public addKnowledgeChangedListener(listener: (knowledgeId: KnowledgeId) => void): void {
    this.knowledgeFileChangedListeners.push(listener)
  }

  private async watchKnowledges(): Promise<Result<void, string>> {
    const identifyKnowledgeDirPathResult = await identifyKnowledgeDirPath()
    if (!identifyKnowledgeDirPathResult.isSuccess) {
      return Failure(
        `Failed to identify knowledge directory path: ${identifyKnowledgeDirPathResult.data}`,
      )
    }
    const knowledgeDirPath = identifyKnowledgeDirPathResult.data

    watch(knowledgeDirPath, { recursive: true }, (eventType, filename) => {
      try {
        if (typeof filename !== 'string') {
          return
        }

        const isMarkdownFile = filename.endsWith('.md')
        if (!isMarkdownFile) {
          return
        }

        let knowledgeId: KnowledgeId
        try {
          knowledgeId = KnowledgeId(filename.replace('.md', ''))
        } catch (e) {
          // ファイル名がKnowledgeIdに変換できない場合は無視する（UUID形式じゃない場合など）
          return
        }

        logger.log(`Knowledge file change detected: ${eventType} ${knowledgeId}.md`)

        this.knowledgeFileChangedListeners.forEach((listener) => {
          listener(knowledgeId)
        })
      } catch (e) {
        logger.error(`Failed to handle knowledge file change: ${e}`)
      }
    })

    return Ok()
  }
}

/**
 * ユーザーのデータディレクトリのパスを返します。
 *
 * @returns パス取得に成功した場合、そのパスを含むSuccessオブジェクト。失敗した場合はエラーメッセージを含むFailureオブジェクト
 */
const identifyKnowledgeDirPath = (): Result<string, string> => {
  try {
    const userDataDirPath = electronApp.getPath('userData')
    return Success(path.resolve(userDataDirPath, 'knowledgeData'))
  } catch (e) {
    return Failure(`Failed to get knowledge directory path: ${e}`)
  }
}
