import React, { useEffect, useRef, useState } from 'react'
import 'highlight.js/styles/github-dark-dimmed.css'
import KnowledgeView from './components/KnowledgeView'
import useActiveComponentManager from './hooks/useActiveComponentManager'

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

  useEffect(() => {
    suggestItemsRef.current = suggestItems
    selectedItemRef.current = selectedItem
    activeComponentRef.current = activeComponent
  })

  useEffect(() => {
    // @ts-ignore
    window.api.onReceiveSuggest((result) => {
      setSuggestItems(result)
    })

    // @ts-ignore
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
    if (activeComponent === 'searchResult') {
    } else {
    }
  }, [activeComponent])

  const onFormChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    if (event.target.value.length === 0) {
      clearResult()
    } else {
      // @ts-ignore
      window.api.search(event.target.value)
    }
  }

  const clearResult = () => {
    // @ts-ignore
    window.api.clearSearch()
    setIsDirty(false)
    setSuggestItems([])
    setSelectedItem(null)
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

    let triggeredAction: 'ArrowUp' | 'ArrowDown'

    if (event.key === 'ArrowUp' || (event.ctrlKey && event.key === 'p')) {
      triggeredAction = 'ArrowUp'
    } else if (event.key === 'ArrowDown' || (event.ctrlKey && event.key === 'n')) {
      triggeredAction = 'ArrowDown'
    } else {
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

  const requestDeactivate = () => {
    // @ts-ignore
    window.api.requestDeactivate()
  }

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

            <KnowledgeView
              renderingContent={selectedItem !== null ? suggestItems[selectedItem].contents : null}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default AppContainer
