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
    </svg>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

import * as constants from '../../constants'

export type IconType = 'search' | 'description' | 'moreHorizontal'

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
    default: constants.color.text.sub2,
  },
})
</script>

<style lang="scss">
.Icon {
  display: block;
  width: v-bind('size + "px"');
  height: v-bind('size + "px"');
  position: relative;
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
