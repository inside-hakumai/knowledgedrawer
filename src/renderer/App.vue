<template>
  <div id="app">
    <p>hoge</p>
    <p>count: {{ count }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<style lang="scss"></style>
