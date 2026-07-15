<script setup lang="ts">
import { computed } from 'vue'
import { useCharacterStore } from '@/stores/character'
import { getMemorySystem } from '@luna/ai-engine'
import { getStorySystem } from '@luna/story-engine'

const store = useCharacterStore()
const memory = getMemorySystem()
const story = getStorySystem()

const memories = computed(() => memory.recall(null, 20).reverse())
const milestones = computed(() => memory.getMilestones())
const stories = computed(() => story.getAllStories())
const unlockedStories = computed(() => stories.value.filter(s => s.unlocked))

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString('zh-CN', { month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' }) }
  catch { return iso }
}

const memoryIcons: Record<string, string> = {
  first_upload: '🎵', favorite_song: '💗', milestone: '⭐',
  special_message: '💌', easter_egg: '🥚', birthday: '🎂', interaction: '💬',
}
</script>

<template>
  <div class="page">
    <h2>💫 回忆空间</h2>

    <!-- 相伴统计 -->
    <div class="stats">
      <div class="stat"><b>{{ store.stats.interactionDays }}</b><span>相伴天数</span></div>
      <div class="stat"><b>{{ store.stats.totalPlays }}</b><span>播放次数</span></div>
      <div class="stat"><b>{{ memories.length }}</b><span>条回忆</span></div>
    </div>

    <!-- 里程碑 -->
    <section v-if="milestones.length > 0">
      <h3>🏆 里程碑</h3>
      <div v-for="m in milestones" :key="m.id" class="milestone">
        <span class="m-icon">⭐</span>
        <div>
          <div class="m-title">{{ m.data?.name || m.data?.songName || m.type }}</div>
          <div class="m-date">{{ formatDate(m.timestamp) }}</div>
        </div>
      </div>
    </section>

    <!-- 时间线 -->
    <section>
      <h3>📝 回忆时间线</h3>
      <div v-if="memories.length === 0" class="empty">还没有回忆...和 LUNA 互动来创造回忆吧</div>
      <div v-for="m in memories" :key="m.id" class="mem-item">
        <span class="mem-icon">{{ memoryIcons[m.type] || '💫' }}</span>
        <div class="mem-body">
          <div class="mem-text">
            <template v-if="m.type === 'first_upload'">第一次上传歌曲：{{ m.data?.songName }}</template>
            <template v-else-if="m.type === 'interaction'">💬 {{ m.data?.userSaid }} → {{ m.data?.lunaSaid }}</template>
            <template v-else-if="m.type === 'milestone'">{{ m.data?.description || m.data?.name }}</template>
            <template v-else-if="m.type === 'easter_egg'">发现了彩蛋：{{ m.data?.name }}</template>
            <template v-else>{{ m.type }}</template>
          </div>
          <div class="mem-date">{{ formatDate(m.timestamp) }}</div>
        </div>
      </div>
    </section>

    <!-- 隐藏剧情 -->
    <section>
      <h3>🔮 隐藏剧情</h3>
      <div class="story-grid">
        <div v-for="s in stories" :key="s.id" class="story-card" :class="{ locked: !s.unlocked }">
          <span class="story-icon">{{ s.unlocked ? s.icon : '🔒' }}</span>
          <div class="story-name">{{ s.unlocked ? s.name : '???' }}</div>
          <div class="story-desc">{{ s.description }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page { flex: 1; padding: 20px; overflow-y: auto; }
h2 { color: #e8b86d; font-size: 20px; margin-bottom: 12px; }
h3 { color: #c9a04e; font-size: 14px; margin: 20px 0 10px; text-transform: uppercase; letter-spacing: 1px; }

.stats { display: flex; gap: 10px; margin: 12px 0; }
.stat { flex: 1; text-align: center; padding: 14px 8px; background: rgba(22,33,62,0.6); border-radius: 10px; }
.stat b { display: block; font-size: 24px; color: #e8b86d; font-family: 'Courier New', monospace; }
.stat span { font-size: 11px; color: #6a6a7e; }

.milestone { display: flex; gap: 10px; padding: 10px; background: rgba(232,184,109,0.05); border: 1px solid rgba(232,184,109,0.1); border-radius: 8px; margin: 6px 0; }
.m-icon { font-size: 20px; }
.m-title { font-size: 14px; color: #f0e6d3; }
.m-date { font-size: 11px; color: #6a6a7e; }

.mem-item { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.03); }
.mem-icon { font-size: 18px; width: 28px; text-align: center; flex-shrink: 0; }
.mem-body { flex: 1; min-width: 0; }
.mem-text { font-size: 13px; color: #a0a0b8; line-height: 1.5; }
.mem-date { font-size: 10px; color: #6a6a7e; margin-top: 2px; }

.story-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; }
.story-card { padding: 12px; background: rgba(22,33,62,0.6); border-radius: 8px; text-align: center; }
.story-card.locked { opacity: 0.4; }
.story-icon { font-size: 24px; display: block; margin-bottom: 4px; }
.story-name { font-size: 12px; color: #f0e6d3; }
.story-desc { font-size: 10px; color: #6a6a7e; margin-top: 2px; }
.empty { color: #6a6a7e; text-align: center; padding: 24px; font-size: 13px; }
</style>
