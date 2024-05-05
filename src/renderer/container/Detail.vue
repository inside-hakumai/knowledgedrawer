<template>
  <div class="Detail" v-if="knowledge">
    <div class="Detail__header">
      <div class="Detail__headerContents">
        <div class="Detail__title">{{ knowledge.title }}</div>
        <div class="Detail__actions">
          <icon-button
            class="Detail__actionIcon"
            type="moreHorizontal"
            :size="28"
            :color="constants.color.text.sub1"
          />
        </div>
      </div>
      <div class="Detail__Border" />
    </div>
    <div class="Detail__contentsWrapper">
      <div class="Detail__contents" v-html="knowledge.contentsMarkdownHtml" />
    </div>
  </div>
</template>

<script setup lang="ts">
import * as marked from 'marked'
import { ref, watchEffect } from 'vue'
import DOMPurify from 'dompurify'
import * as constants from '../../constants'
import IconButton from './IconButton.vue'
import { useSearchModeStateStore } from '../composable/useStore'
import { isValidAs, knowledgeSchema, tentativeKnowledgeSchema } from '../model'

const searchModeState = useSearchModeStateStore()

const knowledge = ref<{ title: string; contentsMarkdownHtml: string } | null>(null)

watchEffect(async () => {
  const { selectedKnowledge } = searchModeState

  if (isValidAs(knowledgeSchema, selectedKnowledge)) {
    const parsedMarkdownHtml = await marked.parse(selectedKnowledge.contents)
    knowledge.value = {
      title: selectedKnowledge.title,
      contentsMarkdownHtml: DOMPurify.sanitize(parsedMarkdownHtml),
    }
  }

  if (isValidAs(tentativeKnowledgeSchema, selectedKnowledge)) {
    knowledge.value = {
      title: selectedKnowledge.title,
      contentsMarkdownHtml: '',
    }
  }
})
</script>

<style lang="scss" scoped>
.Detail {
  display: flex;
  flex-direction: column;
  width: calc(100% - 8px - 16px);
  height: calc(100% - 8px);
  padding: 8px 8px 0 16px;
}

.Detail__header {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.Detail__headerContents {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-right: 4px;
}

.Detail__title {
  font-weight: bold;
}

.Detail__Border {
  position: relative;
  display: block;
  margin-top: 8px;
  margin-bottom: 16px;

  &::before {
    position: absolute;
    left: -8px;
    display: block;
    width: calc(100% + 8px);
    height: 1px;
    content: '';
    background-color: var(--color-border);
  }
}

.Detail__contentsWrapper {
  overflow: scroll;
}

.Detail__contents {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  font-size: 14px;
  color: var(--color-text-normal);

  :deep(:first-child) {
    margin-block-start: 0;
  }
}
</style>
