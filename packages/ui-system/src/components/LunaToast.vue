<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ message: string; type?: 'info' | 'success' | 'warning' | 'error'; duration?: number }>()
const emit = defineEmits<{ close: [] }>()
const visible = ref(false)

watch(() => props.message, (val) => {
  if (val) { visible.value = true; setTimeout(() => { visible.value = false; emit('close') }, props.duration || 2500) }
}, { immediate: true })
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="luna-toast" :class="[`luna-toast--${type || 'info'}`]">
      <span>{{ message }}</span>
    </div>
  </Teleport>
</template>

<style scoped>
.luna-toast {
  position: fixed; top: 24px; left: 50%; transform: translateX(-50%); z-index: var(--luna-z-toast);
  padding: 12px 24px; border-radius: var(--luna-radius-lg); font-size: var(--luna-font-size-md);
  box-shadow: var(--luna-shadow-lg); animation: lunaSlideDown 0.3s ease;
  max-width: 80vw; text-align: center;
}
.luna-toast--info { background: var(--luna-bg-card); color: var(--luna-text-primary); border: 1px solid var(--luna-border-color); }
.luna-toast--success { background: rgba(126,203,118,0.15); color: var(--luna-success); border: 1px solid rgba(126,203,118,0.3); }
.luna-toast--warning { background: rgba(240,192,96,0.15); color: var(--luna-warning); border: 1px solid rgba(240,192,96,0.3); }
.luna-toast--error { background: rgba(224,96,96,0.15); color: var(--luna-error); border: 1px solid rgba(224,96,96,0.3); }
@keyframes lunaSlideDown { from { opacity: 0; transform: translateX(-50%) translateY(-16px); } }
</style>
