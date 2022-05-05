import React from 'react'
import { css } from '../lib/emotion'
import { fontColor } from '../lib/style'

const rootStyle = css`
  flex: 1;
  color: ${fontColor};
  border-right: 1px solid #86868d;
`

const suggestionListStyle = css`
  margin: 0;
  padding: 0;
  list-style-type: none;
`

const suggestionItemStyle = css`
  padding: 8px;

  &.selected {
    background: #00000040;
  }
`

interface Props {
  suggestions: {
    items: {
      title: string
    }[]
    selectedItemIndex: number | null
  }
}

const SuggestionListComponent: React.FC<Props> = ({ suggestions }) => {
  return (
    <div className={rootStyle}>
      <ul className={suggestionListStyle}>
        {suggestions.items.map((item, index) => (
          <li
            key={`suggest-${index}`}
            className={`${suggestionItemStyle} ${
              suggestions.selectedItemIndex === index ? 'selected' : ''
            }`}
          >
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SuggestionListComponent
