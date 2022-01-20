import React from 'react'
import AppContainer from './AppContainer'
import { ActiveComponentManagerContainer } from './hooks/useActiveComponentManager'
import '@fortawesome/fontawesome-free/css/all.css'

const App: React.VFC = () => {
  return (
    <ActiveComponentManagerContainer>
      <AppContainer />
    </ActiveComponentManagerContainer>
  )
}

export default App
