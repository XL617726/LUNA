<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { seedDemoData, DEMO_SONGS } from '@/demo-data'
import { useCharacterStore } from '@/stores/character'
import { useMusicStore } from '@/stores/music'
import FirstMeet from '@/components/FirstMeet.vue'
import SplashScreen from '@/components/SplashScreen.vue'
import GuidedTour from '@/components/GuidedTour.vue'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import DemoMode from '@/components/DemoMode.vue'

const charStore = useCharacterStore()
const musicStore = useMusicStore()
const dialogueText = ref('')
const showFirstMeet = ref(false)
const showSplash = ref(true)
const showTour = ref(false)

// Demo mode: add ?demo to URL
const isDemo = new URLSearchParams(window.location.search).has('demo')

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
  localStorage.setItem('luna_first_visit', Date.now().toString())
  // Show guided tour on first visit
  if (!localStorage.getItem('luna_tour_done')) {
    showTour.value = true
  } else {
    dialogueText.value = '欢迎回来 🌙'
    setTimeout(() => (dialogueText.value = ''), 2500)
  }
}

function handleTourDone() {
  showTour.value = false
  dialogueText.value = '欢迎来到我们的音乐小世界 🌙'
  setTimeout(() => (dialogueText.value = ''), 3000)
}

// Welcome back: show personalized greeting for returning users
onMounted(() => {
  if (!localStorage.getItem('luna_has_launched')) return
  const firstVisit = parseInt(localStorage.getItem('luna_first_visit') || '0')
  if (!firstVisit) { localStorage.setItem('luna_first_visit', Date.now().toString()); return }

  const daysSinceFirst = Math.floor((Date.now() - firstVisit) / 86400000)
  const hour = new Date().getHours()

  const name = localStorage.getItem('luna_nickname') || 'L shuo'
  const prefix = name ? `${name}，` : ''
  let greeting = ''
  if (hour >= 22 || hour < 6) greeting = `这么晚了还来看我...谢谢你 ${name ? name : ''} 🌙`.trim()
  else if (hour < 10) greeting = `${prefix}早上好呀～今天想听什么歌？☀️`
  else if (daysSinceFirst > 0) greeting = `${prefix}你回来啦～我们已经相伴 ${daysSinceFirst} 天了 ✨`
  else greeting = `${prefix}你来啦～今天想做什么？`

  setTimeout(() => {
    dialogueText.value = greeting
    setTimeout(() => (dialogueText.value = ''), 3000)
  }, 1500)
})
</script>

<template>
  <div class="app-shell">
    <!-- Splash Screen -->
    <SplashScreen v-if="showSplash" @done="showSplash = false" />

    <!-- Chapter 0 初见剧情 -->
    <FirstMeet v-if="!showSplash && showFirstMeet" @complete="handleFirstMeetComplete" />

    <!-- 新手引导 Tour -->
    <GuidedTour v-if="!showSplash && !showFirstMeet && showTour" @done="handleTourDone" />

    <!-- LUNA 对话 -->
    <div v-if="dialogueText" class="dialogue-bubble">{{ dialogueText }}</div>

    <!-- 页面视图 -->
    <router-view />

    <!-- Demo mode (add ?demo to URL) -->
    <DemoMode v-if="isDemo" />

    <!-- 底部导航 -->
    <nav class="bottom-nav">
      <a @click.prevent="$router.push('/')" class="nav-item" :class="{ active: $route.path === '/' }">🏠<span>首页</span></a>
      <a @click.prevent="$router.push('/music')" class="nav-item" :class="{ active: $route.path === '/music' }">🎼<span>歌曲</span></a>
      <a @click.prevent="$router.push('/character')" class="nav-item" :class="{ active: $route.path === '/character' }">👗<span>换装</span></a>
      <a @click.prevent="$router.push('/memory')" class="nav-item" :class="{ active: $route.path === '/memory' }">💫<span>回忆</span></a>
      <a @click.prevent="$router.push('/chat')" class="nav-item" :class="{ active: $route.path === '/chat' }">💬<span>聊天</span></a>
    </nav>
  </div>
</template>

<style>
.app-shell {
  width: 100vw; height: 100vh; display: flex; flex-direction: column;
  background: #0f0f23; overflow: hidden;
}
.bottom-nav {
  position: relative; z-index: 30;
  display: flex; justify-content: center; gap: 32px; padding: 16px;
  background: rgba(26,26,46,0.95); border-top: 1px solid rgba(255,255,255,0.06);
}
.nav-item {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  color: #a0a0b8; text-decoration: none; font-size: 12px; padding: 8px 16px;
  border-radius: 8px; transition: all 0.15s;
}
.nav-item:hover, .nav-item.active { color: #e8b86d; background: rgba(232,184,109,0.08); }
.nav-item { cursor: pointer; }
.nav-item span { font-size: 11px; }

/* Mobile responsive */
@media (max-width: 480px) {
  .bottom-nav { gap: 8px; padding: 10px 8px; }
  .nav-item { padding: 6px 10px; font-size: 10px; }
  .nav-item span { font-size: 9px; }
}

@media (min-width: 768px) {
  .app-shell { max-width: 480px; margin: 0 auto; border-left: 1px solid rgba(255,255,255,0.04); border-right: 1px solid rgba(255,255,255,0.04); }
}

.dialogue-bubble {
  position: fixed; top: 40px; left: 50%; transform: translateX(-50%); z-index: 100;
  padding: 12px 24px; background: rgba(22,33,62,0.95); border: 1px solid rgba(232,184,109,0.3);
  border-radius: 16px; color: #f0e6d3; font-size: 14px; animation: fadeIn 0.3s ease;
}
@keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(-8px); } }
</style>
