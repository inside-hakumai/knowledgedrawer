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
  overflow-y: auto;
  margin: 4px 16px 4px 8px;
  padding: 0;
}

.SearchResult__itemList {
  margin: 0;
  padding: 0;
}

.SearchResult__item {
  list-style: none;
  color: var(--color-text-normal);
  padding: 8px;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;

  &:hover {
    cursor: pointer;
    background: var(--color-active);
  }
}

.SearchResult__itemIcon {
  flex-shrink: 0;
}

.SearchResult__itemLabel {
  font-size: var(--font-size-text-searchResultItem);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
