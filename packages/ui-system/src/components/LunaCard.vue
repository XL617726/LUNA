<script setup lang="ts">
defineProps<{ padding?: boolean; hover?: boolean; border?: boolean }>()
</script>

<template>
  <div class="luna-card" :class="{ 'luna-card--hover': hover, 'luna-card--borderless': !border }">
    <slot />
  </div>
</template>

<style scoped>
.luna-card {
  background: var(--luna-bg-card); border-radius: var(--luna-radius-lg);
  border: var(--luna-border-width) solid var(--luna-border-color);
  padding: var(--luna-card-padding); transition: all var(--luna-transition-fast);
}
.luna-card--borderless { border: none; }
.luna-card--hover:hover {
  transform: translateY(-2px); box-shadow: var(--luna-shadow-md);
  border-color: rgba(232,184,109,0.15);
}
</style>
