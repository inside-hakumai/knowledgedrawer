import { css } from './emotion'

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
    border: '1px solid #BDBDBD',
  }),
}

export default templateStyle
