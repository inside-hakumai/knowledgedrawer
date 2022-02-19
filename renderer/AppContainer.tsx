import React, { useEffect, useState } from 'react'
import 'highlight.js/styles/github-dark-dimmed.css'
import { PreferenceContainer } from './container/PreferenceContainer'
import WorkbenchContainer from './container/WorkbenchContainer'
import { ActiveComponentManagerContainer } from './hooks/useActiveComponentManager'

const AppContainer: React.VFC = () => {
  const [mode, setMode] = useState<'workbench' | 'workbench-suggestion' | 'preference'>('workbench')

  useEffect(() => {
    window.api.onToggleMode(
      (_event: any, mode: 'workbench' | 'workbench-suggestion' | 'preference') => {
        console.debug(`SET MODE: ${mode}`)
        setMode(mode)
      }
    )
  }, [])

  return (
    <div className='renderingArea'>
      <div className={`wrapper wrapper-${mode}`}>
        {mode === 'workbench' || mode === 'workbench-suggestion' ? (
          <ActiveComponentManagerContainer>
            <WorkbenchContainer />
          </ActiveComponentManagerContainer>
        ) : (
          <PreferenceContainer />
        )}
      </div>
    </div>
  )
}

export default AppContainer
