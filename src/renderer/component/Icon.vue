<template>
  <div class="Icon">
    <search class="Icon__vector" v-if="type === 'search'" :size="size" />
    <description class="Icon__vector" v-if="type === 'description'" :size="size" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, watchEffect } from 'vue'

import Search from './IconVector/Search.vue'
import Description from './IconVector/Description.vue'

type IconType = 'search' | 'description'

const props = defineProps({
  type: {
    type: String as () => IconType,
    required: true,
  },
  size: {
    type: Number,
    default: 24,
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
}
</style>
