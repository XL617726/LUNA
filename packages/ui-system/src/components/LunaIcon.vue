<script setup lang="ts">
/**
 * LunaIcon — 图标组件
 * 内置 LUNA 专属图标集，支持自定义 SVG
 */
defineProps<{ name: IconName; size?: number; color?: string }>()

export type IconName = 'star' | 'music' | 'mic' | 'heart' | 'play' | 'pause'
  | 'next' | 'prev' | 'settings' | 'upload' | 'character' | 'memory'
  | 'close' | 'check' | 'arrow-right' | 'home'

const icons: Record<string, string> = {
  star:   'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  music:  'M9 18V5l12-2v13',  // simplified
  mic:    'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z',
  heart:  'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  play:   'M8 5v14l11-7z',
  pause:  'M6 19h4V5H6v14zm8-14v14h4V5h-4z',
  close:  'M18 6L6 18M6 6l12 12',
}
</script>

<template>
  <svg
    class="luna-icon" :width="size || 24" :height="size || 24"
    viewBox="0 0 24 24" :fill="color || 'currentColor'"
    v-html="icons[name] ? `<path d='${icons[name]}'/>` : ''"
  />
</template>

<style scoped>
.luna-icon { display: inline-block; vertical-align: middle; flex-shrink: 0; }
</style>
