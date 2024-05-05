import { defineStore } from 'pinia'
import { Knowledge } from '../model'
import { computed, ref } from 'vue'
import { KnowledgeId } from '@shared/type'

export const useSearchStateStore = defineStore('searchState', () => {
  const searchResult = ref<Knowledge[] | null>(null)
  const selectedKnowledgeId = ref<KnowledgeId | null>(null)

  const selectedKnowledge = computed(() => {
    if (searchResult.value === null || selectedKnowledgeId.value === null) {
      return null
    }
    return searchResult.value.find((k) => k.id === selectedKnowledgeId.value)
  })

  const setSearchResult = (result: Knowledge[]) => {
    if (result.length > 0) {
      searchResult.value = [...result]
      selectedKnowledgeId.value = result[0].id
    } else {
      searchResult.value = []
      selectedKnowledgeId.value = null
    }
  }

  const clearSearchResult = () => {
    searchResult.value = null
    selectedKnowledgeId.value = null
  }

  const select = (id: KnowledgeId) => {
    if (searchResult.value?.find((k) => k.id === id)) {
      selectedKnowledgeId.value = id
    }
  }

  const selectDown = () => {
    const index = searchResult.value?.findIndex((k) => k.id === selectedKnowledgeId.value)
    if (index !== undefined && index !== -1 && index !== searchResult.value!.length - 1) {
      selectedKnowledgeId.value = searchResult.value![index + 1].id
    }
  }

  const selectUp = () => {
    const index = searchResult.value?.findIndex((k) => k.id === selectedKnowledgeId.value)
    if (index !== undefined && index !== -1 && index !== 0) {
      selectedKnowledgeId.value = searchResult.value![index - 1].id
    }
  }

  return {
    searchResult,
    selectedKnowledgeId,
    selectedKnowledge,
    setSearchResult,
    clearSearchResult,
    select,
    selectDown,
    selectUp,
  }
})

type KNOWN_KEYS = 'ArrowDown' | 'ArrowUp'

export const useKeybindingStore = defineStore('keybinding', () => {
  const keybindings = ref<Record<KNOWN_KEYS, () => void>>({
    ArrowDown: () => {},
    ArrowUp: () => {},
  })

  const setKeybinding = (key: KNOWN_KEYS, callback: () => void) => {
    keybindings.value[key] = callback
  }

  return { keybindings, setKeybinding }
})
