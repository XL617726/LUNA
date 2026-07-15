<!-- LUNA Miniapp — 唱歌表演页 -->
<template>
  <view class="page">
    <view class="stage">
      <text class="stage-icon">🎤</text>
      <text class="stage-title" v-if="stage === 'idle'">点击麦克风开始唱歌</text>
      <text class="stage-title" v-if="stage === 'uploading'">⏳ 准备中...</text>
      <text class="stage-title" v-if="stage === 'analyzing'">分析中...</text>
      <text class="stage-title" v-if="stage === 'performing'">🎵 {{ currentSong }}</text>
      <text class="stage-title" v-if="stage === 'finished'">✨ 表演结束</text>
    </view>

    <view class="actions">
      <button v-if="stage === 'idle'" class="mic-btn" @tap="handleUpload">🎤</button>
      <button v-if="stage === 'finished'" class="back-btn" @tap="goBack">回到房间</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useMusicStore } from '@/stores/music'

const music = useMusicStore()
const stage = ref('idle')
const currentSong = ref('')

function handleUpload() {
  stage.value = 'uploading'
  uni.chooseMessageFile({
    count: 1, type: 'file',
    success: (res) => {
      const file = res.tempFiles[0]
      currentSong.value = file.name?.replace(/\.[^.]+$/, '') || '未命名'
      stage.value = 'analyzing'
      setTimeout(() => {
        music.addSong({ name: currentSong.value, duration: 0, bpm: 100, animationMode: 'sing', coverUrl: '', fileUrl: file.path })
        stage.value = 'performing'
        setTimeout(() => { stage.value = 'finished' }, 5000)
      }, 2000)
    },
    fail: () => { stage.value = 'idle' },
  })
}

function goBack() { uni.navigateBack() }
</script>

<style scoped>
.page { min-height: 100vh; background: radial-gradient(ellipse at 50% 30%, #1a1a3e, #0a0a1a, #000); display: flex; flex-direction: column; align-items: center; justify-content: center; }
.stage { text-align: center; }
.stage-icon { font-size: 80rpx; }
.stage-title { color: #f0e6d3; font-size: 32rpx; margin-top: 20rpx; display: block; }
.actions { margin-top: 40rpx; }
.mic-btn { font-size: 80rpx; background: none; border: none; }
.back-btn { padding: 20rpx 48rpx; background: rgba(232,184,109,0.15); border: 1px solid rgba(232,184,109,0.3); border-radius: 40rpx; color: #e8b86d; }
</style>
