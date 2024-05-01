<template>
  <div class="Icon">
    <component :is="vectorComponent" class="Icon__vector" :size="size" :css-fill="color" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

import Search from './IconVector/Search.vue'
import Description from './IconVector/Description.vue'
import MoreHorizontal from './IconVector/MoreHorizontal.vue'
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

const vectorComponent = computed(() => {
  switch (props.type) {
    case 'search':
      return Search
    case 'description':
      return Description
    case 'moreHorizontal':
      return MoreHorizontal
  }
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
}
</style>
