<!-- https://fonts.google.com/icons?selected=Material%20Symbols%20Outlined%3Adescription%3AFILL%400%3Bwght%40400%3BGRAD%400%3Bopsz%4024 -->

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" :width="size" :height="size">
    <path
      d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"
    />
  </svg>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  size: {
    type: Number,
    default: 24,
  },
})
</script>

<style lang="scss" scoped>
svg {
  width: var(--size);
  height: var(--size);
  fill: var(--color-text-sub-l2);
}
</style>
