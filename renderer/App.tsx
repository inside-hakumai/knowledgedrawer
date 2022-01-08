import { ActiveComponentManagerContainer } from './hooks/useActiveComponentManager'
import AppContainer from './AppContainer'
import React from 'react'

const App: React.VFC = () => {
  return (
    <ActiveComponentManagerContainer>
      <AppContainer />
    </ActiveComponentManagerContainer>
  )
}

export default App
