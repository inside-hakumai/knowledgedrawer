import { defineStore } from 'pinia'
import { Knowledge } from '../model'
import { ref } from 'vue'

export const useSearchStore = defineStore('store', () => {
  const result = ref<Knowledge[] | null>(null)

  const setResult = (searchResult: Knowledge[]) => {
    result.value = [...searchResult]
  }
  return { result, setResult }
})
