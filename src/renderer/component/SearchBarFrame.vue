<template>
  <div class="SearchBarFrame">
    <div class="SearchBarFrame__SearchBar">
      <icon class="SearchBarFrame__SearchBarInputIcon" type="search" :size="20" />
      <input class="SearchBarFrame__SearchBarInput" type="text" />
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
  -webkit-app-region: no-drag;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.3);
}

.SearchBarFrame__SearchBarInputIcon {
  position: absolute;
  left: 12px;
}

.SearchBarFrame__SearchBarInput {
  width: 100%;
  height: 100%;
  color: var(--color-text-normal);
  font-size: var(--font-size-text-normal);
  padding: 0 40px;
  background: none;
  border: none;
  outline: none;
}

.SearchBarFrame__MatchCount {
  position: absolute;
  font-size: 12px;
  color: var(--color-text-sub-l2);
  right: 12px;
}

.SearchBarFrame__Actions {
  -webkit-app-region: no-drag;
  position: absolute;
  display: flex;
  align-items: center;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
