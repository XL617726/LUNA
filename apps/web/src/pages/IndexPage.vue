<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCharacterStore } from '@/stores/character'
import { useMusicStore } from '@/stores/music'
import { getDialogueEngine } from '@luna/ai-engine'
import { getStorySystem } from '@luna/story-engine'
import { useSoundEffects, useAmbientSound } from '@/composables/useSoundEffects'
import { useDailyStreak } from '@/composables/useDailyStreak'

const sfx = useSoundEffects()
const ambience = useAmbientSound()
const streak = useDailyStreak()

// Gift message
const giftMessage = ref(localStorage.getItem('luna_gift_message') || '')
const giftFrom = ref(localStorage.getItem('luna_gift_from') || '')
const showGiftMessage = ref(false)

// Time & weather
const timeDisplay = computed(() => {
  const now = new Date()
  return `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
})
const weatherIcon = computed(() => {
  const h = new Date().getHours()
  if (h >= 20 || h < 6) return '🌙'
  if (h < 10) return '☀️'
  if (h < 17) return '⛅'
  return '🌅'
})
const daysSinceFirst = computed(() => {
  const first = parseInt(localStorage.getItem('luna_first_visit') || '0')
  if (!first) return 0
  return Math.floor((Date.now() - first) / 86400000)
})
import WebCharacter from '@/components/WebCharacter.vue'
import WebSceneManager from '@/components/WebSceneManager.vue'
import Starfield from '@/components/Starfield.vue'
import RoomAmbience from '@/components/RoomAmbience.vue'

const charStore = useCharacterStore()
const musicStore = useMusicStore()
const dialogue = getDialogueEngine()
const story = getStorySystem()

const dialogueText = ref('')
let dialogueTimer: number | null = null

function showDialogue(text: string, duration = 2500) {
  dialogueText.value = text
  if (dialogueTimer) clearTimeout(dialogueTimer)
  dialogueTimer = window.setTimeout(() => { dialogueText.value = '' }, duration)
}

function handleSingClick() {
  if (musicStore.isEmpty) {
    showDialogue('还没有歌曲呢...去上传一首吧 🎵')
  } else {
    musicStore.isPlaying ? musicStore.pause() : musicStore.resume()
    showDialogue(dialogue.speak(musicStore.isPlaying ? 'music_stop' : 'music_play'))
  }
}

function handleCharClick() {
  showDialogue(dialogue.speak('greeting'))
  charStore.recordInteraction()
  const up = charStore.recordInteraction()
  if (up?.leveledUp) showDialogue(up.message || '升级了！🌟', 4000)
}

function handleStarClick() {
  const r = story.triggerStory('hidden_star')
  if (r) showDialogue(r.dialogue, 4000)
}

// Random idle dialogue — LUNA偶尔自言自语
let idleTimer: number | null = null
function scheduleIdleDialogue() {
  idleTimer = window.setTimeout(() => {
    if (!dialogueText.value) showDialogue(dialogue.speak('idle'), 2500)
    scheduleIdleDialogue()
  }, 15000 + Math.random() * 30000) // 15-45秒随机
}
onMounted(() => { scheduleIdleDialogue(); ambience.start() })
onUnmounted(() => { if (idleTimer) clearTimeout(idleTimer); ambience.stop() })
</script>

<template>
  <Starfield />
  <RoomAmbience />
  <WebSceneManager :form="charStore.currentForm" />

  <!-- 房间状态栏 -->
  <div class="room-status">
    <span class="time-badge">{{ timeDisplay }}</span>
    <span class="weather-badge">{{ weatherIcon }}</span>
    <span class="days-badge" v-if="daysSinceFirst > 0">相伴 {{ daysSinceFirst }} 天</span>
    <span class="streak-badge" v-if="streak.streak.value >= 2">
      {{ streak.streakEmoji.value }} 连续 {{ streak.streak.value }} 天
    </span>
  </div>

  <!-- 签到里程碑奖励 -->
  <Transition name="bubble">
    <div v-if="streak.showReward.value" class="streak-reward" @click="streak.dismissReward()">
      <p>{{ streak.rewardMessage.value }}</p>
    </div>
  </Transition>

  <div class="stage-container">
    <!-- 角色 -->
    <div class="character-wrapper" @click="handleCharClick">
      <WebCharacter
        :form="charStore.currentForm"
        :animation="charStore.animationState"
        :size="320"
      />
    </div>

    <!-- 舞台信息 -->
    <div class="stage-info">
      <div class="name">LUNA</div>
      <div class="form-tag">{{ charStore.formInfo.name }} · Lv{{ charStore.level }}</div>
    </div>

    <!-- 对话气泡 -->
    <Transition name="bubble">
      <div v-if="dialogueText" class="dialogue-bubble">{{ dialogueText }}</div>
    </Transition>

    <!-- 迷你播放器状态 -->
    <div v-if="musicStore.currentSong" class="now-playing" @click="$router.push('/music')">
      <span class="np-icon">{{ musicStore.isPlaying ? '🎶' : '🎵' }}</span>
      <span class="np-name">{{ musicStore.currentSong.name }}</span>
    </div>
  </div>

  <!-- 房间家具 -->
  <div class="room-furniture">
    <div class="furniture mic-stand" @click="$router.push('/perform')" title="唱歌">
      <span>🎤</span>
    </div>
    <div class="furniture bookshelf" @click="$router.push('/memory')" title="回忆">
      <span>📚</span>
    </div>
    <div class="furniture plant" @click="handleCharClick" title="互动">
      <span>🪴</span>
    </div>
    <div class="furniture speaker" @click="handleSingClick" title="音乐">
      <span>🔈</span>
    </div>
  </div>

  <!-- 底部操作栏 -->
  <div class="action-bar">
    <button class="action-btn mic-btn" @click="sfx.click(); $router.push('/perform')">🎤 唱歌</button>
    <button class="action-btn" @click="sfx.click(); $router.push('/music')">🎼 歌曲</button>
    <button class="action-btn" @click="sfx.click(); $router.push('/character')">👗 换装</button>
    <button class="action-btn" @click="sfx.click(); $router.push('/memory')">💫 回忆</button>
    <button class="action-btn chat-nav" @click="sfx.click(); $router.push('/chat')">💬 聊天</button>
  </div>

  <!-- 隐藏星星 — 显示送礼人留言 -->
  <button class="easter-star" @click="handleStarClick" title="制作人留言">⭐</button>

  <!-- 送礼人留言卡片 -->
  <div class="gift-message-card" v-if="giftMessage" @click="showGiftMessage = !showGiftMessage">
    <span class="gift-card-icon">💌</span>
    <Transition name="bubble">
      <div v-if="showGiftMessage" class="gift-card-content">
        <p class="gift-text">{{ giftMessage }}</p>
        <p class="gift-from">— {{ giftFrom }}</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 房间状态栏 */
.room-status {
  position: absolute; top: 12px; left: 16px; z-index: 25;
  display: flex; gap: 8px; align-items: center;
}
.time-badge, .weather-badge, .days-badge {
  padding: 4px 12px; background: rgba(15,15,35,0.7); border-radius: 14px;
  font-size: 12px; color: #a0a0b8; backdrop-filter: blur(8px);
}
.days-badge { color: #e8b86d; border: 1px solid rgba(232,184,109,0.2); }
.streak-badge { color: #ffb6c1; border: 1px solid rgba(255,182,193,0.2); }

/* 签到里程碑 */
.streak-reward {
  position: absolute; top: 25%; left: 50%; transform: translateX(-50%); z-index: 35;
  padding: 16px 28px; background: rgba(22,33,62,0.96);
  border: 2px solid #ffd700; border-radius: 16px; cursor: pointer;
  box-shadow: 0 0 32px rgba(255,215,0,0.2);
  animation: lunaFadeIn 0.5s ease;
}
.streak-reward p { color: #ffd700; font-size: 15px; text-align: center; margin: 0; }

.stage-container {
  position: relative; z-index: 10; flex: 1;
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding-top: 40px;
}
.character-wrapper { cursor: pointer; transition: transform 0.2s; }
.character-wrapper:hover { transform: scale(1.02); }
.character-wrapper:active { transform: scale(0.97); }

.stage-info { text-align: center; margin-top: 12px; }
.name { font-family: 'Courier New', monospace; font-size: 28px; color: #e8b86d; letter-spacing: 4px; text-shadow: 2px 2px 0 rgba(0,0,0,0.3); }
.form-tag { font-size: 12px; color: #6a6a7e; margin-top: 4px; }

.dialogue-bubble {
  position: absolute; top: 5%; left: 50%; transform: translateX(-50%);
  padding: 10px 24px; background: rgba(22,33,62,0.94); border: 1px solid rgba(232,184,109,0.25);
  border-radius: 20px; color: #f0e6d3; font-size: 14px; white-space: nowrap;
  max-width: 80vw; overflow: hidden; text-overflow: ellipsis;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
.bubble-enter-active { transition: all 0.3s ease; }
.bubble-leave-active { transition: all 0.2s ease; }
.bubble-enter-from, .bubble-leave-to { opacity: 0; transform: translateX(-50%) translateY(-6px); }

.now-playing {
  position: absolute; bottom: -20px; display: flex; align-items: center; gap: 6px;
  padding: 6px 14px; background: rgba(22,33,62,0.85); border-radius: 20px;
  font-size: 12px; color: #a0a0b8; cursor: pointer;
}
.np-icon { font-size: 14px; }
.np-name { max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.action-bar {
  position: relative; z-index: 20; display: flex; justify-content: center; gap: 20px;
  padding: 16px 24px 24px;
}
.action-btn {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: 10px 18px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px; color: #a0a0b8; font-size: 13px; cursor: pointer;
  transition: all 0.15s; min-width: 64px;
}
.action-btn:hover { background: rgba(232,184,109,0.08); border-color: rgba(232,184,109,0.2); color: #e8b86d; transform: translateY(-1px); }
.action-btn:active { transform: scale(0.95); }
.action-btn.primary { background: linear-gradient(135deg, rgba(232,184,109,0.2), rgba(201,160,78,0.1)); border-color: rgba(232,184,109,0.3); color: #e8b86d; }
.action-btn.chat-nav { border-color: rgba(135,206,235,0.2); }

/* 房间家具 */
.room-furniture { position: absolute; inset: 0; pointer-events: none; z-index: 5; }
.furniture { position: absolute; font-size: 28px; opacity: 0.4; cursor: pointer; pointer-events: all; transition: all 0.2s; }
.furniture:hover { opacity: 0.8; transform: scale(1.1); }
.mic-stand { bottom: 22%; left: 15%; }
.bookshelf { top: 15%; right: 12%; }
.plant { bottom: 28%; right: 18%; }
.speaker { bottom: 18%; left: 22%; }

.easter-star {
  position: fixed; top: 16px; right: 20px; z-index: 50;
  background: none; border: none; font-size: 22px; cursor: pointer; opacity: 0.3; transition: opacity 0.2s;
}
.easter-star:hover { opacity: 0.8; }

/* 送礼人留言卡片 */
.gift-message-card {
  position: fixed; bottom: 80px; left: 16px; z-index: 30; cursor: pointer;
}
.gift-card-icon { font-size: 24px; opacity: 0.6; transition: opacity 0.2s; }
.gift-card-icon:hover { opacity: 1; }
.gift-card-content {
  position: absolute; bottom: 36px; left: 0;
  padding: 14px 18px; background: rgba(22,33,62,0.96);
  border: 1px solid rgba(255,182,193,0.25); border-radius: 14px;
  min-width: 200px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}
.gift-text { font-size: 13px; color: #f0e6d3; line-height: 1.6; margin: 0; }
.gift-from { font-size: 11px; color: #e8b86d; margin: 6px 0 0; text-align: right; }
</style>
