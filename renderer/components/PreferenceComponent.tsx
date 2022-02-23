import React from 'react'
import { useFormContext } from 'react-hook-form'
import { css } from '../lib/emotion'

const preferenceWindowHeight = 542

const style = {
  root: css({
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
      height: '50px',
    }),
    configItemDescription: css({
      minWidth: '200px',
      paddingRight: '10px',
      textAlign: 'right',
      lineHeight: '50px',
    }),
    configItemDefinition: css({
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      marginLeft: 0,
      overflow: 'hidden',
      lineHeight: '50px',
    }),
    button: css({
      display: 'flex',
      margin: '8px 0',
      alignItems: 'center',
      borderRadius: '5px',
      background: '#553a41',
      color: '#FFFFFF',
      padding: '8px 12px',
      whiteSpace: 'nowrap',

      ':hover': {
        cursor: 'pointer',
        background: '#79535D',
      },
    }),
    input: css({
      margin: '5px 0',
    }),
  },
}

interface Props {
  onClickExit: () => void
  onClickKnowledgeStoreDirInput: (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const PreferenceComponent: React.VFC<Props> = ({ onClickExit, onClickKnowledgeStoreDirInput }) => {
  const { watch } = useFormContext()

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
              <button className={style.form.button} onClick={onClickKnowledgeStoreDirInput}>
                選択
              </button>
              <span>{watch('knowledgeStoreDirectory')}</span>
            </dd>
          </div>

          <div className={style.form.configItem}>
            <dt className={style.form.configItemDescription}>ホットキー</dt>
            <dd className={style.form.configItemDefinition}>
              <input className={style.form.input} type='text' value='Cmd + Alt + Space' />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default PreferenceComponent
