import React, { useContext, createContext, useState } from 'react'

interface Props {
  children: React.ReactNode
}

const defaultHandler = () => {
  console.warn('EventHandler is not initialized')
}

const ActiveComponentManagerContext = createContext<{
  registerEventHandler: (
    _component: string,
    _handler: (_event: React.KeyboardEvent) => Promise<void>
  ) => void
  changeActiveComponent: (_component: 'searchResult' | 'knowledgeView') => void
  activeComponent: 'searchResult' | 'knowledgeView' | null
}>({
  registerEventHandler: defaultHandler,
  changeActiveComponent: defaultHandler,
  activeComponent: null,
})

export const ActiveComponentManagerContainer: React.FC<Props> = ({ children }) => {
  const [activeComponent, setActiveComponent] = useState<'searchResult' | 'knowledgeView' | null>(
    null
  )
  const [eventHandlers, setEventHandlers] = useState<{
    [key: string]: (_event: React.KeyboardEvent) => void
  }>({})
  const [activeEventHandler, setActiveEventHandler] = useState<string | null>(null)

  const registerEventHandler = (
    component: string,
    handler: (_event: React.KeyboardEvent) => void
  ) => {
    console.debug(`EVENT HANDLER UPDATE: ${component}`)
    setEventHandlers({ ...eventHandlers, [component]: handler })
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (activeEventHandler === null) {
      console.warn('No active event handler')
    } else {
      eventHandlers[activeEventHandler](event)
    }
  }

  const changeActiveComponent = (component: 'searchResult' | 'knowledgeView') => {
    console.debug(`ACTIVE EVENT HANDLER CHANGE: ${component}`)
    setActiveComponent(component)
    setActiveEventHandler(component)
  }

  return (
    <ActiveComponentManagerContext.Provider
      value={{ registerEventHandler, changeActiveComponent, activeComponent }}
    >
      <div tabIndex={-1} onKeyDown={handleKeyDown}>
        {children}
      </div>
    </ActiveComponentManagerContext.Provider>
  )
}

const useActiveComponentManager = () => {
  return useContext(ActiveComponentManagerContext)
}

export default useActiveComponentManager
