import React, { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'

interface Props {
  onClickExit: () => void
  onClickKnowledgeStoreDirInput: (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const PreferenceComponent: React.VFC<Props> = ({ onClickExit, onClickKnowledgeStoreDirInput }) => {
  const { register, watch } = useFormContext()

  const onKnowledgeStoreDirInputChange = useCallback((e) => {
    console.log(e)
  }, [])

  return (
    <div className='preference'>
      <div className='back' onClick={onClickExit}>
        <i className='fas fa-arrow-left' />
        <span>Exit Preference</span>
      </div>

      <div className='form'>
        <dl>
          <div className='configItem'>
            <dt>保存先</dt>
            <dd>
              <button className='button' onClick={onClickKnowledgeStoreDirInput}>
                選択
              </button>
              <span>{watch('knowledgeStoreDirectory')}</span>
            </dd>
          </div>

          <div className='configItem'>
            <dt>ホットキー</dt>
            <dd>
              <input type='text' value='Cmd + Alt + Space' />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default PreferenceComponent
