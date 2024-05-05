<template>
  <div class="RootFrame">
    <search-bar-frame class="RootFrame__SearchBarFrame" />
    <main-contents-frame class="RootFrame__MainContentsFrame" />
  </div>
</template>

<script setup lang="ts">
import SearchBarFrame from './SearchBarFrame.vue'
import MainContentsFrame from './MainContentsFrame.vue'
import { useKeybindingStore } from '../composable/useStore'
import { onMounted, onUnmounted } from 'vue'

const { keybindings } = useKeybindingStore()

const handleKey = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowDown':
      keybindings.ArrowDown()
      break
    case 'ArrowUp':
      keybindings.ArrowUp()
      break
    default:
      // do nothing
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKey)
})
</script>

<style lang="scss" scoped>
.RootFrame {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
