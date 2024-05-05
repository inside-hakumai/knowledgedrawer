<template>
  <div class="SearchResult">
    <ul class="SearchResult__itemList">
      <template v-for="item in items" :key="item.id">
        <knowledge-list-item
          v-if="isValidAs(knowledgeSchema, item)"
          :item="item"
          :selected="searchModeState.selectedKnowledgeId === item.id"
          @click="() => searchModeState.select(item.id)"
        />
        <search-result-item-editing
          v-if="isValidAs(tentativeKnowledgeSchema, item)"
          @input="searchModeState.setEditingKnowledgeTitle"
          @submit="createNewKnowledge"
        />
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useSearchModeStateStore } from '../composable/useStore'
import { useKeybindingStore } from '../composable/useStore'
import KnowledgeListItem from '../component/KnowledgeListItem.vue'
import SearchResultItemEditing from '../component/KnowledgeListItemEditing.vue'
import { isValidAs, knowledgeSchema, tentativeKnowledgeSchema } from '../model'

const searchModeState = useSearchModeStateStore()
const { setKeybinding } = useKeybindingStore()

const items = computed(() => searchModeState.knowledgeList ?? [])

watch(items, () => {
  console.debug(items)
  if (items.value.length > 0) {
    setKeybinding('ArrowDown', searchModeState.selectDown)
    setKeybinding('ArrowUp', searchModeState.selectUp)
  } else {
    setKeybinding('ArrowDown', () => {})
    setKeybinding('ArrowUp', () => {})
  }
})

onUnmounted(() => {
  setKeybinding('ArrowDown', () => {})
  setKeybinding('ArrowUp', () => {})
})

const createNewKnowledge = (title: string) => {
  console.debug(title)
}
</script>

<style lang="scss" scoped>
.SearchResult {
  width: calc(100% - 16px - 8px);
  height: 100%;
  padding: 0;
  margin: 4px 16px 4px 8px;
  overflow-y: auto;
}

.SearchResult__itemList {
  padding: 0;
  margin: 0;
}
</style>
