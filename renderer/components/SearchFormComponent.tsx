import React from 'react'
import { css } from '../lib/emotion'
import { fontColor } from '../lib/style'

const rootStyle = css`
  position: relative;
  padding: 8px;
  width: 784px;
  height: 77px;

  &.isDirty {
    border-bottom: 1px solid #86868d;
  }
`

const formInputStyle = css`
  color: ${fontColor};
  width: 100%;
  height: 100%;
  font-size: 40px;
  background: none;
  border: none;
  outline: none;
`

const buttonsStyle = css`
  position: absolute;
  bottom: 0;
  right: 0;
`

const buttonIconStyle = css`
  font-size: 25px;
  padding: 10px;
  color: rgba(255, 255, 255, 0.8);

  &:hover {
    color: rgba(255, 255, 255, 1);
    background: #ffffff40;
    border-radius: 6px 0 0 0;
    cursor: pointer;
  }

  &::before {
    cursor: pointer;
  }
`

interface Props {
  onFormChange: (_event: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  formRef: React.RefObject<HTMLInputElement>
  createNewKnowledge: () => void
  isDirty: boolean
  shouldShowTutorial: boolean
}

const SearchFormComponent: React.VFC<Props> = ({
  onFormChange,
  formRef,
  createNewKnowledge,
  isDirty,
  shouldShowTutorial,
}) => {
  return (
    <div className={`${rootStyle} ${isDirty ? 'isDirty' : ''}`}>
      <input
        className={formInputStyle}
        type='text'
        onChange={onFormChange}
        ref={formRef}
        placeholder={shouldShowTutorial ? 'ここに「使い方」と入力' : undefined}
      />
      <div className={buttonsStyle}>
        <i className={`fas fa-plus ${buttonIconStyle}`} onClick={createNewKnowledge} />
      </div>
    </div>
  )
}

export default SearchFormComponent
