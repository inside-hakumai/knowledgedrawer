import { css } from './emotion'

export const windowWidth = 752 // px
export const defaultWindowHeight = 100 // px
export const expandedWindowHeight = 800 // px
export const preferenceWindowHeight = 542 // px

export const fontColor = '#F7F7F7'
export const dividerColor = '#86868D'

const templateStyle = {
  button: css({
    background: '#0092CA',
    color: '#FFFFFF',

    '&:hover': {
      cursor: 'pointer',
      background: '#4AB7E1',
    },
  }),
  divider: css({
    border: `1px solid ${dividerColor}`,
  }),
}

export default templateStyle
