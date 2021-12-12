import { useEffect, useRef, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import darcula from 'react-syntax-highlighter/dist/esm/styles/hljs/darcula'

const sampleSuggestItems = [
  'SpringBoot @Transactional',
  'SpringBoot Mybatisのテスト',
  'SpringBoot Thymeleafのテスト',
  'WHERE句でnullを指定する',
  'hoge',
  'huga',
]

const sampleCode = 'SELECT * FROM <テーブル名> WHERE <カラム名> IS NULL;'

const App: React.VFC = () => {
  const [isDirty, setIsDirty] = useState(false)
  const [suggestItems, setSuggestItems] = useState<string[]>([])
  const [selectedItem, setSelectedItem] = useState<number | null>(null)

  const onFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    if (event.target.value.length === 0) {
      clearResult()
    } else {
      // TODO: ここに検索処理を書く

      setSuggestItems(sampleSuggestItems)
    }
  }

  const clearResult = () => {
    setIsDirty(false)
    setSuggestItems([])
    setSelectedItem(null)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (
        selectedItem === null ||
        (event.key === 'ArrowDown' && selectedItem === suggestItems.length - 1) ||
        (event.key === 'ArrowUp' && selectedItem === 0)
      ) {
        return
      }

      const nextIndex = selectedItem + (event.key === 'ArrowDown' ? 1 : -1)
      setSelectedItem(nextIndex)
      console.debug('Selected item:', nextIndex)
    }
  }

  useEffect(() => {
    if (selectedItem === null && suggestItems.length > 0) {
      setSelectedItem(0)
    } else if (suggestItems.length === 0) {
      setSelectedItem(null)
    }
  }, [suggestItems])

  return (
    <div className='renderingArea' onKeyDown={handleKeyDown}>
      <div className='wrapper'>
        <div className={`formContainer ${isDirty ? 'isDirty' : ''}`}>
          <input className='queryForm' type='text' onChange={onFormChange} />
        </div>

        {isDirty && (
          <div className='result'>
            <div className='suggestContainer'>
              <ul className='suggestList'>
                {sampleSuggestItems.map((item, index) => (
                  <li
                    key={`suggest-${index}`}
                    className={`suggestList-item ${selectedItem === index ? 'selected' : ''}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className='contentsContainer'>
              <div className='contents'>
                <p>WHERE （カラム名） = null は機能しない。 IS NULL を使う。</p>
                <SyntaxHighlighter language='sql' style={darcula}>
                  {sampleCode}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
