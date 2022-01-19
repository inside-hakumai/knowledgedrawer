import React, { forwardRef, memo, Ref } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism'

const KnowledgeViewComponent: React.VFC<{
  ref: Ref<HTMLDivElement>
  renderingContent: string | null
  focusedCodeBlockSourcePos: string | null
  isCopiedCode: boolean
}> = memo(
  forwardRef(({ renderingContent, focusedCodeBlockSourcePos, isCopiedCode }, ref) => {
    return (
      <div className='contents' ref={ref}>
        {renderingContent !== null && (
          <ReactMarkdown
            components={{
              code: ({ inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter style={okaidia} language={match[1]} PreTag='div' {...props}>
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
              pre: ({ className, children, ...props }) => {
                const isFocused =
                  props['data-sourcepos' as keyof typeof props] === focusedCodeBlockSourcePos

                if (isFocused) {
                  return (
                    <div className='selectedWrapper'>
                      <pre className={`${className || ''} codeBlock`} {...props}>
                        {children}
                      </pre>
                      <div className='enterToCopy'>
                        <span>{isCopiedCode ? 'Copied!' : 'Enter to copy'}</span>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <pre className={`${className || ''} codeBlock`} {...props}>
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
    )
  })
)

export default KnowledgeViewComponent
