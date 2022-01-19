import React from 'react'
import AppContainer from './AppContainer'
import { ActiveComponentManagerContainer } from './hooks/useActiveComponentManager'

const App: React.VFC = () => {
  return (
    <ActiveComponentManagerContainer>
      <AppContainer />
    </ActiveComponentManagerContainer>
  )
}

export default App
