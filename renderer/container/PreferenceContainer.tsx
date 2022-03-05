import React, { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import type { Settings } from '../../main/lib/settings'
import PreferenceComponent from '../components/PreferenceComponent'

interface Props {
  initialSettings: Settings
}

export const PreferenceContainer: React.VFC<Props> = ({ initialSettings }) => {
  const methods = useForm<Settings>({
    shouldUnregister: false,
  })

  const { setValue, setError, unregister, reset } = methods

  const exitPreference = async () => {
    await window.api.exitPreference()
  }

  const requestSelectingDirectory = async () => {
    await window.api.requestSelectingDirectory()
  }

  const requestSelectingApplication = async () => {
    await window.api.requestSelectingApplication()
  }

  const requestResetApplication = async () => {
    await window.api.requestResetApplication()
  }

  useEffect(() => {
    reset(initialSettings, {
      keepErrors: false,
      keepDirty: false,
      keepValues: false,
      keepDefaultValues: false,
      keepIsSubmitted: false,
      keepTouched: false,
      keepIsValid: false,
    })

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

    window.api.onReceiveResetApplication((result: { isDone: boolean; message: string }) => {
      if (result.isDone) {
        setValue('appForOpeningKnowledgeFile', null, { shouldDirty: true })
      } else {
        console.debug(result)
        setError('appForOpeningKnowledgeFile', {
          type: 'manual',
          message: 'エラーが発生しました',
        })
      }
    })

    return () => {
      console.debug('Unmounting PreferenceContainer')
      unregister(['knowledgeStoreDirectory', 'appForOpeningKnowledgeFile'], {
        keepDirty: false,
        keepTouched: false,
        keepIsValid: false,
        keepError: false,
        keepValue: false,
        keepDefaultValue: false,
      })
      window.api.removeAllListenersForPreference()
    }
  }, [])

  return (
    <FormProvider {...methods}>
      <PreferenceComponent
        onClickExit={exitPreference}
        onClickKnowledgeStoreDirInput={requestSelectingDirectory}
        onClickAppForOpeningKnowledgeInput={requestSelectingApplication}
        onClickResetAppForOpeningKnowledge={requestResetApplication}
      />
    </FormProvider>
  )
}
