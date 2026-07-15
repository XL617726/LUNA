<script setup lang="ts">
defineProps<{ variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'; dot?: boolean }>()
</script>

<template>
  <span class="luna-badge" :class="[`luna-badge--${variant || 'default'}`, { 'luna-badge--dot': dot }]">
    <slot />
  </span>
</template>

<style scoped>
.luna-badge {
  display: inline-flex; align-items: center; padding: 2px 10px;
  border-radius: var(--luna-radius-full); font-size: var(--luna-font-size-xs);
  font-weight: 500; white-space: nowrap;
}
.luna-badge--default { background: rgba(255,255,255,0.08); color: var(--luna-text-secondary); }
.luna-badge--success { background: rgba(126,203,118,0.12); color: var(--luna-success); }
.luna-badge--warning { background: rgba(240,192,96,0.12); color: var(--luna-warning); }
.luna-badge--danger { background: rgba(224,96,96,0.12); color: var(--luna-error); }
.luna-badge--info { background: rgba(135,206,235,0.12); color: var(--luna-star-secondary); }
.luna-badge--dot { padding: 0; width: 8px; height: 8px; border-radius: 50%; }
</style>
