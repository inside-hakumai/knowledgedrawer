import React, { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import type { Settings } from '../../main/lib/settings'
import PreferenceComponent from '../components/PreferenceComponent'

interface Props {
  initialSettings: Settings
}

export const PreferenceContainer: React.VFC<Props> = ({ initialSettings }) => {
  const methods = useForm<Settings>({
    defaultValues: initialSettings,
  })

  const { setValue, setError } = methods

  const exitPreference = async () => {
    await window.api.exitPreference()
  }

  const requestSelectingDirectory = async () => {
    await window.api.requestSelectingDirectory()
  }

  const requestSelectingApplication = async () => {
    await window.api.requestSelectingApplication()
  }

  useEffect(() => {
    window.api.onReceiveSelectingDirectory(
      (result: { dirPath: string | null; isValid: boolean; isCancelled: boolean }) => {
        if (result.isCancelled) {
          return
        }

        if (result.isValid && result.dirPath) {
          setValue('knowledgeStoreDirectory', result.dirPath, { shouldDirty: true })
        } else {
          console.log(result)
          setError('knowledgeStoreDirectory', {
            type: 'manual',
            message: 'エラーが発生しました',
          })
        }
      }
    )

    window.api.onReceiveSelectingApplication(
      (result: { appPath: string | null; isValid: boolean; isCancelled: boolean }) => {
        if (result.isCancelled) {
          return
        }

        if (result.isValid && result.appPath) {
          setValue('appForOpeningKnowledgeFile', result.appPath, { shouldDirty: true })
        } else {
          console.log(result)
          setError('appForOpeningKnowledgeFile', {
            type: 'manual',
            message: 'エラーが発生しました',
          })
        }
      }
    )
  }, [])

  return (
    <FormProvider {...methods}>
      <PreferenceComponent
        onClickExit={exitPreference}
        onClickKnowledgeStoreDirInput={requestSelectingDirectory}
        onClickAppForOpeningKnowledgeInput={requestSelectingApplication}
      />
    </FormProvider>
  )
}
