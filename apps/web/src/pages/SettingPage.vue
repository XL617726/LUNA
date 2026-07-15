<script setup lang="ts">
import { getStorySystem } from '@luna/story-engine'
const story = getStorySystem()
</script>

<template>
  <div class="page">
    <h2>⚙️ 设置</h2>

    <div class="group">
      <h3>关于</h3>
      <div class="row"><span>版本</span><span>V1.0.0</span></div>
      <div class="row clickable" @click="() => alert('LUNA · 星光歌姬\n\n致我最好的朋友——\n愿LUNA的歌声，陪你度过每一个重要的日子。')">
        <span>制作人</span><span>查看 →</span>
      </div>
    </div>

    <div class="group">
      <h3>彩蛋</h3>
      <div v-for="s in story.getUnlockedStories()" :key="s.id" class="egg">
        {{ s.icon }} {{ s.name }}
      </div>
      <div v-if="story.getUnlockedStories().length === 0" class="empty">还没有发现彩蛋...</div>
    </div>

    <div class="group">
      <h3>跨平台验证</h3>
      <div class="check">
        <span>✅ @luna/character-engine</span>
        <span>✅ @luna/animation-engine</span>
        <span>✅ @luna/audio-engine</span>
        <span>✅ @luna/ai-engine</span>
        <span>✅ @luna/story-engine</span>
        <span>✅ @luna/shared-types</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { flex: 1; padding: 24px; overflow-y: auto; }
h2 { color: #e8b86d; } h3 { color: #6a6a7e; font-size: 11px; text-transform: uppercase; margin: 16px 0 8px; }
.group { margin-bottom: 20px; }
.row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 14px; }
.clickable { cursor: pointer; color: #e8b86d; }
.egg { padding: 6px 0; font-size: 13px; }
.empty { color: #6a6a7e; font-size: 13px; }
.check { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: #7ecb76; }
</style>
