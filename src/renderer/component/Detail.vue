<template>
  <div class="Detail" v-if="knowledge">
    <div class="Detail__header">
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
    <div class="Detail__contents" v-html="knowledge.contentsMarkdownHtml" />
  </div>
</template>

<script setup lang="ts">
import * as marked from 'marked'
import { ref, watchEffect } from 'vue'
import DOMPurify from 'dompurify'
import * as constants from '../../constants'
import IconButton from './IconButton.vue'
import { useStore } from '../composable/useStore'

const searchStore = useStore()

const knowledge = ref<{ title: string; contentsMarkdownHtml: string } | null>(null)

watchEffect(async () => {
  const { selectedKnowledge } = searchStore
  if (!selectedKnowledge) {
    knowledge.value = null
    return
  }

  const parsedMarkdownHtml = await marked.parse(selectedKnowledge.contents)
  knowledge.value = {
    title: selectedKnowledge.title,
    contentsMarkdownHtml: DOMPurify.sanitize(parsedMarkdownHtml),
  }
})
</script>

<style lang="scss" scoped>
.Detail {
  width: calc(100% - 8px - 16px);
  padding: 8px 8px 8px 16px;
}

.Detail__header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-right: 4px;
}

.Detail__title {
  font-weight: bold;
}

.Detail__contents {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  font-size: 14px;
  color: var(--color-text-normal);
}
</style>
