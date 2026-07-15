<!--
  LUNA · 星光歌姬 — 音频波形可视化
  基于音频能量数据的实时节奏条
-->
<template>
  <view class="waveform" :style="{ height: height + 'rpx' }">
    <view
      v-for="(bar, i) in bars"
      :key="i"
      class="wave-bar"
      :style="bar.style"
    />
  </view>
</template>

<script>
export default {
  name: 'MusicWaveform',

  props: {
    energy: { type: Number, default: 0 },
    isPlaying: { type: Boolean, default: false },
    barCount: { type: Number, default: 24 },
    height: { type: Number, default: 80 },
    color: { type: String, default: '#e8b86d' },
  },

  data() {
    return {
      bars: [],
      _animTimer: null,
      _seed: 0,
    }
  },

  watch: {
    isPlaying(val) {
      if (val) this._startAnimation()
      else this._stopAnimation()
    },
  },

  created() {
    this._initBars()
    if (this.isPlaying) this._startAnimation()
  },

  beforeUnmount() {
    this._stopAnimation()
  },

  methods: {
    _initBars() {
      this.bars = Array.from({ length: this.barCount }, (_, i) => ({
        style: {
          height: '6rpx',
          backgroundColor: this.color,
          opacity: 0.3,
          transition: 'height 0.15s ease, opacity 0.15s ease',
        },
        baseHeight: 6,
        phase: (i / this.barCount) * Math.PI * 2,
      }))
    },

    _startAnimation() {
      this._stopAnimation()
      const tick = () => {
        if (!this.isPlaying) return

        const energyLevel = this.energy || 0.3
        this._seed += 0.15

        this.bars = this.bars.map((bar, i) => {
          // 基于能量 + 正弦波动画
          const wave = Math.sin(this._seed + bar.phase)
          const h = 6 + Math.abs(wave) * energyLevel * 64
          const alpha = 0.2 + Math.abs(wave) * 0.7 * (0.4 + energyLevel * 0.6)

          return {
            ...bar,
            style: {
              ...bar.style,
              height: `${h}rpx`,
              opacity: alpha,
            },
          }
        })

        this._animTimer = setTimeout(tick, 100)
      }
      tick()
    },

    _stopAnimation() {
      if (this._animTimer) {
        clearTimeout(this._animTimer)
        this._animTimer = null
      }
      // 归位
      this.bars = this.bars.map(bar => ({
        ...bar,
        style: { ...bar.style, height: '6rpx', opacity: 0.3 },
      }))
    },
  },
}
</script>

<style lang="scss" scoped>
.waveform {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
}

.wave-bar {
  flex: 1;
  max-width: 12rpx;
  border-radius: 2rpx;
}
</style>
