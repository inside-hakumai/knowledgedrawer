import { CacheProvider } from '@emotion/react'
import React from 'react'
import AppContainer from './AppContainer'
import '@fortawesome/fontawesome-free/css/all.css'
import { cache as emotionCache } from './lib/emotion'

const App: React.FC = () => {
  return (
    <>
      {emotionCache && (
        <CacheProvider value={emotionCache}>
          <AppContainer />
        </CacheProvider>
      )}
    </>
  )
}

export default App
