<template>
  <div class="MainContentsFrame">
    <div class="MainContentsFrame__KnowledgeList">
      <knowledge-list />
    </div>
    <div class="MainContentsFrame__Border" />
    <div class="MainContentsFrame__Detail">
      <detail />
    </div>
  </div>
</template>

<script setup lang="ts">
import Detail from '@/container/Detail.vue'
import KnowledgeList from '@/container/KnowledgeList.vue'
</script>

<style lang="scss" scoped>
.MainContentsFrame {
  position: relative;
  display: flex;
  flex: 1;
  width: 100%;
  overflow: hidden;
}

.MainContentsFrame__KnowledgeList {
  width: 300px;
  height: 100%;
}

.MainContentsFrame__Border {
  top: 50%;
  display: block;
  height: calc(100% - 40px);
  border-left: 1px solid var(--color-border);
  transform: translateY(20px);
}

.MainContentsFrame__Detail {
  position: relative;
  flex: 1;
  height: 100%;
  overflow: scroll;
}
</style>
