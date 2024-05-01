<template>
  <div class="RootFrame">
    <search-bar-frame class="RootFrame__SearchBarFrame" />
    <main-contents-frame class="RootFrame__MainContentsFrame" />
  </div>
</template>

<script setup lang="ts">
import SearchBarFrame from './SearchBarFrame.vue'
import MainContentsFrame from './MainContentsFrame.vue'
</script>

<style lang="scss" scoped>
.RootFrame {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
