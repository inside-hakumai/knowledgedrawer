import React, { useEffect, useRef, useState } from 'react'
import 'highlight.js/styles/github-dark-dimmed.css'
import KnowledgeViewContainer from './container/KnowledgeViewContainer'
import useActiveComponentManager from './hooks/useActiveComponentManager'
import { mapKeyToAction } from './lib/functions'

const AppContainer: React.VFC = () => {
  const { registerEventHandler, changeActiveComponent, activeComponent } =
    useActiveComponentManager()

  const [isDirty, setIsDirty] = useState(false)
  const [suggestItems, setSuggestItems] = useState<{ title: string; contents: string }[]>([])
  const [selectedItem, setSelectedItem] = useState<number | null>(null)

  const suggestItemsRef = useRef<typeof suggestItems>(suggestItems)
  const selectedItemRef = useRef<typeof selectedItem>(selectedItem)
  const activeComponentRef = useRef<typeof activeComponent>(activeComponent)

  const formRef = useRef<HTMLInputElement>(null)

  const clearResult = async () => {
    await window.api.clearSearch()
    setIsDirty(false)
    setSuggestItems([])
    setSelectedItem(null)
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

    const currentSuggestItems = suggestItemsRef.current
    const currentSelectedItem = selectedItemRef.current

    if (event.key === 'Escape') {
      await requestDeactivate()
      return
    }

    if (currentSelectedItem === null) {
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
      (triggeredAction === 'ArrowDown' && currentSelectedItem === currentSuggestItems.length - 1) ||
      (triggeredAction === 'ArrowUp' && currentSelectedItem === 0)
    ) {
      return
    }

    const nextIndex = currentSelectedItem + (triggeredAction === 'ArrowDown' ? 1 : -1)
    setSelectedItem(nextIndex)
    console.debug('Selected item:', nextIndex)
  }

  useEffect(() => {
    suggestItemsRef.current = suggestItems
    selectedItemRef.current = selectedItem
    activeComponentRef.current = activeComponent
  })

  useEffect(() => {
    window.api.onReceiveSuggestions((suggestions: { title: string; contents: string }[]) => {
      setSuggestItems(suggestions)
    })

    window.api.onDoneDeactivate(() => {
      setIsDirty(false)
      setSuggestItems([])
      setSelectedItem(null)
      formRef.current!.value = ''
    })

    registerEventHandler('searchResult', handleKeyDown)
    changeActiveComponent('searchResult')

    formRef.current?.focus()
  }, [])

  useEffect(() => {
    if (selectedItem === null && suggestItems.length > 0) {
      setSelectedItem(0)
    } else if (suggestItems.length === 0) {
      setSelectedItem(null)
    }
  }, [suggestItems])

  return (
    <div className={`renderingArea ${isDirty ? 'isDirty' : ''}`}>
      <div className='wrapper'>
        <div className='formContainer'>
          <input className='queryForm' type='text' onChange={onFormChange} ref={formRef} />
        </div>

        {isDirty && (
          <div className='result'>
            <div className='suggestContainer'>
              <ul className='suggestList'>
                {suggestItems.map((item, index) => (
                  <li
                    key={`suggest-${index}`}
                    className={`suggestList-item ${selectedItem === index ? 'selected' : ''}`}
                  >
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>

            <KnowledgeViewContainer
              renderingContent={selectedItem !== null ? suggestItems[selectedItem].contents : null}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default AppContainer
