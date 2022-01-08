import React, { Ref, useEffect, useRef, useState } from 'react'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism'
import useActiveComponentManager from '../hooks/useActiveComponentManager'

const md: MarkdownIt = new MarkdownIt({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre><code class="hljs">' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
        )
      } catch (__) {}
    }

    return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>'
  },
})

interface Props {
  renderingContent: string | null
}

const KnowledgeView: React.VFC<Props> = ({ renderingContent }, ref) => {
  const { registerEventHandler, changeActiveComponent, activeComponent } =
    useActiveComponentManager()

  const [codeBlockSourcePosList, setCodeBlockSourcePosList] = useState<string[] | null>(null)
  const [selectedCodeBlockIndex, setSelectedCodeBlockIndex] = useState<number | null>(null)
  const [isCopiedCode, setIsCopiedCode] = useState(false)

  const codeBlockSourcePosListRef =
    React.useRef<typeof codeBlockSourcePosList>(codeBlockSourcePosList)
  const selectedCodeBlockIndexRef = useRef<typeof selectedCodeBlockIndex>(selectedCodeBlockIndex)

  const rootDivRef = React.useRef<HTMLDivElement>(null)
  const renderingAreaRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    codeBlockSourcePosListRef.current = codeBlockSourcePosList
    selectedCodeBlockIndexRef.current = selectedCodeBlockIndex
  })

  useEffect(() => {
    // @ts-ignore
    window.api.onDoneWriteClipboard(() => {
      setIsCopiedCode(true)
    })

    registerEventHandler('knowledgeView', handleKeyDown)
  }, [])

  useEffect(() => {
    if (renderingContent !== null && renderingAreaRef.current !== null) {
      setCodeBlockSourcePosList(
        Array.from(renderingAreaRef.current!.querySelectorAll('pre'))
          .map((e) => e.getAttribute('data-sourcepos'))
          .filter((e) => e !== null) as string[]
      )
    }
  }, [renderingContent])

  const copyCode = () => {
    const currentCodeBlockSourcePosList = codeBlockSourcePosListRef.current
    const currentSelectedCodeBlockIndex = selectedCodeBlockIndexRef.current

    if (currentSelectedCodeBlockIndex === null) {
      console.warn('Attempt to copy code although no code block is selected')
      return
    }
    if (currentCodeBlockSourcePosList === null) {
      console.warn('Attempt to copy code although current knowledge has no code block')
      return
    }

    const selectedCode = renderingAreaRef.current!.querySelector('.selectedWrapper pre')
    if (selectedCode === null) {
      console.warn('Attempt to copy code although no code block is selected')
      return
    } else {
      // @ts-ignore
      window.api.writeClipboard(selectedCode.textContent)
    }
  }

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    console.debug('KnowledgeView', event.key)

    const currentCodeBlockSourcePosList = codeBlockSourcePosListRef.current
    const currentSelectedCodeBlockIndex = selectedCodeBlockIndexRef.current

    if (event.key === 'Escape') {
      setSelectedCodeBlockIndex(null)
      changeActiveComponent('searchResult')
      return
    }

    if (event.key === 'Enter') {
      if (currentSelectedCodeBlockIndex !== null) {
        copyCode()
      } else {
        console.warn('Attempt to copy code although no code block is selected')
      }
      return
    }

    let triggeredAction: 'ArrowUp' | 'ArrowDown'
    if (event.key === 'ArrowUp' || (event.ctrlKey && event.key === 'p')) {
      triggeredAction = 'ArrowUp'
    } else if (event.key === 'ArrowDown' || (event.ctrlKey && event.key === 'n')) {
      triggeredAction = 'ArrowDown'
    } else {
      return
    }

    setSelectedCodeBlockIndex((prevIndex) => {
      if (prevIndex === null || currentCodeBlockSourcePosList === null) {
        return null
      }

      if (
        (triggeredAction === 'ArrowDown' &&
          prevIndex === currentCodeBlockSourcePosList.length - 1) ||
        (triggeredAction === 'ArrowUp' && prevIndex === 0)
      ) {
        return prevIndex
      } else {
        return prevIndex + (triggeredAction === 'ArrowDown' ? 1 : -1)
      }
    })
    setIsCopiedCode(false)
  }

  useEffect(() => {
    if (activeComponent === 'knowledgeView') {
      console.debug('Active => KnowledgeView')
      // document.addEventListener('keydown', handleKeyDown, false)

      rootDivRef.current!.focus()
      setSelectedCodeBlockIndex(0)
    }
  }, [activeComponent])

  return (
    <div className='contentsContainer' ref={rootDivRef}>
      <KnowledgeViewComponent
        ref={renderingAreaRef}
        renderingContent={renderingContent}
        focusedCodeBlockSourcePos={
          selectedCodeBlockIndex !== null && codeBlockSourcePosList !== null
            ? codeBlockSourcePosList[selectedCodeBlockIndex]
            : null
        }
        isCopiedCode={isCopiedCode}
      />
    </div>
  )
}

const KnowledgeViewComponent: React.VFC<{
  ref: Ref<HTMLDivElement>
  renderingContent: string | null
  focusedCodeBlockSourcePos: string | null
  isCopiedCode: boolean
}> = React.memo(
  React.forwardRef(({ renderingContent, focusedCodeBlockSourcePos, isCopiedCode }, ref) => {
    return (
      <div className='contents' ref={ref}>
        {renderingContent !== null && (
          <ReactMarkdown
            children={renderingContent}
            components={{
              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    style={okaidia}
                    language={match[1]}
                    PreTag='div'
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
              pre: ({ node, className, children, ...props }) => {
                const isFocused =
                  props['data-sourcepos' as keyof typeof props] === focusedCodeBlockSourcePos

                if (isFocused) {
                  return (
                    <div className='selectedWrapper'>
                      <pre className={`${className ? className : ''} codeBlock`} {...props}>
                        {children}
                      </pre>
                      <div className='enterToCopy'>
                        <span>{isCopiedCode ? 'Copied!' : 'Enter to copy'}</span>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <pre className={`${className ? className : ''} codeBlock`} {...props}>
                      {children}
                    </pre>
                  )
                }
              },
            }}
            sourcePos={true}
          />
        )}
      </div>
    )
  })
)

export default KnowledgeView
