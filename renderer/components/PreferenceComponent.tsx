import { faCheck, faExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import templateStyle from '../lib/color'
import { css } from '../lib/emotion'

const preferenceWindowHeight = 542

const style = {
  root: css({
    fontSize: '12px',
    fontWeight: 'bold',
    '-webkit-font-smoothing': 'antialiased',
    paddingTop: '10px',
    height: `${preferenceWindowHeight - 16}px`,
  }),
  backButton: css({
    display: 'inline-block',
    marginLeft: '10px',
    padding: '4px 8px',
    borderRadius: '5px',
    color: '#F7F7F7',
    ':hover': {
      cursor: 'pointer',
      backgroundColor: '#FFFFFF40',
    },
  }),
  backButtonIcon: css({
    paddingRight: '5px',
  }),

  form: {
    wrapper: css({
      padding: '0 20px',
      color: '#F7F7F7',
    }),
    itemsWrapper: css({
      display: 'flex',
      flexDirection: 'column',
    }),
    configItem: css({
      display: 'flex',
      flexDirection: 'row',
    }),
    configItemDescription: css({
      minWidth: '200px',
      paddingRight: '10px',
      textAlign: 'right',
      lineHeight: '50px',
    }),
    configItemDefinition: css({
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      marginLeft: 0,
      overflow: 'hidden',
      lineHeight: '30px',
      margin: '10px 0',
    }),
    configItemDefinitionRow: css({
      display: 'flex',
      alignItems: 'center',
      margin: 0,
      '&+&': {
        marginTop: '5px',
      },
    }),
    button: css(templateStyle.button, {
      borderRadius: '5px',
      padding: '0 10px',
      whiteSpace: 'nowrap',
      fontSize: '12px',

      '& + &': {
        marginLeft: '5px',
      },
    }),
    input: css({
      margin: '5px 0',
    }),
    icon: css({
      height: '20px',
      paddingLeft: '10px',
    }),
    iconGood: css({
      height: '20px',
      paddingLeft: '10px',
      color: '#07c307',
    }),
    iconAlert: css({
      height: '20px',
      paddingLeft: '10px',
      color: '#c30707',
    }),
  },
}

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

const PreferenceComponent: React.VFC<Props> = ({
  onClickExit,
  onClickKnowledgeStoreDirInput,
  onClickAppForOpeningKnowledgeInput,
  onClickResetAppForOpeningKnowledge,
}) => {
  const {
    register,
    watch,
    formState: { errors, isValid, dirtyFields },
  } = useFormContext()

  useEffect(() => {
    return () => {
      console.debug('Unmounting PreferenceComponent')
    }
  }, [])

  return (
    <div className={style.root}>
      <div className={style.backButton} onClick={onClickExit}>
        <i className={`fas fa-arrow-left ${style.backButtonIcon}`} />
        <span>Exit Preference</span>
      </div>

      <div className={style.form.wrapper}>
        <dl className={style.form.itemsWrapper}>
          <div className={style.form.configItem}>
            <dt className={style.form.configItemDescription}>保存先</dt>
            <dd className={style.form.configItemDefinition}>
              <p className={style.form.configItemDefinitionRow}>
                {watch('knowledgeStoreDirectory')}
              </p>
              <p className={style.form.configItemDefinitionRow}>
                <span className={style.form.button} onClick={onClickKnowledgeStoreDirInput}>
                  選択
                </span>
                {dirtyFields?.knowledgeStoreDirectory === true && (
                  <FontAwesomeIcon
                    icon={errors.knowledgeStoreDirectory ? faExclamation : faCheck}
                    size='xs'
                    className={
                      errors.knowledgeStoreDirectory ? style.form.iconAlert : style.form.iconGood
                    }
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

          <div className={style.form.configItem}>
            <dt className={style.form.configItemDescription}>編集時に使用するアプリケーション</dt>
            <dd className={style.form.configItemDefinition}>
              <p className={style.form.configItemDefinitionRow}>
                {watch('appForOpeningKnowledgeFile') || 'システムのデフォルト設定を使用'}
              </p>
              <p className={style.form.configItemDefinitionRow}>
                <span className={style.form.button} onClick={onClickAppForOpeningKnowledgeInput}>
                  選択
                </span>
                <span className={style.form.button} onClick={onClickResetAppForOpeningKnowledge}>
                  デフォルトに戻す
                </span>
                {dirtyFields?.appForOpeningKnowledgeFile === true && (
                  <FontAwesomeIcon
                    icon={errors.appForOpeningKnowledgeFile ? faExclamation : faCheck}
                    size='xs'
                    className={
                      errors.appForOpeningKnowledgeFile ? style.form.iconAlert : style.form.iconGood
                    }
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
    </div>
  )
}

export default PreferenceComponent
