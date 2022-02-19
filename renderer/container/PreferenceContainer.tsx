import React from 'react'
import PreferenceComponent from '../components/PreferenceComponent'

export function PreferenceContainer() {
  const exitPreference = async () => {
    await window.api.exitPreference()
  }

  return <PreferenceComponent onClickExit={exitPreference} />
}
