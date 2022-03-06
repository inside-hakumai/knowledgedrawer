import { css } from './emotion'

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
