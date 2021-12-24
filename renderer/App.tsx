import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark-dimmed.css'
import MarkdownIt from 'markdown-it'

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

const App: React.VFC = () => {
  const [isDirty, setIsDirty] = useState(false)
  const [suggestItems, setSuggestItems] = useState<{ title: string; contents: string }[]>([])
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [controllableArea, setControllableArea] = useState<'searchResult' | 'article' | null>(null)
  const [selectedCodeItem, setSelectedCodeItem] = useState<number | null>(null)
  const [articleCodeList, setArticleCodeList] = useState<NodeListOf<Element> | null>(null)

  const formRef = useRef<HTMLInputElement>(null)
  const articleDivRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // @ts-ignore
    window.api.onReceiveSuggest((result) => {
      setSuggestItems(result)
    })

    // @ts-ignore
    window.api.onDoneDeactivate(() => {
      setIsDirty(false)
      setSuggestItems([])
      setSelectedItem(null)
      formRef.current!.value = ''
    })

    formRef.current?.focus()
  }, [])

  const onFormChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    if (event.target.value.length === 0) {
      clearResult()
    } else {
      // @ts-ignore
      window.api.search(event.target.value)
    }
  }

  const clearResult = () => {
    // @ts-ignore
    window.api.clearSearch()
    setIsDirty(false)
    setSuggestItems([])
    setSelectedItem(null)
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    console.debug(`Key: ${event.key}`)

    if (event.key === 'Escape') {
      if (controllableArea === 'article') {
        setControllableArea('searchResult')
        setSelectedCodeItem(null)
        articleCodeList?.forEach((code) => {
          code.classList.remove('selected')
        })
      } else if (controllableArea === 'searchResult') {
        await requestDeactivate()
      }
      return
    }

    if (selectedItem === null) {
      return
    }

    if (event.key === 'Enter') {
      if (articleCodeList !== null && articleCodeList.length > 0) {
        setSelectedCodeItem(0)
        articleCodeList[0].classList.add('selected')
        setControllableArea('article')
      }
    }

    let triggeredAction: 'up' | 'down'

    if (event.key === 'ArrowUp' || (event.ctrlKey && event.key === 'p')) {
      triggeredAction = 'up'
    } else if (event.key === 'ArrowDown' || (event.ctrlKey && event.key === 'n')) {
      triggeredAction = 'down'
    } else {
      return
    }

    if (controllableArea === 'article' && articleCodeList !== null && selectedCodeItem != null) {
      if (
        (triggeredAction === 'down' && selectedCodeItem === articleCodeList.length - 1) ||
        (triggeredAction === 'up' && selectedCodeItem === 0)
      ) {
        return
      }

      const nextIndex = selectedCodeItem + (triggeredAction === 'down' ? 1 : -1)
      setSelectedCodeItem(nextIndex)
      articleCodeList.forEach((code, index) => {
        if (index === nextIndex) {
          code.classList.add('selected')
        } else {
          code.classList.remove('selected')
        }
      })
      console.debug('Selected codeItem:', nextIndex)
    } else {
      if (
        (triggeredAction === 'down' && selectedItem === suggestItems.length - 1) ||
        (triggeredAction === 'up' && selectedItem === 0)
      ) {
        return
      }

      const nextIndex = selectedItem + (triggeredAction === 'down' ? 1 : -1)
      setSelectedItem(nextIndex)
      console.debug('Selected item:', nextIndex)
    }
  }

  const requestDeactivate = () => {
    // @ts-ignore
    window.api.requestDeactivate()
  }

  useEffect(() => {
    if (selectedItem === null && suggestItems.length > 0) {
      setSelectedItem(0)
      setControllableArea('searchResult')
    } else if (suggestItems.length === 0) {
      setSelectedItem(null)
      setControllableArea(null)
    }
  }, [suggestItems])

  useLayoutEffect(() => {
    if (selectedItem !== null) {
      setArticleCodeList(articleDivRef.current!.querySelectorAll('code.hljs'))
    }
  }, [selectedItem])

  return (
    <div
      className={`renderingArea ${isDirty ? 'isDirty' : ''}`}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      <div className='wrapper'>
        <div className='formContainer'>
          <input className='queryForm' type='text' onChange={onFormChange} ref={formRef} />
        </div>

        {isDirty && (
          <div className='result'>
            <div className='suggestContainer'>
              <ul className='suggestList'>
                {suggestItems.map((item, index) => (
                  <li
                    key={`suggest-${index}`}
                    className={`suggestList-item ${selectedItem === index ? 'selected' : ''}`}
                  >
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>

            <div className='contentsContainer'>
              <div className='contents'>
                {selectedItem !== null && (
                  <div
                    ref={articleDivRef}
                    dangerouslySetInnerHTML={{
                      __html: md.render(suggestItems[selectedItem].contents),
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
