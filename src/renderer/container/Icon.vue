<template>
  <div class="Icon">
    <svg
      class="Icon__vector"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      :width="size"
      :height="size"
    >
      <path
        v-if="type === 'description'"
        d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"
      />
      <path
        v-if="type === 'moreHorizontal'"
        d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"
      />
      <path
        v-if="type === 'search'"
        d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
      />
      <!-- prettier-ignore -->
      <path
        v-if="type === 'add'"
        d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
      />
      <path
        v-if="type === 'settings'"
        d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { color } from '@shared/constants'

export type IconType = 'search' | 'description' | 'moreHorizontal' | 'add' | 'settings'

const props = defineProps({
  type: {
    type: String as () => IconType,
    required: true,
  },
  size: {
    type: Number,
    required: false,
    default: 24,
  },
  color: {
    type: String,
    required: false,
    default: color.text.sub2,
  },
})
</script>

<style lang="scss">
.Icon {
  position: relative;
  display: block;
  width: v-bind('size + "px"');
  height: v-bind('size + "px"');
}

.Icon__vector {
  position: absolute;
  top: 0;
  left: 0;
  width: v-bind('size + "px"');
  height: v-bind('size + "px"');
  fill: v-bind('color');
}
</style>
