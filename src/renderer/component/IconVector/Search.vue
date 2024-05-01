<!-- https://fonts.google.com/icons?selected=Material%20Symbols%20Outlined%3Asearch%3AFILL%400%3Bwght%40400%3BGRAD%400%3Bopsz%4024 -->

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" :width="size" :height="size">
    <path
      d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
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
