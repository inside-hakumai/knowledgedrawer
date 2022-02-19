import React, { useEffect, useState } from 'react'
import 'highlight.js/styles/github-dark-dimmed.css'
import { Settings } from '../main/lib/settings'
import { PreferenceContainer } from './container/PreferenceContainer'
import WorkbenchContainer from './container/WorkbenchContainer'
import { ActiveComponentManagerContainer } from './hooks/useActiveComponentManager'

const AppContainer: React.VFC = () => {
  const [mode, setMode] = useState<'workbench' | 'workbench-suggestion' | 'preference'>('workbench')

  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    window.api.onToggleMode(
      (_event: any, mode: 'workbench' | 'workbench-suggestion' | 'preference', values: any) => {
        console.debug(`SET MODE: ${mode}`)
        setMode(mode)

        if (mode === 'preference') {
          setSettings(values)
        }
      }
    )
  }, [])

  return (
    <div className='renderingArea'>
      <div className={`wrapper wrapper-${mode}`}>
        {(mode === 'workbench' || mode === 'workbench-suggestion') && (
          <ActiveComponentManagerContainer>
            <WorkbenchContainer />
          </ActiveComponentManagerContainer>
        )}
        {mode === 'preference' && settings !== null && (
          <PreferenceContainer initialSettings={settings} />
        )}
      </div>
    </div>
  )
}

export default AppContainer
