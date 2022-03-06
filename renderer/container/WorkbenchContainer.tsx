import React, { useEffect, useRef, useState } from 'react'
import 'highlight.js/styles/github-dark-dimmed.css'
import SearchFormComponent from '../components/SearchFormComponent'
import SuggestionListComponent from '../components/SuggestionListComponent'
import KnowledgeViewContainer from '../container/KnowledgeViewContainer'
import useActiveComponentManager from '../hooks/useActiveComponentManager'
import { css } from '../lib/emotion'
import { mapKeyToAction } from '../lib/functions'
import { defaultWindowHeight, expandedWindowHeight } from '../lib/style'

const rootStyle = css`
  width: 100%;
  height: ${defaultWindowHeight}px;

  &.isDirty {
    height: ${expandedWindowHeight}px;
  }
`

const resultWrapperStyle = css`
  display: flex;
  height: 100%;
`

const WorkbenchContainer: React.VFC = () => {
  const { registerEventHandler, changeActiveComponent, activeComponent } =
    useActiveComponentManager()

  const [isDirty, setIsDirty] = useState(false)
  const [suggestions, setSuggestions] = useState<{
    items: { title: string; contents: string }[]
    selectedItemIndex: number | null
  }>({
    items: [],
    selectedItemIndex: null,
  })

  const suggestionsRef = useRef<typeof suggestions>(suggestions)
  const activeComponentRef = useRef<typeof activeComponent>(activeComponent)

  const formRef = useRef<HTMLInputElement>(null)

  const clearResult = async () => {
    await window.api.clearSearch()
    setIsDirty(false)
    setSuggestions({
      items: [],
      selectedItemIndex: null,
    })
  }

  const setResult = (suggestions: { title: string; contents: string }[]) => {
    setSuggestions({
      items: suggestions,
      selectedItemIndex: suggestions.length > 0 ? 0 : null,
    })
  }

  const reset = async () => {
    await clearResult()
    formRef.current!.value = ''
  }

  const onToggleMode = async (
    _event: any,
    mode: 'workbench' | 'workbench-suggestion' | 'preference'
  ) => {
    console.log(formRef)
    if (mode === 'preference') {
      setIsDirty(false)
      setSuggestions({
        items: [],
        selectedItemIndex: null,
      })
      formRef.current!.value = ''
    }
  }

  const onFormChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    if (event.target.value.length === 0) {
      await clearResult()
    } else {
      await window.api.search(event.target.value)
    }
  }

  const requestDeactivate = async () => {
    await window.api.requestDeactivate()
  }

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    console.debug('AppContainer', event.key)

    const currentSuggestions = suggestionsRef.current

    if (event.key === 'Escape') {
      await requestDeactivate()
      return
    }

    if (currentSuggestions.selectedItemIndex === null) {
      return
    }

    if (event.key === 'Enter') {
      changeActiveComponent('knowledgeView')
      return
    }

    const triggeredAction = mapKeyToAction(event)
    if (triggeredAction === null) {
      return
    }

    if (
      (triggeredAction === 'ArrowDown' &&
        currentSuggestions.selectedItemIndex === currentSuggestions.items.length - 1) ||
      (triggeredAction === 'ArrowUp' && currentSuggestions.selectedItemIndex === 0)
    ) {
      return
    }

    const nextIndex =
      currentSuggestions.selectedItemIndex + (triggeredAction === 'ArrowDown' ? 1 : -1)
    setSuggestions({
      items: currentSuggestions.items,
      selectedItemIndex: nextIndex,
    })
    console.debug('Selected item:', nextIndex)
  }

  useEffect(() => {
    suggestionsRef.current = suggestions
    activeComponentRef.current = activeComponent
  })

  useEffect(() => {
    console.debug('initial')
    console.log(formRef)
    window.api.onReceiveSuggestions(setResult)
    window.api.onDoneDeactivate(reset)
    window.api.onToggleMode(onToggleMode)

    registerEventHandler('searchResult', handleKeyDown)
    changeActiveComponent('searchResult')

    formRef.current?.focus()

    return () => {
      ;(async () => {
        await window.api.cleanupOnUnmountWorkbench([
          ['responseSearch', setResult],
          ['doneDeactivate', reset],
          ['toggleMode', onToggleMode],
        ])
      })()
    }
  }, [])

  return (
    <div className={`${rootStyle} ${isDirty ? 'isDirty' : ''}`}>
      <SearchFormComponent
        onFormChange={onFormChange}
        formRef={formRef}
        createNewKnowledge={window.api.createNewKnowledge}
        isDirty={isDirty}
      />

      {isDirty && (
        <div className={resultWrapperStyle}>
          <SuggestionListComponent suggestions={suggestions} />

          <KnowledgeViewContainer
            renderingContent={
              suggestions.selectedItemIndex !== null
                ? suggestions.items[suggestions.selectedItemIndex].contents
                : null
            }
          />
        </div>
      )}
    </div>
  )
}

export default WorkbenchContainer
