<template>
  <div class="SearchResult">
    <ul class="SearchResult__itemList">
      <li
        class="SearchResult__item"
        :class="{ '-selected': searchStore.selectedKnowledgeId === item.id }"
        v-for="item in items"
        :key="item.id"
      >
        <icon class="SearchResult__itemIcon" type="description" :size="17" />
        <span class="SearchResult__itemLabel">{{ item.title }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import Icon from './Icon.vue'
import { useStore } from '../composable/useStore'
import { useKeybindingStore } from '../composable/useStore'

const searchStore = useStore()
const { setKeybinding } = useKeybindingStore()

const items = computed(() => searchStore.searchResult ?? [])

watch(items, () => {
  if (items.value.length > 0) {
    setKeybinding('ArrowDown', searchStore.selectDown)
    setKeybinding('ArrowUp', searchStore.selectUp)
  } else {
    setKeybinding('ArrowDown', () => {})
    setKeybinding('ArrowUp', () => {})
  }
})

onUnmounted(() => {
  setKeybinding('ArrowDown', () => {})
  setKeybinding('ArrowUp', () => {})
})
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

.SearchResult__item {
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
  padding: 8px;
  color: var(--color-text-normal);
  list-style: none;
  border-radius: 4px;

  &:hover {
    cursor: pointer;
    background: var(--color-focus);
  }
}

.SearchResult__item.-selected {
  background: var(--color-active);
}

.SearchResult__itemIcon {
  flex-shrink: 0;
}

.SearchResult__itemLabel {
  overflow: hidden;
  font-size: var(--font-size-text-searchResultItem);
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
