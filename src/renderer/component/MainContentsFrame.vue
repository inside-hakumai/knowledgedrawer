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
  width: 100%;
  display: flex;
  flex: 1;
}

.MainContentsFrame__SearchResult {
  width: 300px;
  height: 100%;
}

.MainContentsFrame__Detail {
  flex: 1;
  height: 100%;
  position: relative;

  &::before {
    content: '';
    display: block;
    width: 1px;
    height: 500px;
    background: var(--color-border);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
<script setup lang="ts">
import SearchResult from './SearchResult.vue'
import Detail from './Detail.vue'
</script>
