<template>
  <div class="MainContentsFrame">
    <div class="MainContentsFrame__SearchResult">
      <search-result />
    </div>
    <div class="MainContentsFrame__Detail">
      <detail />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.MainContentsFrame {
  display: flex;
  flex: 1;
  width: 100%;
}

.MainContentsFrame__SearchResult {
  width: 300px;
  height: 100%;
}

.MainContentsFrame__Detail {
  position: relative;
  flex: 1;
  height: 100%;

  &::before {
    position: absolute;
    top: 50%;
    display: block;
    width: 1px;
    height: 500px;
    content: '';
    background: var(--color-border);
    transform: translateY(-50%);
  }
}
</style>
<script setup lang="ts">
import SearchResult from './SearchResult.vue'
import Detail from './Detail.vue'
</script>
