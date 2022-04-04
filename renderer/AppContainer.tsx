import React, { useEffect, useState } from 'react'
import 'highlight.js/styles/github-dark-dimmed.css'
import { SettingProperties } from '../@types/global'
import { isSettings } from '../common/functions'
import { PreferenceContainer } from './container/PreferenceContainer'
import WorkbenchContainer from './container/WorkbenchContainer'
import { ActiveComponentManagerContainer } from './hooks/useActiveComponentManager'
import { css } from './lib/emotion'
import {
  backgroundColor,
  defaultWindowHeight,
  expandedWindowHeight,
  preferenceWindowHeight,
} from './lib/style'

const rootStyle = css`
  overflow: hidden;
  outline: none;
`

const wrapperStyle = css`
  width: 100%;
  background-color: ${backgroundColor};
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

  const [settings, setSettings] = useState<SettingProperties | null>(null)
  const [shouldShowTutorial, setShouldShowTutorial] = useState<null | boolean>(null)

  useEffect(() => {
    ;(async () => {
      window.api.onToggleMode(
        (
          _event: any,
          newMode: 'workbench' | 'workbench-suggestion' | 'preference',
          values: any
        ) => {
          console.debug(`SET MODE: ${newMode} ${values}`)
          setMode(newMode)

          setSettings(newMode === 'preference' && isSettings(values) ? values : null)
          setShouldShowTutorial(
            (newMode === 'workbench' || newMode === 'workbench-suggestion') &&
              typeof values === 'boolean'
              ? values
              : null
          )
        }
      )

      await window.api.ready()
    })()

    return () => {
      console.debug('Unmounting AppContainer')
    }
  }, [])

  return (
    <div className={rootStyle}>
      <div className={`${wrapperStyle} wrapper-${mode}`}>
        {(mode === 'workbench' || mode === 'workbench-suggestion') && shouldShowTutorial !== null && (
          <ActiveComponentManagerContainer>
            <WorkbenchContainer shouldShowTutorial={shouldShowTutorial} />
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
