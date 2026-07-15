<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  pixel?: boolean
}>()
defineEmits<{ click: [e: MouseEvent] }>()
</script>

<template>
  <button
    class="luna-btn"
    :class="[`luna-btn--${variant || 'primary'}`, `luna-btn--${size || 'md'}`, { 'luna-btn--block': block, 'luna-btn--pixel': pixel, 'luna-btn--loading': loading }]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="luna-btn__spinner">✦</span>
    <slot />
  </button>
</template>

<style scoped>
.luna-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: var(--luna-btn-height); padding: var(--luna-btn-padding);
  border: var(--luna-border-width) solid transparent; border-radius: var(--luna-btn-radius);
  font-family: var(--luna-font-body); font-size: var(--luna-font-size-md);
  cursor: pointer; transition: all var(--luna-transition-fast);
  outline: none; user-select: none; white-space: nowrap;
}
.luna-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.luna-btn--block { width: 100%; }

/* Variants */
.luna-btn--primary {
  background: linear-gradient(135deg, var(--luna-accent), var(--luna-accent-dark));
  color: var(--luna-bg-primary); border-color: transparent;
}
.luna-btn--primary:hover:not(:disabled) { box-shadow: var(--luna-shadow-glow); transform: translateY(-1px); }

.luna-btn--secondary {
  background: rgba(255,255,255,0.06); color: var(--luna-text-primary);
  border-color: var(--luna-border-color);
}
.luna-btn--secondary:hover:not(:disabled) { background: rgba(255,255,255,0.1); border-color: var(--luna-accent); }

.luna-btn--ghost {
  background: transparent; color: var(--luna-text-secondary);
}
.luna-btn--ghost:hover:not(:disabled) { color: var(--luna-accent); background: rgba(232,184,109,0.08); }

.luna-btn--danger {
  background: rgba(224,96,96,0.15); color: var(--luna-error);
  border-color: rgba(224,96,96,0.3);
}
.luna-btn--danger:hover:not(:disabled) { background: rgba(224,96,96,0.25); }

/* Sizes */
.luna-btn--sm { --luna-btn-height: 30px; font-size: var(--luna-font-size-sm); padding: 0 12px; }
.luna-btn--lg { --luna-btn-height: 50px; font-size: var(--luna-font-size-lg); padding: 0 28px; }

/* Pixel mode */
.luna-btn--pixel {
  border-radius: 0; border-width: 2px;
  font-family: var(--luna-font-pixel); letter-spacing: 1px; text-shadow: 2px 2px 0 rgba(0,0,0,0.2);
}
.luna-btn--pixel:active:not(:disabled) { transform: translate(2px, 2px); }

/* Loading */
.luna-btn__spinner { display: inline-block; animation: lunaSpin 0.8s linear infinite; }
@keyframes lunaSpin { to { transform: rotate(360deg); } }
</style>
