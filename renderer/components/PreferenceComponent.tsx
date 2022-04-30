import { faCheck, faExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { css } from '../lib/emotion'
import templateStyle, { dividerColor, preferenceWindowHeight } from '../lib/style'

const rootStyle = css`
  font-size: 12px;
  font-weight: bold;
  -webkit-font-smoothing: antialiased;
  padding-top: 10px;
  height: ${preferenceWindowHeight - 16}px;
`

const backButtonStyle = css`
  display: inline-block;
  margin-left: 10px;
  padding: 4px 8px;
  border-radius: 5px;
  color: #f7f7f7;

  i.fas {
    padding-right: 5px;
  }

  &:hover {
    cursor: pointer;
    background-color: #ffffff40;
  }
`

const formWrapperStyle = css`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  color: #f7f7f7;
`

const configItemStyle = css`
  display: flex;
  flex-direction: row;

  & + & {
    border-top: 1px solid ${dividerColor};
  }
`

const configItemTitleStyle = css`
  min-width: 200px;
  padding-right: 20px;
  text-align: right;
  line-height: 70px;
`

const configItemContentsStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  line-height: 30px;
  margin: 20px 0;

  & > * {
    margin: 0;
  }
  & > *:not(:last-child) {
    margin-bottom: 10px;
  }
`

const configItemRowStyle = css`
  display: flex;
  height: 30px;
  align-items: center;
  margin: 0;
`

const configItemInputRowStyle = css`
  ${configItemRowStyle};
  border: 1px solid #86868d;
  border-radius: 5px;
  padding: 0 10px;
  overflow: scroll;
  white-space: nowrap;
`

const buttonStyle = css`
  ${templateStyle.button};
  border-radius: 5px;
  padding: 0 10px;
  white-space: nowrap;
  font-size: 12px;

  & + & {
    margin-left: 5px;
  }
`

const iconStyle = css`
  height: 20px;
  padding-left: 10px;
`

const goodIconStyle = css`
  ${iconStyle};
  color: #07c307;
`

const alertIconStyle = css`
  ${iconStyle};
  color: #c30707;
`

interface Props {
  onClickExit: () => void
  onClickKnowledgeStoreDirInput: (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onClickAppForOpeningKnowledgeInput: (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void
  onClickResetAppForOpeningKnowledge: (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void
}

const PreferenceComponent: React.FC<Props> = ({
  onClickExit,
  onClickKnowledgeStoreDirInput,
  onClickAppForOpeningKnowledgeInput,
  onClickResetAppForOpeningKnowledge,
}) => {
  const {
    watch,
    formState: { errors, dirtyFields },
  } = useFormContext()

  useEffect(() => {
    return () => {
      console.debug('Unmounting PreferenceComponent')
    }
  }, [])

  return (
    <div className={rootStyle}>
      <div className={backButtonStyle} onClick={onClickExit}>
        <i className={`fas fa-arrow-left`} />
        <span>Exit Preference</span>
      </div>

      <dl className={formWrapperStyle}>
        <div className={configItemStyle}>
          <dt className={configItemTitleStyle}>保存先</dt>
          <dd className={configItemContentsStyle}>
            <p className={configItemInputRowStyle}>{watch('knowledgeStoreDirectory')}</p>
            <p className={configItemRowStyle}>
              <span className={buttonStyle} onClick={onClickKnowledgeStoreDirInput}>
                選択
              </span>
              {dirtyFields?.knowledgeStoreDirectory === true && (
                <FontAwesomeIcon
                  icon={errors.knowledgeStoreDirectory ? faExclamation : faCheck}
                  size='xs'
                  className={errors.knowledgeStoreDirectory ? alertIconStyle : goodIconStyle}
                />
              )}
              {errors.knowledgeStoreDirectory && (
                <span className='preference_form_configItem_error'>
                  {errors.knowledgeStoreDirectory.message}
                </span>
              )}
            </p>
          </dd>
        </div>

        <div className={configItemStyle}>
          <dt className={configItemTitleStyle}>編集時に使用するアプリケーション</dt>
          <dd className={configItemContentsStyle}>
            <p className={configItemInputRowStyle}>
              {watch('appForOpeningKnowledgeFile') || 'システムのデフォルト設定を使用'}
            </p>
            <p className={configItemRowStyle}>
              <span className={buttonStyle} onClick={onClickAppForOpeningKnowledgeInput}>
                選択
              </span>
              <span className={buttonStyle} onClick={onClickResetAppForOpeningKnowledge}>
                デフォルトに戻す
              </span>
              {dirtyFields?.appForOpeningKnowledgeFile === true && (
                <FontAwesomeIcon
                  icon={errors.appForOpeningKnowledgeFile ? faExclamation : faCheck}
                  size='xs'
                  className={errors.appForOpeningKnowledgeFile ? alertIconStyle : goodIconStyle}
                />
              )}
              {errors.appForOpeningKnowledgeFile && (
                <span className='preference_form_configItem_error'>
                  {errors.appForOpeningKnowledgeFile.message}
                </span>
              )}
            </p>
          </dd>
        </div>
      </dl>
    </div>
  )
}

export default PreferenceComponent
