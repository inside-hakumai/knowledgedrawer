import { useEffect, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import darcula from 'react-syntax-highlighter/dist/esm/styles/hljs/darcula'

const App: React.VFC = () => {
  const [isDirty, setIsDirty] = useState(false)

  const sampleCode = 'SELECT * FROM <テーブル名> WHERE <カラム名> IS NULL;'

  return (
    <div className='renderingArea'>
      <div className='wrapper'>
        <div className={`formContainer ${isDirty ? 'isDirty' : ''}`}>
          <input className='queryForm' type='text' onKeyDown={() => setIsDirty(true)} />
        </div>

        {isDirty && (
          <div className='result'>
            <div className='suggestContainer'>
              <ul className='suggestList'>
                <li className='suggestList-item'>SpringBoot @Transactional</li>
                <li className='suggestList-item'>SpringBoot Mybatisのテスト</li>
                <li className='suggestList-item'>SpringBoot Thymeleafのテスト</li>
                <li className='suggestList-item'>WHERE句でnullを指定する</li>
                <li className='suggestList-item'>hoge</li>
                <li className='suggestList-item'>huga</li>
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
