import React from 'react'

interface Props {
  onClickExit: () => void
}

const PreferenceComponent: React.VFC<Props> = ({ onClickExit }) => {
  return (
    <div className='preference'>
      <div className='back' onClick={onClickExit}>
        <i className='fas fa-arrow-left' />
        <span>Exit Preference</span>
      </div>
    </div>
  )
}

export default PreferenceComponent
