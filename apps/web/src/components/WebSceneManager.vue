<script setup lang="ts">
import type { CharacterForm } from '@luna/shared-types'

defineProps<{ form: CharacterForm }>()

const scenes: Record<string, { bg: string; elements: Array<{ emoji: string; x: string; y: string }> }> = {
  graduation: {
    bg: 'linear-gradient(180deg, #87ceeb33, #1a3a5c66, #0f0f23)',
    elements: [{ emoji: '🪟', x: '80%', y: '15%' }, { emoji: '🪴', x: '10%', y: '70%' }, { emoji: '📚', x: '75%', y: '80%' }],
  },
  live: {
    bg: 'linear-gradient(180deg, #2a1a3a, #4a1a3a, #0f0f23)',
    elements: [{ emoji: '🎤', x: '20%', y: '20%' }, { emoji: '💡', x: '75%', y: '12%' }, { emoji: '🖥️', x: '15%', y: '75%' }],
  },
  CEO: {
    bg: 'linear-gradient(180deg, #1a1a3a, #1a2a4a, #0f0f23)',
    elements: [{ emoji: '🌃', x: '75%', y: '10%' }, { emoji: '📊', x: '20%', y: '80%' }, { emoji: '🏆', x: '70%', y: '75%' }],
  },
}
</script>

<template>
  <div class="scene" :style="{ background: scenes[form]?.bg }">
    <div
      v-for="(el, i) in scenes[form]?.elements || []" :key="i"
      class="element" :style="{ left: el.x, top: el.y }"
    >{{ el.emoji }}</div>
    <div class="label">{{ { graduation: '🏫 校园', live: '🎬 直播间', CEO: '🏢 办公室' }[form] }}</div>
  </div>
</template>

<style scoped>
.scene { position: absolute; inset: 0; overflow: hidden; transition: background 0.5s; }
.element { position: absolute; font-size: 36px; opacity: 0.4; }
.label { position: absolute; bottom: 8px; left: 8px; font-size: 11px; color: #6a6a7e; background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 4px; }
</style>
