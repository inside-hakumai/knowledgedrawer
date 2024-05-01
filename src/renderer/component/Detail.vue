<template>
  <div class="Detail">
    <div class="Detail__header">
      <div class="Detail__title">{{ sampleTitle }}</div>
      <div class="Detail__actions">
        <icon-button
          class="Detail__actionIcon"
          type="moreHorizontal"
          :size="28"
          :color="constants.color.text.sub1"
        />
      </div>
    </div>
    <div class="Detail__contents" v-html="markdownHtml" />
  </div>
</template>

<script setup lang="ts">
import * as marked from 'marked'
import { ref, watchEffect } from 'vue'
import DOMPurify from 'dompurify'
import Icon from './Icon.vue'
import * as constants from '../../constants'
import IconButton from './IconButton.vue'

const sampleTitle = 'kotlinの関数をテスト実行する方法'

const sampleMarkdown = `
kotlinファイルにおいて、main関数はプログラムのエントリポイントとして認識される。
IntelliJ上では、main関数の左に実行アイコンが表示され、そのmain関数を実行することができる。

main関数の中でテストしたいクラスやメソッドを呼び出す処理を書けばその場で動作確認ができる。

\`\`\`diff
fun main() {
    println("Hello, World!")
}
\`\`\`

`

const markdownHtml = ref<string | null>(null)

watchEffect(async () => {
  const parsedMarkdownHtml = await marked.parse(sampleMarkdown)

  markdownHtml.value = DOMPurify.sanitize(parsedMarkdownHtml)
})
</script>

<style lang="scss" scoped>
.Detail {
  width: calc(100% - 8px - 16px);
  padding: 8px 8px 8px 16px;
}

.Detail__header {
  display: flex;
  justify-content: space-between;
  padding-right: 4px;
  flex-direction: row;
  align-items: center;
}

.Detail__title {
  font-weight: bold;
}

.Detail__contents {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  color: var(--color-text-normal);
  font-size: 14px;
}
</style>
