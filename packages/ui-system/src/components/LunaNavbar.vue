<script setup lang="ts">
defineProps<{ title?: string; transparent?: boolean }>()
</script>

<template>
  <nav class="luna-navbar" :class="{ 'luna-navbar--transparent': transparent }">
    <div class="luna-navbar__left"><slot name="left" /></div>
    <div class="luna-navbar__center">
      <slot name="center">
        <span v-if="title" class="luna-navbar__title">{{ title }}</span>
      </slot>
    </div>
    <div class="luna-navbar__right"><slot name="right" /></div>
  </nav>
</template>

<style scoped>
.luna-navbar {
  display: flex; align-items: center; justify-content: space-between;
  height: 48px; padding: 0 16px; background: var(--luna-bg-secondary);
  border-bottom: 1px solid var(--luna-border-color); z-index: var(--luna-z-sticky);
}
.luna-navbar--transparent { background: transparent; border-bottom: none; }
.luna-navbar__left, .luna-navbar__right { flex: 1; display: flex; align-items: center; }
.luna-navbar__right { justify-content: flex-end; }
.luna-navbar__center { display: flex; align-items: center; }
.luna-navbar__title { font-size: var(--luna-font-size-lg); color: var(--luna-accent); font-family: var(--luna-font-pixel); }
</style>
