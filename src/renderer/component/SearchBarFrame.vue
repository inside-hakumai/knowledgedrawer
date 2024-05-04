<template>
  <div class="SearchBarFrame">
    <div class="SearchBarFrame__SearchBar">
      <icon class="SearchBarFrame__SearchBarInputIcon" type="search" :size="20" />
      <input class="SearchBarFrame__SearchBarInput" type="text" @input="onInputSearch" />
      <div class="SearchBarFrame__MatchCount">23 件</div>
    </div>
    <div class="SearchBarFrame__Actions">
      <icon-button type="add" :buttonSize="28" :iconSize="20" :color="constants.color.text.sub1" />
      <icon-button
        type="settings"
        :buttonSize="28"
        :iconSize="20"
        :color="constants.color.text.sub1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from './Icon.vue'
import IconButton from './IconButton.vue'
import * as constants from '../../constants'
import { useIpcApi } from '../composable/useIpcApi'

const { search } = useIpcApi()

const onInputSearch = async (e: Event) => {
  if (!(e.target instanceof HTMLInputElement)) {
    return
  }

  console.debug(await search(e.target.value))
}
</script>

<style lang="scss" scoped>
.SearchBarFrame {
  position: relative;
  -webkit-app-region: drag;
  width: calc(100% - 280px);
  height: calc(60px - 16px);
  padding: 8px 140px;
}

.SearchBarFrame__SearchBar {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgb(255 255 255 / 30%);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  -webkit-app-region: no-drag;
}

.SearchBarFrame__SearchBarInputIcon {
  position: absolute;
  left: 12px;
}

.SearchBarFrame__SearchBarInput {
  width: 100%;
  height: 100%;
  padding: 0 40px;
  font-size: var(--font-size-text-normal);
  color: var(--color-text-normal);
  background: none;
  border: none;
  outline: none;
}

.SearchBarFrame__MatchCount {
  position: absolute;
  right: 12px;
  font-size: 12px;
  color: var(--color-text-sub-l2);
}

.SearchBarFrame__Actions {
  position: absolute;
  top: 50%;
  right: 12px;
  display: flex;
  align-items: center;
  transform: translateY(-50%);
  -webkit-app-region: no-drag;
}
</style>
