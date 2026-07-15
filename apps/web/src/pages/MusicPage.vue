<script setup lang="ts">
import { ref } from 'vue'
import { useMusicStore } from '@/stores/music'
import { useAudioPlayer } from '@/composables/useAudioPlayer'
import { getAudioAnalyzer } from '@luna/audio-engine'

const music = useMusicStore()
const { playing, currentTime, duration, analysis, playTone, pause, resume, stop } = useAudioPlayer()
const uploading = ref(false)

function handlePlay(index: number) {
  const song = music.playlist[index]
  if (!song) return
  music.play(index)
  // Demo: use synthesized tone since we don't have real audio files
  playTone(song)
}

function handleToggle() {
  if (playing.value) {
    pause(); music.pause()
  } else if (music.currentSong) {
    resume(); music.resume()
  }
}

function handleNext() { stop(); music.next(); if (music.currentSong) playTone(music.currentSong) }
function handlePrev() { stop(); music.previous(); if (music.currentSong) playTone(music.currentSong) }

function handleUpload() {
  const input = document.createElement('input')
  input.type = 'file'; input.accept = '.mp3,.wav,.m4a,.ogg'
  input.onchange = (e: any) => {
    const file = e.target?.files?.[0]
    if (!file) return
    uploading.value = true
    const url = URL.createObjectURL(file)
    music.addSong({ name: file.name.replace(/\.[^.]+$/, ''), duration: 0, bpm: 100, animationMode: 'sing', coverUrl: '', fileUrl: url })
    uploading.value = false
  }
  input.click()
}

function formatTime(s: number) {
  if (!s || !isFinite(s)) return '0:00'
  const m = Math.floor(s / 60); const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}
</script>

<template>
  <div class="page">
    <h2>🎼 音乐中心</h2>

    <!-- 上传 -->
    <button class="upload-btn" @click="handleUpload" :disabled="uploading">
      {{ uploading ? '⏳ 上传中...' : '📤 上传歌曲 (MP3/WAV/M4A)' }}
    </button>

    <!-- 播放列表 -->
    <div v-if="music.isEmpty" class="empty">还没有歌曲，上传第一首吧</div>

    <div v-for="(song, i) in music.playlist" :key="song.id" class="song-row"
      :class="{ active: music.currentIndex === i }" @click="handlePlay(i)">
      <span class="song-icon">{{ music.currentIndex === i && playing ? '🎶' : '🎵' }}</span>
      <div class="song-info">
        <div class="song-name">{{ song.name }}</div>
        <div class="song-meta">BPM {{ song.bpm || '--' }} · {{ song.animationMode }}</div>
      </div>
      <span class="song-dur">{{ song.duration ? formatTime(song.duration) : '--:--' }}</span>
      <button class="del-btn" @click.stop="music.removeSong(song.id)">✕</button>
    </div>

    <!-- 播放控制 -->
    <div v-if="music.currentSong" class="player-bar">
      <div class="player-info">
        <div class="player-song">{{ music.currentSong.name }}</div>
        <div class="player-progress">
          <div class="player-track" :style="{ width: (duration > 0 ? (currentTime / duration) * 100 : 0) + '%' }" />
        </div>
        <div class="player-time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</div>
      </div>
      <div class="player-btns">
        <button @click="handlePrev">⏮</button>
        <button class="play-btn" @click="handleToggle">{{ playing ? '⏸' : '▶️' }}</button>
        <button @click="handleNext">⏭</button>
      </div>
      <!-- BPM / Energy indicator -->
      <div class="audio-stats">
        <span class="stat" v-if="analysis.bpm > 0">BPM {{ analysis.bpm }}</span>
        <span class="stat">⚡ {{ Math.round(analysis.energy * 100) }}%</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { flex: 1; padding: 20px; overflow-y: auto; }
h2 { color: #e8b86d; font-size: 20px; margin-bottom: 16px; }
.upload-btn { width: 100%; padding: 14px; background: rgba(232,184,109,0.08); border: 1px dashed rgba(232,184,109,0.25); border-radius: 10px; color: #e8b86d; font-size: 14px; cursor: pointer; margin-bottom: 16px; transition: all 0.15s; }
.upload-btn:hover { background: rgba(232,184,109,0.12); }
.upload-btn:disabled { opacity: 0.4; }
.empty { text-align: center; padding: 60px 20px; color: #6a6a7e; font-size: 14px; }

.song-row { display: flex; align-items: center; gap: 12px; padding: 12px; margin-bottom: 6px; background: rgba(22,33,62,0.6); border-radius: 10px; cursor: pointer; transition: all 0.15s; border: 1px solid transparent; }
.song-row:hover { background: rgba(22,33,62,0.9); }
.song-row.active { border-color: rgba(232,184,109,0.3); background: rgba(232,184,109,0.06); }
.song-icon { font-size: 20px; width: 32px; text-align: center; }
.song-info { flex: 1; min-width: 0; }
.song-name { font-size: 14px; color: #f0e6d3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.song-meta { font-size: 11px; color: #6a6a7e; margin-top: 2px; }
.song-dur { font-size: 12px; color: #6a6a7e; }
.del-btn { background: none; border: none; color: #6a6a7e; cursor: pointer; font-size: 14px; padding: 4px; }
.del-btn:hover { color: #e06060; }

.player-bar { position: sticky; bottom: 0; margin-top: 16px; padding: 14px; background: rgba(22,33,62,0.97); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; display: flex; align-items: center; gap: 16px; }
.player-info { flex: 1; min-width: 0; }
.player-song { font-size: 13px; color: #f0e6d3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.player-progress { height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; margin: 6px 0; overflow: hidden; }
.player-track { height: 100%; background: #e8b86d; border-radius: 2px; transition: width 0.2s; }
.player-time { font-size: 10px; color: #6a6a7e; }
.player-btns { display: flex; align-items: center; gap: 8px; }
.player-btns button { background: none; border: none; font-size: 20px; color: #a0a0b8; cursor: pointer; padding: 4px; }
.player-btns button:hover { color: #e8b86d; }
.play-btn { font-size: 30px !important; color: #e8b86d !important; }
.audio-stats { display: flex; flex-direction: column; gap: 2px; }
.stat { font-size: 10px; color: #6a6a7e; white-space: nowrap; }
</style>
