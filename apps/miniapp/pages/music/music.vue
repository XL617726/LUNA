<!--
  LUNA · 星光歌姬 — 音乐中心
  功能：上传歌曲、播放列表、歌曲详情
  支持格式：MP3 / WAV / M4A
-->
<template>
  <view class="page-music">
    <!-- 顶部标题 -->
    <view class="page-header">
      <text class="page-title luna-pixel-text">🎼 音乐中心</text>
      <text class="page-subtitle">{{ playlist.length }} 首歌曲</text>
    </view>

    <!-- 上传区域（Task05 UploadBox 接入点）-->
    <view class="upload-section">
      <view class="upload-box-placeholder" @tap="handleUpload">
        <text class="upload-icon">📤</text>
        <text class="upload-text">上传歌曲</text>
        <text class="upload-hint">支持 MP3 / WAV / M4A</text>
      </view>
    </view>

    <!-- 歌曲列表 -->
    <scroll-view class="playlist" scroll-y>
      <view v-if="playlist.length === 0" class="empty-state">
        <text class="empty-icon">🎵</text>
        <text class="empty-text">还没有歌曲</text>
        <text class="empty-hint">上传你的第一首歌吧</text>
      </view>

      <view
        v-for="(song, index) in playlist"
        :key="song.id"
        class="song-item"
        :class="{ active: currentIndex === index && isPlaying }"
        @tap="handlePlaySong(index)"
      >
        <view class="song-cover">
          <text class="cover-icon">{{ isPlaying && currentIndex === index ? '🎶' : '🎵' }}</text>
        </view>
        <view class="song-info">
          <text class="song-name">{{ song.name }}</text>
          <text class="song-meta">
            BPM: {{ song.bpm || '--' }} · {{ song.animationMode || 'auto' }}
          </text>
        </view>
        <view class="song-duration">
          <text>{{ formatDuration(song.duration) }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 播放控制栏（Task04 MusicPlayer 接入点）-->
    <view class="mini-player" v-if="currentSong">
      <text class="player-song-name">{{ currentSong.name }}</text>
      <view class="player-controls">
        <text class="ctrl-btn" @tap="handlePrev">⏮</text>
        <text class="ctrl-btn play-btn" @tap="handleTogglePlay">
          {{ isPlaying ? '⏸' : '▶️' }}
        </text>
        <text class="ctrl-btn" @tap="handleNext">⏭</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useMusicStore } from '@/stores/music'

const musicStore = useMusicStore()

const playlist = computed(() => musicStore.playlist)
const currentSong = computed(() => musicStore.currentSong)
const currentIndex = computed(() => musicStore.currentIndex)
const isPlaying = computed(() => musicStore.isPlaying)

const formatDuration = (seconds) => {
  if (!seconds) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

const handleUpload = () => {
  uni.showToast({ title: '📤 上传功能即将开放', icon: 'none' })
}

const handlePlaySong = (index) => {
  musicStore.play(index)
}

const handleTogglePlay = () => {
  isPlaying.value ? musicStore.pause() : musicStore.resume()
}

const handlePrev = () => musicStore.previous()
const handleNext = () => musicStore.next()
</script>

<style lang="scss" scoped>
.page-music {
  min-height: 100vh;
  background: $color-bg-primary;
  padding-bottom: 140rpx;
}
.page-header {
  padding: $space-lg;
  display: flex;
  flex-direction: column;
  gap: $space-xs;
}
.page-title {
  font-size: $font-size-xl;
  color: $color-accent;
}
.page-subtitle {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

/* 上传区域 */
.upload-section {
  padding: 0 $space-lg $space-lg;
}
.upload-box-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-sm;
  padding: $space-xl;
  border: 2px dashed rgba($color-accent, 0.3);
  border-radius: 12rpx;
  background: rgba(255, 255, 255, 0.03);
  transition: all $transition-fast;

  &:active {
    border-color: $color-accent;
    background: rgba($color-accent, 0.05);
  }
}
.upload-icon { font-size: 48rpx; }
.upload-text { color: $color-text-primary; }
.upload-hint { font-size: $font-size-xs; color: $color-text-muted; }

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $space-xl * 2;
  gap: $space-sm;
}
.empty-icon { font-size: 80rpx; opacity: 0.5; }
.empty-text { color: $color-text-secondary; }
.empty-hint { font-size: $font-size-xs; color: $color-text-muted; }

/* 歌曲列表 */
.playlist {
  padding: 0 $space-lg;
  max-height: 60vh;
}
.song-item {
  display: flex;
  align-items: center;
  padding: $space-md;
  margin-bottom: $space-sm;
  background: $color-bg-card;
  border-radius: 8rpx;
  gap: $space-md;
  transition: all $transition-fast;

  &.active {
    border: 1px solid rgba($color-accent, 0.4);
    background: rgba($color-accent, 0.08);
  }

  &:active { opacity: 0.8; }
}
.song-cover {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8rpx;
}
.cover-icon { font-size: 32rpx; }
.song-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.song-name {
  font-size: $font-size-md;
  color: $color-text-primary;
}
.song-meta {
  font-size: $font-size-xs;
  color: $color-text-muted;
}
.song-duration {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

/* 迷你播放器 */
.mini-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $space-md $space-lg;
  background: rgba($color-bg-secondary, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: $z-overlay;
}
.player-song-name {
  flex: 1;
  font-size: $font-size-sm;
  color: $color-text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.player-controls {
  display: flex;
  align-items: center;
  gap: $space-lg;
}
.ctrl-btn {
  font-size: 36rpx;
  padding: $space-xs;

  &:active { transform: scale(0.85); }
}
</style>
