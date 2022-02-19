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

  const { setValue } = methods

  const exitPreference = async () => {
    await window.api.exitPreference()
  }

  const requestSelectingDirectory = async () => {
    await window.api.requestSelectingDirectory()
  }

  useEffect(() => {
    window.api.onReceiveSelectingDirectory((dirPath: string) => {
      setValue('knowledgeStoreDirectory', dirPath, {
        shouldValidate: true,
        shouldDirty: true,
      })
    })
  }, [])

  return (
    <FormProvider {...methods}>
      <PreferenceComponent
        onClickExit={exitPreference}
        onClickKnowledgeStoreDirInput={requestSelectingDirectory}
      />
    </FormProvider>
  )
}
