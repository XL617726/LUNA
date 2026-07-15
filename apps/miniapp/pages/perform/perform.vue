<!-- LUNA Miniapp — 唱歌表演页 (升级版) -->
<template>
  <view class="page" :class="'phase-' + stage">
    <view class="stage-area">
      <!-- 舞台灯光 -->
      <view v-if="stage === 'performing'" class="stage-lights">
        <view class="light l1" /><view class="light l2" /><view class="light l3" />
      </view>

      <!-- 角色占位 -->
      <view class="character-placeholder">
        <text class="luna-icon">🌙</text>
      </view>

      <!-- 状态 -->
      <view class="stage-text">
        <text v-if="stage === 'idle'" class="hint">点击麦克风开始唱歌 🎤</text>
        <text v-if="stage === 'uploading'" class="status">⏳ 准备中...</text>
        <text v-if="stage === 'analyzing'" class="status analyzing">🎵 分析中...</text>
        <text v-if="stage === 'performing'" class="song-name">🎵 {{ currentSong }}</text>
        <text v-if="stage === 'finished'" class="thanks">✨ 表演结束</text>
      </view>

      <!-- BPM 显示 -->
      <view v-if="stage === 'analyzing' || stage === 'performing'" class="bpm-info">
        <text v-if="bpm > 0">BPM: {{ bpm }}</text>
        <text>⚡ {{ energy }}%</text>
      </view>

      <!-- 进度条 -->
      <view v-if="stage === 'performing'" class="progress-bar">
        <view class="progress-fill" :style="{ width: progress + '%' }" />
      </view>
    </view>

    <!-- 按钮 -->
    <view class="actions">
      <button v-if="stage === 'idle'" class="mic-btn" @tap="handleUpload">🎤</button>
      <button v-if="stage === 'performing'" class="stop-btn" @tap="handleFinish">结束表演</button>
      <button v-if="stage === 'finished'" class="back-btn" @tap="goBack">回到房间</button>
      <text v-if="stage === 'finished' && saved" class="memory-saved">回忆已保存 ⭐</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useMusicStore } from '@/stores/music'
import { useCharacterStore } from '@/stores/character'
import { getMemorySystem } from '@/services/ai-memory'

const music = useMusicStore()
const charStore = useCharacterStore()
const memory = getMemorySystem()

const stage = ref('idle')
const currentSong = ref('')
const bpm = ref(0)
const energy = ref(0)
const progress = ref(0)
const saved = ref(false)
let progressTimer: any = null

function handleUpload() {
  stage.value = 'uploading'
  uni.chooseMessageFile({
    count: 1, type: 'file',
    success: (res) => {
      const file = res.tempFiles[0]
      currentSong.value = file.name?.replace(/\.[^.]+$/, '') || '未命名'
      stage.value = 'analyzing'

      // 模拟分析
      setTimeout(() => {
        bpm.value = 80 + Math.floor(Math.random() * 60)
        energy.value = Math.round((0.4 + Math.random() * 0.6) * 100)
        music.addSong({
          name: currentSong.value, duration: 0, bpm: bpm.value,
          animationMode: bpm.value > 110 ? 'dance' : 'sing',
          coverUrl: '', fileUrl: file.path,
        })
        stage.value = 'performing'
        charStore.setAnimationState('sing')
        startProgress()
      }, 2000)
    },
    fail: () => { stage.value = 'idle' },
  })
}

function startProgress() {
  progress.value = 0
  progressTimer = setInterval(() => {
    progress.value += 2
    if (progress.value >= 100) handleFinish()
  }, 200)
}

function handleFinish() {
  if (progressTimer) { clearInterval(progressTimer); progressTimer = null }
  stage.value = 'finished'
  charStore.setAnimationState('idle')
  music.pause()
  memory.add('first_upload', { songName: currentSong.value })
  memory.add('milestone', { name: '第一次一起唱歌', description: currentSong.value })
  saved.value = true
  charStore.recordSong()
}

function goBack() { uni.navigateBack() }
</script>

<style scoped>
.page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.phase-idle { background: radial-gradient(ellipse at 50% 30%, #1a1a3e, #0a0a1a, #000); }
.phase-performing { background: radial-gradient(ellipse at 50% 30%, #2a1a3e, #0a0a1a, #000); }
.phase-finished { background: radial-gradient(ellipse at 50% 30%, #1a2a2a, #0a0a1a, #000); }
.phase-analyzing { background: radial-gradient(ellipse at 50% 30%, #1a1a3e, #0a0a1a, #000); }

.stage-area { text-align: center; position: relative; }
.stage-lights { position: absolute; top: -20%; left: 0; right: 0; display: flex; justify-content: center; gap: 40rpx; }
.light { width: 80rpx; height: 80rpx; border-radius: 50%; filter: blur(30rpx); opacity: 0.5; }
.l1 { background: #ffb6c1; } .l2 { background: #ffd700; } .l3 { background: #87ceeb; }

.character-placeholder { margin: 40rpx 0; }
.luna-icon { font-size: 120rpx; }

.stage-text { margin: 20rpx 0; }
.hint { color: #a0a0b8; font-size: 28rpx; }
.status { color: #a0a0b8; font-size: 28rpx; }
.analyzing { animation: pulse 1.5s infinite; }
@keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
.song-name { color: #f0e6d3; font-size: 36rpx; }
.thanks { color: #e8b86d; font-size: 32rpx; }

.bpm-info { display: flex; gap: 20rpx; justify-content: center; margin: 10rpx 0; font-size: 24rpx; color: #6a6a7e; }

.progress-bar { width: 400rpx; height: 6rpx; background: rgba(255,255,255,0.1); border-radius: 3rpx; margin: 20rpx auto; overflow: hidden; }
.progress-fill { height: 100%; background: #e8b86d; transition: width 0.3s; }

.actions { margin-top: 40rpx; text-align: center; }
.mic-btn { font-size: 80rpx; background: none; border: none; line-height: 1; }
.stop-btn { padding: 16rpx 40rpx; background: rgba(224,96,96,0.15); border: 1px solid rgba(224,96,96,0.3); border-radius: 30rpx; color: #e06060; font-size: 28rpx; }
.back-btn { padding: 20rpx 48rpx; background: rgba(232,184,109,0.15); border: 1px solid rgba(232,184,109,0.3); border-radius: 40rpx; color: #e8b86d; }
.memory-saved { display: block; margin-top: 20rpx; font-size: 24rpx; color: #7ecb76; }
</style>
