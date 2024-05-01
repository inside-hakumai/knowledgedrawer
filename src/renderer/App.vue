<template>
  <root-frame />
</template>

<script setup lang="ts">
import RootFrame from './component/RootFrame.vue'
</script>

<style lang="scss">
@import url('./variables.css');

#root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: none;
}

body {
  width: var(--window-width-normal);
  height: var(--window-height-normal);
  margin: 0;
}
</style>
