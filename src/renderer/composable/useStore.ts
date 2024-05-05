import { defineStore } from 'pinia'
import { isValidAs, Knowledge, TentativeKnowledge, tentativeKnowledgeSchema } from '../model'
import { computed, ref } from 'vue'
import { DateTimeString, KnowledgeId, TENTATIVE_KNOWLEDGE_ID } from '@shared/type'

export const useSearchModeStateStore = defineStore('searchModeState', () => {
  const knowledgeList = ref<(Knowledge | TentativeKnowledge)[] | null>(null)
  const selectedKnowledgeId = ref<KnowledgeId | null>(null)

  const selectedKnowledge = computed(() => {
    if (knowledgeList.value === null || selectedKnowledgeId.value === null) {
      return null
    }
    return knowledgeList.value.find((k) => k.id === selectedKnowledgeId.value)
  })

  const setSearchResult = (result: Knowledge[]) => {
    if (result.length > 0) {
      knowledgeList.value = [...result]
      selectedKnowledgeId.value = result[0].id
    } else {
      knowledgeList.value = []
      selectedKnowledgeId.value = null
    }
  }

  const removeKnowledge = (id: KnowledgeId) => {
    if (knowledgeList.value === null) {
      return
    }

    const index = knowledgeList.value.findIndex((k) => k.id === id)
    if (index !== -1) {
      knowledgeList.value.splice(index, 1)
    }
  }

  const clearSearchResult = () => {
    knowledgeList.value = null
    selectedKnowledgeId.value = null
  }

  const select = (id: KnowledgeId) => {
    if (knowledgeList.value === null) {
      return
    }

    if (knowledgeList.value.find((k) => k.id === id)) {
      // 選択されていたナレッジがTentativeKnowledgeだった場合、削除する
      if (isValidAs(tentativeKnowledgeSchema, selectedKnowledge.value)) {
        removeKnowledge(selectedKnowledge.value.id)
      }

      selectedKnowledgeId.value = id
    }
  }

  const selectDown = () => {
    const index = knowledgeList.value?.findIndex((k) => k.id === selectedKnowledgeId.value)
    if (index !== undefined && index !== -1 && index !== knowledgeList.value!.length - 1) {
      selectedKnowledgeId.value = knowledgeList.value![index + 1].id
    }
  }

  const selectUp = () => {
    if (knowledgeList.value === null) {
      return
    }

    const index = knowledgeList.value.findIndex((k) => k.id === selectedKnowledgeId.value)
    if (index !== -1 && index !== 0) {
      selectedKnowledgeId.value = knowledgeList.value![index - 1].id

      // 選択されていたナレッジがTentativeKnowledgeだった場合、削除する
      if (isValidAs(tentativeKnowledgeSchema, knowledgeList.value[index])) {
        knowledgeList.value.splice(index, 1)
      }
    }
  }

  const startKnowledgeTitleEdit = () => {
    const newKnowledgeList = knowledgeList.value ?? []

    if (newKnowledgeList.some((k) => k.id === TENTATIVE_KNOWLEDGE_ID)) {
      return
    }

    newKnowledgeList.push({ isTentative: true, id: TENTATIVE_KNOWLEDGE_ID, title: '' })
    knowledgeList.value = newKnowledgeList

    selectedKnowledgeId.value = TENTATIVE_KNOWLEDGE_ID
  }

  const setEditingKnowledgeTitle = (title: string) => {
    const tentativeKnowledgeIndex = knowledgeList.value?.findIndex(
      (k) => k.id === TENTATIVE_KNOWLEDGE_ID,
    )
    if (tentativeKnowledgeIndex === undefined || tentativeKnowledgeIndex === -1) {
      console.warn('Tentative knowledge not found')
      return
    }

    knowledgeList.value![tentativeKnowledgeIndex].title = title
  }

  const confirmTentativeKnowledge = (
    assignedId: KnowledgeId,
    confirmedDateTime: DateTimeString,
  ) => {
    if (knowledgeList.value === null) {
      return
    }

    const tentativeKnowledgeIndex = knowledgeList.value.findIndex((knowledge) =>
      isValidAs(tentativeKnowledgeSchema, knowledge),
    )

    if (tentativeKnowledgeIndex === -1) {
      console.warn('Tentative knowledge not found')
      return
    }

    knowledgeList.value[tentativeKnowledgeIndex] = {
      ...knowledgeList.value![tentativeKnowledgeIndex],
      isTentative: false,
      id: assignedId,
      contents: '',
      createdAt: confirmedDateTime,
      updatedAt: confirmedDateTime,
    }
    selectedKnowledgeId.value = assignedId
  }

  return {
    knowledgeList: knowledgeList,
    selectedKnowledgeId,
    selectedKnowledge,
    setSearchResult,
    clearSearchResult,
    select,
    selectDown,
    selectUp,
    startKnowledgeTitleEdit,
    setEditingKnowledgeTitle,
    confirmTentativeKnowledge,
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
