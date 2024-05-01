<template>
  <div class="SearchResult">
    <ul class="SearchResult__itemList">
      <li class="SearchResult__item" v-for="item in items" :key="item">
        <icon class="SearchResult__itemIcon" type="description" :size="17" />
        <span class="SearchResult__itemLabel">{{ item }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Icon from './Icon.vue'

const items = ref<string[]>([
  'kotlinのテストの書き方',
  'kotlinの関数をテスト実行する方法',
  '結果2',
  'タイトルがめっちゃ長いアイテムタイトルがめっちゃ長いアイテムタイトルがめっちゃ長いアイテム',
  'テスト3',
  'Test',
  'Hoge',
])
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
    background: var(--color-active);
  }
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
