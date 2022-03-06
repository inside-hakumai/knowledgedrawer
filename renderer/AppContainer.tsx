import React, { useEffect, useState } from 'react'
import 'highlight.js/styles/github-dark-dimmed.css'
import { Settings } from '../main/lib/settings'
import { PreferenceContainer } from './container/PreferenceContainer'
import WorkbenchContainer from './container/WorkbenchContainer'
import { ActiveComponentManagerContainer } from './hooks/useActiveComponentManager'
import { css } from './lib/emotion'
import { defaultWindowHeight, expandedWindowHeight, preferenceWindowHeight } from './lib/style'

const rootStyle = css`
  overflow: hidden;
  outline: none;
`

const wrapperStyle = css`
  width: 100%;
  background-color: #303032;
  border-radius: 6px;

  &.wrapper-workbench {
    height: ${defaultWindowHeight}px;
  }
  &.wrapper-workbench-suggestion {
    height: ${expandedWindowHeight}px;
  }
  &.wrapper-preference {
    //transition: height 0.2s ease-in-out 0s;
    height: ${preferenceWindowHeight}px;
  }
`

const AppContainer: React.VFC = () => {
  const [mode, setMode] = useState<'workbench' | 'workbench-suggestion' | 'preference'>('workbench')

  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    window.api.onToggleMode(
      (_event: any, mode: 'workbench' | 'workbench-suggestion' | 'preference', values: any) => {
        console.debug(`SET MODE: ${mode}`)
        setMode(mode)

        setSettings(mode === 'preference' ? values : null)
      }
    )

    return () => {
      console.debug('Unmounting AppContainer')
    }
  }, [])

  return (
    <div className={rootStyle}>
      <div className={`${wrapperStyle} wrapper-${mode}`}>
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
