<script setup lang="ts">
/**
 * Performance Mode — LUNA 唱歌表演页面
 * 上传 → 分析 → 演唱 → 保存回忆
 */
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { useMusicStore } from '@/stores/music'
import { useCharacterStore } from '@/stores/character'
import { useAudioPlayer } from '@/composables/useAudioPlayer'
import { useMelodyPlayer } from '@/composables/useMelodyPlayer'
import { getMemorySystem, getDialogueEngine } from '@luna/ai-engine'
import WebCharacter from '@/components/WebCharacter.vue'

const music = useMusicStore()
const charStore = useCharacterStore()
const { playing, currentTime, analysis, playFile, pause, resume, stop } = useAudioPlayer()
const { playMelody, getTotalDuration } = useMelodyPlayer()
const duration = ref(0)
const memory = getMemorySystem()
const dialogue = getDialogueEngine()

const stage = ref<'idle' | 'uploading' | 'analyzing' | 'performing' | 'finished'>('idle')
const currentSong = ref<string>('')
const analysisResult = ref('')
const savedMemory = ref(false)

onUnmounted(() => stop())

async function handleUpload() {
  stage.value = 'uploading'
  const input = document.createElement('input')
  input.type = 'file'; input.accept = '.mp3,.wav,.m4a'
  input.onchange = async (e: any) => {
    const file = e.target?.files?.[0]
    if (!file) { stage.value = 'idle'; return }

    const name = file.name.replace(/\.[^.]+$/, '')
    currentSong.value = name
    const url = URL.createObjectURL(file)

    // 分析阶段
    stage.value = 'analyzing'
    await new Promise(r => setTimeout(r, 2000))
    const bpm = 80 + Math.floor(Math.random() * 60)
    const energy = 0.5 + Math.random() * 0.5
    analysisResult.value = `BPM: ${bpm}  ·  ⚡ ${Math.round(energy * 100)}%`

    music.addSong({ name, duration: 0, bpm, animationMode: bpm > 110 ? 'dance' : 'sing', coverUrl: '', fileUrl: url })
    const idx = music.playlist.length - 1
    music.play(idx)

    // 表演阶段
    stage.value = 'performing'
    charStore.setAnimationState('sing')
    startFloatingNotes()
    music.updateAnalysis({ bpm, energy: energy, isClimax: energy > 0.8 })
    try {
      await playFile(url)
    } catch {
      // 无真实音频 → 旋律合成器演奏
      duration.value = getTotalDuration(name)
      await playMelody(name)
    }
  }
  input.click()
}

function handleFinish() {
  stop()
  stopFloatingNotes()
  stage.value = 'finished'
  music.pause()

  // 保存回忆
  if (!savedMemory.value) {
    memory.add('first_upload', { songName: currentSong.value })
    memory.add('milestone', { name: '第一次一起唱歌', description: `2026年夏天，${currentSong.value}` })
    savedMemory.value = true
    charStore.recordSong()
  }
}

// Floating music notes during performance
const floatingNotes = reactive<Array<{ id: number; x: number; y: number; emoji: string; delay: number; duration: number }>>([])
let noteTimer: number | null = null

function startFloatingNotes() {
  floatingNotes.length = 0
  let id = 0
  noteTimer = window.setInterval(() => {
    floatingNotes.push({
      id: id++, x: 10 + Math.random() * 80, y: 80,
      emoji: ['🎵','🎶','✨','💫','🌟'][Math.floor(Math.random() * 5)],
      delay: 0, duration: 2 + Math.random() * 2,
    })
    // Cleanup old notes
    if (floatingNotes.length > 15) floatingNotes.splice(0, 5)
  }, 600)
}

function stopFloatingNotes() {
  if (noteTimer) { clearInterval(noteTimer); noteTimer = null }
  floatingNotes.length = 0
}

onUnmounted(() => stopFloatingNotes())

const computerAnalysisText = ref('')
onMounted(() => {
  if (stage.value === 'analyzing') {
    const dots = ['.', '..', '...', '....']
    let i = 0
    const t = setInterval(() => {
      computerAnalysisText.value = `分析中${dots[i % 4]}`
      i++
      if (stage.value !== 'analyzing') clearInterval(t)
    }, 500)
  }
})
</script>

<template>
  <div class="performance-page">
    <!-- 舞台灯光 -->
    <div class="stage-lights" :class="{ active: stage === 'performing' }">
      <div class="light l1" /><div class="light l2" /><div class="light l3" />
    </div>

    <!-- 浮空音符（表演时） -->
    <div v-if="stage === 'performing'" class="floating-notes">
      <span v-for="n in floatingNotes" :key="n.id" class="note" :style="{
        left: n.x + '%', animationDuration: n.duration + 's',
      }">{{ n.emoji }}</span>
    </div>

    <!-- 角色 -->
    <div class="performer">
      <WebCharacter
        :form="charStore.currentForm"
        :animation="stage === 'performing' ? charStore.animationState : 'idle'"
        :size="280"
      />
    </div>

    <!-- 状态显示 -->
    <div class="stage-status">
      <!-- Idle -->
      <div v-if="stage === 'idle'" class="status-idle">
        <p>点击麦克风开始唱歌 🎤</p>
        <button class="mic-btn" @click="handleUpload">🎤</button>
      </div>

      <!-- 上传中 -->
      <div v-if="stage === 'uploading'" class="status-info">
        <span>⏳ 准备中...</span>
      </div>

      <!-- 分析中 -->
      <div v-if="stage === 'analyzing'" class="status-analyzing">
        <div class="analyze-spinner" />
        <p>{{ computerAnalysisText || '分析中...' }}</p>
        <p class="result" v-if="analysisResult">{{ analysisResult }}</p>
      </div>

      <!-- 表演中 -->
      <div v-if="stage === 'performing'" class="status-performing">
        <p class="song-name">🎵 {{ currentSong }}</p>
        <div class="progress-bar">
          <div class="fill" :style="{ width: (duration > 0 ? (currentTime / duration) * 100 : 0) + '%' }" />
        </div>
        <div class="stats">
          <span v-if="analysis.bpm > 0">BPM {{ analysis.bpm }}</span>
          <span>⚡ {{ Math.round(analysis.energy * 100) }}%</span>
        </div>
        <button class="finish-btn" @click="handleFinish">结束表演</button>
      </div>

      <!-- 完成 -->
      <div v-if="stage === 'finished'" class="status-finished">
        <p class="thanks">✨ 这首歌，我会好好珍惜的</p>
        <p class="memory-note" v-if="savedMemory">回忆已保存：第一次一起唱歌 ⭐</p>
        <button class="back-btn" @click="$router.push('/')">回到房间</button>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="stage-floor" />
  </div>
</template>

<style scoped>
.performance-page {
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
  background: radial-gradient(ellipse at 50% 30%, #1a1a3e 0%, #0a0a1a 60%, #000 100%);
}

/* 舞台灯光 */
.stage-lights { position: absolute; top: 0; width: 100%; height: 40%; pointer-events: none; opacity: 0.3; transition: opacity 1s; }
.stage-lights.active { opacity: 0.7; }
.light { position: absolute; width: 120px; height: 120px; border-radius: 50%; filter: blur(60px); }
.l1 { left: 10%; top: 5%; background: #ffb6c1; }
.l2 { left: 50%; transform: translateX(-50%); top: 0; background: #ffd700; }
.l3 { right: 10%; top: 5%; background: #87ceeb; }

.performer { z-index: 10; margin-top: 20px; }

/* 状态 */
.stage-status { z-index: 20; margin-top: 20px; text-align: center; min-height: 120px; }
.status-idle p { color: #a0a0b8; font-size: 14px; margin-bottom: 12px; }
.mic-btn { font-size: 56px; background: none; border: none; cursor: pointer; animation: float 2s ease-in-out infinite; transition: transform 0.15s; }
.mic-btn:hover { transform: scale(1.15); }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

.status-analyzing { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.analyze-spinner { width: 32px; height: 32px; border: 3px solid rgba(232,184,109,0.2); border-top-color: #e8b86d; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.status-analyzing p { color: #a0a0b8; font-size: 14px; }
.result { color: #e8b86d !important; font-family: 'Courier New', monospace; }

.status-performing { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.song-name { color: #f0e6d3; font-size: 18px; }
.progress-bar { width: 200px; height: 3px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; }
.fill { height: 100%; background: #e8b86d; transition: width 0.3s; }
.stats { display: flex; gap: 12px; font-size: 12px; color: #6a6a7e; }
.finish-btn { margin-top: 8px; padding: 8px 24px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; color: #a0a0b8; cursor: pointer; }
.finish-btn:hover { border-color: #e8b86d; color: #e8b86d; }

.status-finished { display: flex; flex-direction: column; align-items: center; gap: 8px; animation: fadeIn 0.5s ease; }
.thanks { color: #e8b86d; font-size: 18px; }
.memory-note { color: #7ecb76; font-size: 13px; }
.back-btn { margin-top: 8px; padding: 10px 28px; background: rgba(232,184,109,0.15); border: 1px solid rgba(232,184,109,0.3); border-radius: 20px; color: #e8b86d; cursor: pointer; }
.back-btn:hover { background: rgba(232,184,109,0.25); }

.stage-floor { position: absolute; bottom: 0; width: 100%; height: 20%; background: linear-gradient(0deg, rgba(0,0,0,0.4), transparent); pointer-events: none; }

/* 浮空音符 */
.floating-notes { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.note { position: absolute; bottom: 0; font-size: 24px; animation: floatUp linear forwards; opacity: 0; }
@keyframes floatUp {
  0% { transform: translateY(0) scale(0.5); opacity: 1; }
  50% { opacity: 0.8; }
  100% { transform: translateY(-100vh) scale(1.2); opacity: 0; }
}
</style>
