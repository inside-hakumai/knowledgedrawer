<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" :width="size" :height="size">
    <path
      d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"
    />
  </svg>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { color } from '../../../constants'

const props = defineProps({
  size: {
    type: Number,
    default: 24,
  },
  cssFill: {
    type: String,
    default: color.text.sub2,
  },
})
</script>

<style lang="scss" scoped>
svg {
  width: var(--size);
  height: var(--size);
  fill: v-bind('cssFill');
}
</style>
