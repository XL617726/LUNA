<script setup lang="ts">
defineProps<{ visible: boolean; title?: string; width?: string }>()
defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="luna-dialog-overlay" @click.self="$emit('close')">
      <div class="luna-dialog" :style="{ maxWidth: width || 'var(--luna-dialog-width)' }">
        <div v-if="title || $slots.header" class="luna-dialog__header">
          <h3 v-if="title">{{ title }}</h3>
          <slot name="header" />
          <button class="luna-dialog__close" @click="$emit('close')">✕</button>
        </div>
        <div class="luna-dialog__body"><slot /></div>
        <div v-if="$slots.footer" class="luna-dialog__footer"><slot name="footer" /></div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.luna-dialog-overlay {
  position: fixed; inset: 0; z-index: var(--luna-z-modal);
  display: flex; align-items: center; justify-content: center;
  background: var(--luna-bg-overlay); animation: lunaFadeIn 0.2s ease;
}
.luna-dialog {
  background: var(--luna-bg-secondary); border: 1px solid var(--luna-border-color);
  border-radius: var(--luna-radius-xl); width: 90%;
  box-shadow: var(--luna-shadow-lg); animation: lunaSlideUp 0.25s ease;
}
.luna-dialog__header {
  display: flex; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--luna-border-color);
}
.luna-dialog__header h3 { flex: 1; margin: 0; font-size: var(--luna-font-size-lg); color: var(--luna-accent); }
.luna-dialog__close { background: none; border: none; color: var(--luna-text-muted); cursor: pointer; font-size: 18px; }
.luna-dialog__close:hover { color: var(--luna-text-primary); }
.luna-dialog__body { padding: 20px; }
.luna-dialog__footer { padding: 12px 20px; border-top: 1px solid var(--luna-border-color); display: flex; justify-content: flex-end; gap: 8px; }
@keyframes lunaFadeIn { from { opacity: 0; } }
@keyframes lunaSlideUp { from { opacity: 0; transform: translateY(16px); } }
</style>
