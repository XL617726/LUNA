<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { seedDemoData, DEMO_SONGS } from '@/demo-data'
import { useCharacterStore } from '@/stores/character'
import { useMusicStore } from '@/stores/music'
import FirstMeet from '@/components/FirstMeet.vue'

const charStore = useCharacterStore()
const musicStore = useMusicStore()
const dialogueText = ref('')
const showFirstMeet = ref(false)

onMounted(() => {
  charStore.restore()
  seedDemoData()
  if (musicStore.isEmpty) {
    for (const song of DEMO_SONGS) musicStore.addSong(song)
  }

  // Chapter 0: 第一次相遇
  if (!localStorage.getItem('luna_has_launched')) {
    showFirstMeet.value = true
  }
})

function handleFirstMeetComplete() {
  showFirstMeet.value = false
  localStorage.setItem('luna_has_launched', '1')
  dialogueText.value = '欢迎来到我们的音乐小世界 🌙'
  setTimeout(() => (dialogueText.value = ''), 3000)
}
</script>

<template>
  <div class="app-shell">
    <!-- Chapter 0 初见剧情 -->
    <FirstMeet v-if="showFirstMeet" @complete="handleFirstMeetComplete" />

    <!-- LUNA 对话 -->
    <div v-if="dialogueText" class="dialogue-bubble">{{ dialogueText }}</div>

    <!-- 页面视图 -->
    <router-view />

    <!-- 底部导航 -->
    <nav class="bottom-nav">
      <router-link to="/" class="nav-item">🏠<span>首页</span></router-link>
      <router-link to="/music" class="nav-item">🎼<span>歌曲</span></router-link>
      <router-link to="/character" class="nav-item">👗<span>换装</span></router-link>
      <router-link to="/memory" class="nav-item">💫<span>回忆</span></router-link>
    </nav>
  </div>
</template>

<style>
.app-shell {
  width: 100vw; height: 100vh; display: flex; flex-direction: column;
  background: #0f0f23; overflow: hidden;
}
.bottom-nav {
  display: flex; justify-content: center; gap: 32px; padding: 16px;
  background: rgba(26,26,46,0.95); border-top: 1px solid rgba(255,255,255,0.06);
}
.nav-item {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  color: #a0a0b8; text-decoration: none; font-size: 12px; padding: 8px 16px;
  border-radius: 8px; transition: all 0.15s;
}
.nav-item:hover, .router-link-active { color: #e8b86d; background: rgba(232,184,109,0.08); }
.nav-item span { font-size: 11px; }
.dialogue-bubble {
  position: fixed; top: 40px; left: 50%; transform: translateX(-50%); z-index: 100;
  padding: 12px 24px; background: rgba(22,33,62,0.95); border: 1px solid rgba(232,184,109,0.3);
  border-radius: 16px; color: #f0e6d3; font-size: 14px; animation: fadeIn 0.3s ease;
}
@keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(-8px); } }
</style>
