import createCache from '@emotion/cache'
import createEmotion, { Emotion } from '@emotion/css/create-instance'
import { EmotionCache } from '@emotion/react'

const nonce = await window.api.requestNonce()

const cache: EmotionCache = createCache({
  key: 'kb-css',
  nonce: nonce,
})

const emotion: Emotion = createEmotion(cache)
const { css } = emotion

export { css, cache, emotion }
