import { faToolbox } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { forwardRef, memo, Ref } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { css } from '../lib/emotion'
import { fontColor } from '../lib/style'

const rootStyle = css`
  position: relative;
  padding: 8px;
  flex: 1;
  color: ${fontColor};
`

const inlineCodeStyle = css`
  padding: 2px 4px;
  color: #adbac7;
  background-color: #515156;
  border-radius: 4px;
`

const codeBlockStyle = css`
  div {
    line-height: 1 !important;

    code {
      position: relative;
      line-height: 1 !important;

      span {
        font-size: 10px;
        line-height: 1 !important;
      }

      &.selected::after {
        display: block;
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: calc(100% - 4px);
        height: calc(100% - 4px);
        border: 2px solid red;
      }
    }
  }
`

const selectedCodeWrapperStyle = css`
  position: relative;
`

const enterToCopyStyle = css`
  position: absolute;
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  top: 0;
  left: 0;
  border: 2px solid red;

  span {
    position: absolute;
    right: -1px;
    bottom: -1px;
    height: 20px;
    background: red;
    font-size: 10px;
    line-height: 20px;
    padding: 0 5px;
  }
`

const editKnowledgeButtonStyle = css`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  padding: 5px;
  border-radius: 5px;

  &:hover {
    background: #68686c;
    cursor: pointer;
  }
`

const KnowledgeViewComponent: React.FC<{
  ref: Ref<HTMLDivElement>
  renderingContent: string | null
  focusedCodeBlockSourcePos: string | null
  isCopiedCode: boolean
  showContextMenuToEditKnowledge: () => void
}> = memo(
  forwardRef(
    (
      { renderingContent, focusedCodeBlockSourcePos, isCopiedCode, showContextMenuToEditKnowledge },
      ref
    ) => {
      return (
        <div className={rootStyle}>
          <div className='contents' ref={ref}>
            {renderingContent !== null && (
              <ReactMarkdown
                components={{
                  code: ({ inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        // @ts-ignore
                        style={okaidia}
                        language={match[1]}
                        PreTag='div'
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={`${className || ''} ${inlineCodeStyle}`} {...props}>
                        {children}
                      </code>
                    )
                  },
                  pre: ({ className, children, ...props }) => {
                    const isFocused =
                      props['data-sourcepos' as keyof typeof props] === focusedCodeBlockSourcePos

                    if (isFocused) {
                      return (
                        <div className={selectedCodeWrapperStyle}>
                          <pre className={`${className || ''} ${codeBlockStyle}`} {...props}>
                            {children}
                          </pre>
                          <div className={enterToCopyStyle}>
                            <span>{isCopiedCode ? 'Copied!' : 'Enter to copy'}</span>
                          </div>
                        </div>
                      )
                    } else {
                      return (
                        <pre className={`${className || ''} ${codeBlockStyle}`} {...props}>
                          {children}
                        </pre>
                      )
                    }
                  },
                }}
                sourcePos={true}
              >
                {renderingContent}
              </ReactMarkdown>
            )}
          </div>
          <div
            className={editKnowledgeButtonStyle}
            title='このナレッジを編集'
            onClick={showContextMenuToEditKnowledge}
          >
            <FontAwesomeIcon icon={faToolbox} />
          </div>
        </div>
      )
    }
  )
)

export default KnowledgeViewComponent
