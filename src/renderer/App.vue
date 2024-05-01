<template>
  <root-frame />
</template>

<script setup lang="ts">
import RootFrame from './component/RootFrame.vue'
</script>

<style lang="scss">
@import './variables.css';

#root {
  overflow: hidden;
  outline: none;
  width: 100%;
  height: 100%;
}

body {
  width: var(--window-width-normal);
  height: var(--window-height-normal);
  margin: 0;
}
</style>
