<template>
  <button class="IconButton" @click="() => emits('click')">
    <icon class="IconButton__icon" :type="type" :size="iconSize" :color="color" />
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import Icon, { IconType } from './Icon.vue'

const props = defineProps({
  type: {
    type: String as () => IconType,
    required: true,
  },
  buttonSize: {
    type: Number,
    required: false,
    default: 28,
  },
  iconSize: {
    type: Number as () => number | undefined,
    required: false,
  },
  color: {
    type: String as () => string | undefined,
    required: false,
  },
})

const emits = defineEmits<{ (event: 'click'): void }>()
</script>

<style lang="scss" scoped>
.IconButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: v-bind('buttonSize + "px"');
  height: v-bind('buttonSize + "px"');
  padding: 0;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 4px;

  &:hover {
    background: var(--color-active);
  }
}
</style>
