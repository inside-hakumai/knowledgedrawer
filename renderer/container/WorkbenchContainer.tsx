import React, { useEffect, useRef, useState } from 'react'
import 'highlight.js/styles/github-dark-dimmed.css'
import KnowledgeViewContainer from '../container/KnowledgeViewContainer'
import useActiveComponentManager from '../hooks/useActiveComponentManager'
import { mapKeyToAction } from '../lib/functions'

const WorkbenchContainer: React.VFC = () => {
  const { registerEventHandler, changeActiveComponent, activeComponent } =
    useActiveComponentManager()

  const [isDirty, setIsDirty] = useState(false)
  const [suggestions, setSuggestions] = useState<{
    items: { title: string; contents: string }[]
    selectedIndex: number | null
  }>({
    items: [],
    selectedIndex: null,
  })

  const suggestionsRef = useRef<typeof suggestions>(suggestions)
  const activeComponentRef = useRef<typeof activeComponent>(activeComponent)

  const formRef = useRef<HTMLInputElement>(null)

  const clearResult = async () => {
    await window.api.clearSearch()
    setIsDirty(false)
    setSuggestions({
      items: [],
      selectedIndex: null,
    })
  }

  const setResult = (suggestions: { title: string; contents: string }[]) => {
    setSuggestions({
      items: suggestions,
      selectedIndex: suggestions.length > 0 ? 0 : null,
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
        selectedIndex: null,
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

    if (currentSuggestions.selectedIndex === null) {
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
        currentSuggestions.selectedIndex === currentSuggestions.items.length - 1) ||
      (triggeredAction === 'ArrowUp' && currentSuggestions.selectedIndex === 0)
    ) {
      return
    }

    const nextIndex = currentSuggestions.selectedIndex + (triggeredAction === 'ArrowDown' ? 1 : -1)
    setSuggestions({
      items: currentSuggestions.items,
      selectedIndex: nextIndex,
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
    <div className={`workbench ${isDirty ? 'isDirty' : ''}`}>
      <div className='formContainer'>
        <input className='queryForm' type='text' onChange={onFormChange} ref={formRef} />
        <div className='buttons'>
          <i className='fas fa-plus' onClick={window.api.createNewKnowledge} />
        </div>
      </div>

      {isDirty && (
        <div className='result'>
          <div className='suggestContainer'>
            <ul className='suggestList'>
              {suggestions.items.map((item, index) => (
                <li
                  key={`suggest-${index}`}
                  className={`suggestList-item ${
                    suggestions.selectedIndex === index ? 'selected' : ''
                  }`}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>

          <KnowledgeViewContainer
            renderingContent={
              suggestions.selectedIndex !== null
                ? suggestions.items[suggestions.selectedIndex].contents
                : null
            }
          />
        </div>
      )}
    </div>
  )
}

export default WorkbenchContainer
