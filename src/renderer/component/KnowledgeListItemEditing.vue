<template>
  <li class="KnowledgeListItemEditing">
    <icon class="KnowledgeListItemEditing__icon" type="description" :size="17" />
    <input
      class="KnowledgeListItemEditing__input"
      @input="onInput"
      ref="inputRef"
      @keydown.enter="onSubmit"
    />
  </li>
</template>

<script setup lang="ts">
import Icon from '../container/Icon.vue'
import { Knowledge } from '../model'
import { KnowledgeId } from '@shared/type'
import { onMounted, ref } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)

const onInput = (e: Event) => {
  if (!(e.target instanceof HTMLInputElement)) {
    return
  }
  emits('input', e.target.value)
}

const onSubmit = (e: Event) => {
  if (!(e.target instanceof HTMLInputElement)) {
    return
  }

  const value = e.target.value
  if (value === '') {
    return
  }

  emits('submit', value)
}

const emits = defineEmits<{
  (event: 'click', itemId: KnowledgeId): void
  (event: 'input', value: string): void
  (event: 'submit', value: string): void
}>()

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<style lang="scss" scoped>
.KnowledgeListItemEditing {
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
  padding-left: 8px;
  color: var(--color-text-normal);
  list-style: none;
  background-color: #d7d7d7;
  border-radius: 4px;
}

.KnowledgeListItemEditing__icon {
  flex-shrink: 0;
}

.KnowledgeListItemEditing__input {
  box-sizing: border-box;
  width: 100%;
  height: 2.8em;
  padding: 0 0 0 4px;
  overflow: hidden;
  font-family: inherit;
  font-size: var(--font-size-text-searchResultItem);
  line-height: 2.8;
  white-space: nowrap;
  background: none;
  border: 2px solid #a4c5e9;
  border-radius: 4px;
  outline: none;
}
</style>
