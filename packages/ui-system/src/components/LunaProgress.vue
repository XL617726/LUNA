<script setup lang="ts">
defineProps<{ percent: number; color?: string; height?: number; showLabel?: boolean }>()
</script>

<template>
  <div class="luna-progress">
    <div class="luna-progress__track">
      <div class="luna-progress__fill" :style="{ width: Math.min(100, Math.max(0, percent)) + '%', background: color || 'var(--luna-accent)', height: (height || 6) + 'px' }" />
    </div>
    <span v-if="showLabel" class="luna-progress__label">{{ Math.round(percent) }}%</span>
  </div>
</template>

<style scoped>
.luna-progress { display: flex; align-items: center; gap: 8px; width: 100%; }
.luna-progress__track { flex: 1; background: rgba(255,255,255,0.08); border-radius: var(--luna-radius-full); overflow: hidden; }
.luna-progress__fill { border-radius: var(--luna-radius-full); transition: width 0.3s ease; min-width: 2px; }
.luna-progress__label { font-size: var(--luna-font-size-xs); color: var(--luna-text-muted); min-width: 36px; text-align: right; }
</style>
