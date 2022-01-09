import React, { useEffect, useRef, useState } from 'react'
import KnowledgeViewComponent from '../components/KnowledgeViewComponent'
import useActiveComponentManager from '../hooks/useActiveComponentManager'
import { mapKeyToAction } from '../lib/functions'

interface Props {
  renderingContent: string | null
}

const KnowledgeViewContainer: React.VFC<Props> = ({ renderingContent }) => {
  const { registerEventHandler, changeActiveComponent, activeComponent } =
    useActiveComponentManager()

  const [codeBlockSourcePosList, setCodeBlockSourcePosList] = useState<string[] | null>(null)
  const [selectedCodeBlockIndex, setSelectedCodeBlockIndex] = useState<number | null>(null)
  const [isCopiedCode, setIsCopiedCode] = useState(false)

  const codeBlockSourcePosListRef = useRef<typeof codeBlockSourcePosList>(codeBlockSourcePosList)
  const selectedCodeBlockIndexRef = useRef<typeof selectedCodeBlockIndex>(selectedCodeBlockIndex)

  const rootDivRef = useRef<HTMLDivElement>(null)
  const renderingAreaRef = useRef<HTMLDivElement>(null)

  const copyCode = async () => {
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
    } else if (selectedCode.textContent === null) {
      console.warn('Selected code block has no text content')
    } else {
      await window.api.writeClipboard(selectedCode.textContent)
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
        await copyCode()
      } else {
        console.warn('Attempt to copy code although no code block is selected')
      }
      return
    }

    const triggeredAction = mapKeyToAction(event)
    if (triggeredAction === null) {
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
    codeBlockSourcePosListRef.current = codeBlockSourcePosList
    selectedCodeBlockIndexRef.current = selectedCodeBlockIndex
  })

  useEffect(() => {
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

export default KnowledgeViewContainer
