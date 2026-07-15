<!--
  LUNA · 星光歌姬 — MusicPlayer 音乐播放器
  音频播放控制 + 实时节奏分析 + 波形可视化

  功能：
  - 播放/暂停/上一首/下一首
  - 进度条拖拽
  - AudioAnalyzer 实时分析（BPM/音量/节拍/能量）
  - 分析数据传递给 AnimationController

  Props:
    song     - 当前歌曲对象
    autoPlay - 是否自动播放

  Events:
    @play, @pause, @ended, @timeupdate
    @analysis -> AudioAnalyzer.result
-->
<template>
  <view class="music-player" v-if="song">
    <!-- 歌曲信息 -->
    <view class="player-info">
      <text class="song-title">{{ song.name || '未命名歌曲' }}</text>
      <text class="song-artist" v-if="song.artist">{{ song.artist }}</text>

      <!-- BPM / 动画模式 标签 -->
      <view class="song-tags">
        <text class="tag bpm-tag" v-if="analysisResult.bpm > 0">
          BPM {{ analysisResult.bpm }}
        </text>
        <text class="tag mode-tag">
          {{ animationModeLabel }}
        </text>
      </view>
    </view>

    <!-- 波形可视化 -->
    <MusicWaveform
      :energy="analysisResult.energy"
      :isPlaying="playing"
      :height="60"
    />

    <!-- 进度条 -->
    <view class="progress-area">
      <text class="time-label">{{ formatTime(currentTime) }}</text>
      <slider
        class="progress-slider"
        :value="progressPercent"
        :disabled="!song"
        activeColor="#e8b86d"
        backgroundColor="rgba(255,255,255,0.1)"
        block-size="16"
        @change="handleSeek"
      />
      <text class="time-label">{{ formatTime(duration) }}</text>
    </view>

    <!-- 播放控制 -->
    <view class="player-controls">
      <text class="ctrl-icon" @tap="handleModeSwitch">🔀</text>
      <text class="ctrl-icon" @tap="handlePrev">⏮</text>
      <view class="play-btn-wrapper" @tap="handleTogglePlay">
        <text class="play-icon">{{ playing ? '⏸' : '▶️' }}</text>
      </view>
      <text class="ctrl-icon" @tap="handleNext">⏭</text>
      <text class="ctrl-icon" @tap="handleToggleFavorite">💗</text>
    </view>

    <!-- 隐藏的音频上下文（小程序 InnerAudioContext） -->
  </view>

  <!-- 无歌曲状态 -->
  <view v-else class="player-empty">
    <text class="empty-icon">🎵</text>
    <text class="empty-text">选择一首歌曲开始播放</text>
  </view>
</template>

<script>
import MusicWaveform from './Waveform.vue'
import { AudioAnalyzer, getAudioAnalyzer } from '@/services/audio'
import { useMusicStore } from '@/stores/music'

export default {
  name: 'MusicPlayer',

  components: { MusicWaveform },

  props: {
    song: { type: Object, default: null },
    autoPlay: { type: Boolean, default: true },
  },

  emits: ['play', 'pause', 'ended', 'timeupdate', 'analysis', 'error'],

  data() {
    return {
      playing: false,
      currentTime: 0,
      duration: 0,
      analysisResult: {
        bpm: 0, volume: 0, beat: false, energy: 0, isClimax: false,
      },
      _audioContext: null,
      _analyzer: null,
      _analysisTimer: null,
    }
  },

  computed: {
    musicStore() { return useMusicStore() },
    progressPercent() {
      if (this.duration <= 0) return 0
      return (this.currentTime / this.duration) * 100
    },
    animationModeLabel() {
      const { bpm, isClimax } = this.analysisResult
      if (isClimax) return '🔥 高潮'
      if (bpm > 110) return '💃 舞动'
      if (bpm > 0) return '🎤 歌唱'
      return '--'
    },
  },

  watch: {
    song: {
      immediate: true,
      handler(newSong, oldSong) {
        if (newSong?.id !== oldSong?.id) {
          this._loadAndPlay(newSong)
        }
      },
    },
  },

  created() {
    this._analyzer = getAudioAnalyzer()
  },

  beforeUnmount() {
    this._destroyAudio()
  },

  methods: {
    // ==================== 公开方法 ====================

    play() {
      if (!this._audioContext || !this.song) return
      this._audioContext.play()
    },

    pause() {
      if (!this._audioContext) return
      this._audioContext.pause()
    },

    togglePlay() {
      this.playing ? this.pause() : this.play()
    },

    seek(percent) {
      if (!this._audioContext || this.duration <= 0) return
      const targetTime = (percent / 100) * this.duration
      this._audioContext.seek(targetTime)
      this.currentTime = targetTime
    },

    /** 获取当前分析数据 */
    getAnalysis() {
      return { ...this.analysisResult }
    },

    // ==================== 音频控制 ====================

    async _loadAndPlay(song) {
      if (!song?.fileUrl && !song?.url) return

      this._destroyAudio()
      this.playing = false
      this.currentTime = 0
      this.duration = song.duration || 0

      try {
        // 创建微信小程序音频上下文
        const audioCtx = uni.createInnerAudioContext()
        audioCtx.src = song.fileUrl || song.url
        audioCtx.autoplay = false
        audioCtx.obeyMuteSwitch = false // 音乐类小程序通常需要

        // 事件监听
        audioCtx.onCanplay(() => {
          this.duration = audioCtx.duration || song.duration || 0
          if (this.autoPlay) {
            audioCtx.play()
          }
        })

        audioCtx.onPlay(() => {
          this.playing = true
          this.musicStore.resume()
          this._startAnalysis()
          this.$emit('play', song)
        })

        audioCtx.onPause(() => {
          this.playing = false
          this.musicStore.pause()
          this._stopAnalysis()
          this.$emit('pause')
        })

        audioCtx.onStop(() => {
          this.playing = false
          this._stopAnalysis()
        })

        audioCtx.onEnded(() => {
          this.playing = false
          this._stopAnalysis()
          this.$emit('ended')
          // 自动播放下一首
          this.musicStore.next()
        })

        audioCtx.onTimeUpdate(() => {
          this.currentTime = audioCtx.currentTime
          this.musicStore.updateProgress(audioCtx.currentTime, audioCtx.duration)
          this.$emit('timeupdate', {
            currentTime: audioCtx.currentTime,
            duration: audioCtx.duration,
          })
        })

        audioCtx.onError((err) => {
          console.error('[MusicPlayer] 音频错误:', err)
          this._stopAnalysis()
          this.$emit('error', err)
        })

        this._audioContext = audioCtx
      } catch (e) {
        console.error('[MusicPlayer] 初始化音频失败:', e.message)
        this.$emit('error', { message: e.message })
      }
    },

    // ==================== 音频分析 ====================

    _startAnalysis() {
      this._stopAnalysis()
      // 定时采样分析（小程序环境限制，无法直接访问频谱数据）
      this._analysisTimer = setInterval(() => {
        if (!this.playing || !this._audioContext) return

        const analysisData = {
          currentTime: this._audioContext.currentTime,
          duration: this._audioContext.duration || this.duration,
        }

        const result = this._analyzer.analyze(analysisData)
        this.analysisResult = result
        this.musicStore.updateAudioAnalysis(result)
        this.$emit('analysis', result)
      }, 250) // 每 250ms 采样一次
    },

    _stopAnalysis() {
      if (this._analysisTimer) {
        clearInterval(this._analysisTimer)
        this._analysisTimer = null
      }
      this.analysisResult = {
        bpm: 0, volume: 0, beat: false, energy: 0, isClimax: false,
      }
    },

    _destroyAudio() {
      this._stopAnalysis()
      if (this._audioContext) {
        try {
          this._audioContext.destroy()
        } catch (_) {}
        this._audioContext = null
      }
      this.playing = false
    },

    // ==================== UI 事件 ====================

    handleTogglePlay() { this.togglePlay() },
    handlePrev() { this.musicStore.previous() },
    handleNext() { this.musicStore.next() },
    handleModeSwitch() {
      const modes = ['list', 'single', 'random']
      const idx = modes.indexOf(this.musicStore.playMode)
      this.musicStore.playMode = modes[(idx + 1) % 3]
      uni.showToast({ title: this.musicStore.playMode, icon: 'none', duration: 1000 })
    },
    handleToggleFavorite() {
      uni.showToast({ title: '💗 已收藏', icon: 'none' })
    },
    handleSeek(e) {
      this.seek(e.detail.value)
    },

    formatTime(seconds) {
      if (!seconds || !isFinite(seconds)) return '0:00'
      const m = Math.floor(seconds / 60)
      const s = Math.floor(seconds % 60)
      return `${m}:${String(s).padStart(2, '0')}`
    },
  },
}
</script>

<style lang="scss" scoped>
.music-player {
  padding: $space-lg;
  background: $color-bg-card;
  border-radius: 16rpx;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* 歌曲信息 */
.player-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-xs;
  margin-bottom: $space-lg;
}
.song-title {
  font-size: $font-size-lg;
  color: $color-text-primary;
  font-weight: 600;
}
.song-artist {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}
.song-tags {
  display: flex;
  gap: $space-sm;
  margin-top: $space-xs;
}
.tag {
  padding: 2rpx 16rpx;
  border-radius: 20rpx;
  font-size: $font-size-xs;
}
.bpm-tag {
  background: rgba($color-accent, 0.15);
  color: $color-accent;
}
.mode-tag {
  background: rgba($color-luna-pink, 0.15);
  color: $color-luna-pink;
}

/* 进度条 */
.progress-area {
  display: flex;
  align-items: center;
  gap: $space-sm;
  margin: $space-md 0;
}
.time-label {
  font-size: $font-size-xs;
  color: $color-text-muted;
  width: 72rpx;
  text-align: center;
  font-family: $font-pixel;
}
.progress-slider {
  flex: 1;
}

/* 控制按钮 */
.player-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-xl;
}
.ctrl-icon {
  font-size: 40rpx;
  opacity: 0.7;
  padding: $space-xs;
  transition: all $transition-fast;

  &:active { opacity: 1; transform: scale(0.9); }
}
.play-btn-wrapper {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, $color-accent, $color-accent-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 32rpx rgba($color-accent, 0.3);
  transition: all $transition-fast;

  &:active { transform: scale(0.92); }
}
.play-icon {
  font-size: 40rpx;
}

/* 空状态 */
.player-empty {
  padding: $space-xl * 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-sm;
  opacity: 0.5;
}
.empty-icon { font-size: 64rpx; }
.empty-text { color: $color-text-secondary; font-size: $font-size-sm; }
</style>
