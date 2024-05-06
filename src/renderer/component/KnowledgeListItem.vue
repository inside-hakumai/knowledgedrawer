<template>
  <li
    class="SearchResultItem"
    :class="{ '-selected': selected }"
    @click="() => emits('click', item.id)"
  >
    <icon class="SearchResultItem__icon" type="description" :size="17" />
    <span class="SearchResultItem__label">{{ item.title }}</span>
  </li>
</template>

<script setup lang="ts">
import Icon from '@/container/Icon.vue'
import { Knowledge } from '@/model'
import { KnowledgeId } from '@shared/type'

const _props = defineProps<{
  item: Knowledge
  selected: boolean
}>()

const emits = defineEmits<{
  (event: 'click', itemId: KnowledgeId): void
}>()
</script>

<style lang="scss" scoped>
.SearchResultItem {
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
  padding-left: 8px;
  color: var(--color-text-normal);
  list-style: none;
  border-radius: 4px;

  &:hover {
    cursor: pointer;
    background: var(--color-focus);
  }
}

.SearchResultItem.-selected {
  background: var(--color-active);
}

.SearchResultItem__icon {
  flex-shrink: 0;
}

.SearchResultItem__label {
  overflow: hidden;
  font-size: var(--font-size-text-searchResultItem);
  line-height: 2.8;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
