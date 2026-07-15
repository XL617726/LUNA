<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCharacterEngine } from '@luna/character-engine'
import { getMemorySystem } from '@luna/ai-engine'
import { getStorySystem } from '@luna/story-engine'
import { useCharacterStore } from '@/stores/character'
import { useMusicStore } from '@/stores/music'

const charStore = useCharacterStore()
const musicStore = useMusicStore()
const memory = getMemorySystem()
const story = getStorySystem()

const nickname = ref(localStorage.getItem('luna_nickname') || 'L shuo')
const eggCount = ref(story.getUnlockedStories().length)
const memoryCount = ref(memory.count)

const giftMsg = ref(localStorage.getItem('luna_gift_message') || '')
const giftFromName = ref(localStorage.getItem('luna_gift_from') || '')

function saveNickname() {
  localStorage.setItem('luna_nickname', nickname.value)
  alert('已保存 ✨')
}
function saveGiftMessage() {
  localStorage.setItem('luna_gift_message', giftMsg.value)
  localStorage.setItem('luna_gift_from', giftFromName.value)
  alert('留言已保存 💌')
}

function handleClearData() {
  if (confirm('确定要清除所有本地数据吗？歌曲列表和回忆将被删除。')) {
    localStorage.clear()
    location.reload()
  }
}

function handleExportMemories() {
  const data = {
    nickname: nickname.value,
    stats: charStore.stats,
    level: charStore.level,
    memories: memory.recall(null, 100),
    songs: musicStore.playlist,
    exportedAt: new Date().toISOString(),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `LUNA-memories-${new Date().toISOString().slice(0,10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function handleResetFirstMeet() {
  if (confirm('重新体验初见剧情？（不会删除歌曲和回忆）')) {
    localStorage.removeItem('luna_has_launched')
    localStorage.removeItem('luna_first_visit')
    localStorage.removeItem('luna_seeded')
    location.reload()
  }
}
</script>

<template>
  <div class="page">
    <h2>⚙️ 设置</h2>

    <!-- 昵称 -->
    <section class="section">
      <h3>👤 你的称呼</h3>
      <div class="row">
        <input v-model="nickname" class="input" placeholder="LUNA 该怎么称呼你？" />
        <button class="btn-sm" @click="saveNickname">保存</button>
      </div>
    </section>

    <!-- 礼物留言 -->
    <section class="section">
      <h3>💌 礼物留言</h3>
      <input v-model="giftMsg" class="input" placeholder="想对TA说的话..." style="margin-bottom:8px" />
      <div class="row">
        <input v-model="giftFromName" class="input" placeholder="署名" />
        <button class="btn-sm" @click="saveGiftMessage">保存</button>
      </div>
    </section>

    <!-- 统计 -->
    <section class="section">
      <h3>📊 数据统计</h3>
      <div class="stats-grid">
        <div class="stat"><b>{{ charStore.stats.interactionDays }}</b><span>相伴天数</span></div>
        <div class="stat"><b>{{ charStore.stats.totalPlays }}</b><span>播放次数</span></div>
        <div class="stat"><b>{{ memoryCount }}</b><span>条回忆</span></div>
        <div class="stat"><b>{{ eggCount }}</b><span>个彩蛋</span></div>
      </div>
    </section>

    <!-- 操作 -->
    <section class="section">
      <h3>🛠️ 数据管理</h3>
      <div class="action-list">
        <button class="action" @click="handleExportMemories">
          <span>📦</span> 导出回忆数据
        </button>
        <button class="action warn" @click="handleResetFirstMeet">
          <span>🎬</span> 重新体验初见剧情
        </button>
        <button class="action danger" @click="handleClearData">
          <span>🗑️</span> 清除全部数据
        </button>
      </div>
    </section>

    <!-- 关于 -->
    <section class="section">
      <h3>💡 关于 LUNA</h3>
      <div class="about">
        <p>LUNA · 星光歌姬 v1.0</p>
        <p class="sub">一个会唱歌、会陪伴、保存朋友故事的数字音乐小世界。</p>
        <p class="sub">Made with 🤍 for a special friend.</p>
      </div>
      <div class="tech-stack">
        <span>Vue3</span><span>TypeScript</span><span>Canvas 2D</span>
        <span>Pinia</span><span>Vitest</span><span>CloudBase</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page { flex: 1; padding: 20px; overflow-y: auto; }
h2 { color: #e8b86d; font-size: 20px; margin-bottom: 20px; }
h3 { color: #6a6a7e; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 16px 0 8px; }

.section { margin-bottom: 20px; }

.row { display: flex; gap: 8px; }
.input { flex: 1; padding: 10px 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: #f0e6d3; font-size: 14px; outline: none; }
.input:focus { border-color: rgba(232,184,109,0.3); }
.btn-sm { padding: 10px 18px; background: #e8b86d; border: none; border-radius: 8px; color: #0f0f23; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-sm:hover { background: #f5d89a; }

.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.stat { text-align: center; padding: 14px; background: rgba(22,33,62,0.6); border-radius: 8px; }
.stat b { display: block; font-size: 22px; color: #e8b86d; font-family: 'Courier New', monospace; }
.stat span { font-size: 11px; color: #6a6a7e; }

.action-list { display: flex; flex-direction: column; gap: 6px; }
.action { display: flex; align-items: center; gap: 10px; width: 100%; padding: 12px 14px; background: rgba(22,33,62,0.6); border: 1px solid rgba(255,255,255,0.04); border-radius: 8px; color: #a0a0b8; font-size: 14px; cursor: pointer; text-align: left; transition: all 0.15s; }
.action:hover { background: rgba(22,33,62,0.9); }
.action.warn:hover { border-color: rgba(240,192,96,0.3); color: #f0c060; }
.action.danger:hover { border-color: rgba(224,96,96,0.3); color: #e06060; }

.about { text-align: center; padding: 16px; }
.about p { font-size: 14px; color: #f0e6d3; }
.about .sub { font-size: 12px; color: #6a6a7e; margin-top: 4px; }

.tech-stack { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.tech-stack span { padding: 3px 10px; background: rgba(255,255,255,0.04); border-radius: 12px; font-size: 10px; color: #6a6a7e; }
</style>
