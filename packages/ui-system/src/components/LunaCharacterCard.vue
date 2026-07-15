<script setup lang="ts">
defineProps<{
  name: string; theme: string; icon: string; elements: string[]
  active?: boolean; unlocked?: boolean; unlockHint?: string
}>()
defineEmits<{ select: [] }>()
</script>

<template>
  <div class="char-card" :class="{ active, locked: !unlocked }" @click="unlocked !== false && $emit('select')">
    <div class="char-card__visual">
      <span class="char-card__icon">{{ icon }}</span>
    </div>
    <div class="char-card__body">
      <div class="char-card__name">{{ unlocked !== false ? name : '???' }}</div>
      <div class="char-card__theme">{{ unlocked !== false ? theme : unlockHint }}</div>
      <div v-if="unlocked !== false" class="char-card__tags">
        <span v-for="e in elements" :key="e" class="char-card__tag">{{ e }}</span>
      </div>
    </div>
    <div v-if="active" class="char-card__badge">✦</div>
  </div>
</template>

<style scoped>
.char-card {
  display: flex; gap: 16px; padding: 16px; background: var(--luna-bg-card);
  border: 2px solid transparent; border-radius: var(--luna-radius-lg);
  cursor: pointer; transition: all var(--luna-transition-normal); position: relative; overflow: hidden;
}
.char-card.active { border-color: var(--luna-accent); box-shadow: var(--luna-shadow-glow); }
.char-card.locked { opacity: 0.5; cursor: not-allowed; }
.char-card:hover:not(.locked) { background: rgba(255,255,255,0.04); }
.char-card__visual { width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.04); border-radius: var(--luna-radius-md); }
.char-card__icon { font-size: 32px; }
.char-card__body { flex: 1; }
.char-card__name { font-size: var(--luna-font-size-lg); color: var(--luna-text-primary); font-weight: 600; }
.char-card__theme { font-size: var(--luna-font-size-sm); color: var(--luna-text-secondary); margin-top: 2px; }
.char-card__tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.char-card__tag { padding: 2px 8px; background: rgba(255,255,255,0.05); border-radius: 4px; font-size: var(--luna-font-size-xs); color: var(--luna-text-muted); }
.char-card__badge { position: absolute; top: 8px; right: 8px; color: var(--luna-accent); font-size: 16px; }
</style>
