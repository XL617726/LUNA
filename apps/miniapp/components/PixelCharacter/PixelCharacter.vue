<!--
  LUNA · 星光歌姬 — PixelCharacter 像素角色组件
  Canvas 2D 渲染，像素风格，支持 Sprite 帧动画

  Props:
    form      - 角色形态: graduation | live | CEO
    animation - 动画状态: idle | sing | dance | happy | bow
    size      - 渲染尺寸（rpx）
    autoPlay  - 是否自动播放动画

  Events:
    @frame    - 帧更新 (frameIndex, totalFrames)
    @ready    - 素材加载完成
    @error    - 素材加载失败
-->
<template>
  <view class="pixel-character" :style="containerStyle">
    <!-- Canvas 渲染层 -->
    <canvas
      :id="canvasId"
      type="2d"
      :style="canvasStyle"
      class="pixel-canvas"
      @touchstart="handleTouch"
    />

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-overlay">
      <text class="loading-text">✦</text>
    </view>

    <!-- 素材缺失提示 -->
    <view v-if="isPlaceholder && !loading" class="placeholder-badge">
      <text class="badge-text">等待素材</text>
    </view>
  </view>
</template>

<script>
import { AssetResolver, getAssetResolver } from '@/services/character-assets'
import { SpriteLoader, getSpriteLoader } from '@/services/character-sprites'

let _uidCounter = 0

export default {
  name: 'PixelCharacter',

  props: {
    form: {
      type: String,
      default: 'graduation',
      validator: v => ['graduation', 'live', 'CEO'].includes(v),
    },
    animation: {
      type: String,
      default: 'idle',
      validator: v => ['idle', 'sing', 'dance', 'happy', 'bow', 'emotion'].includes(v),
    },
    size: {
      type: Number,
      default: 400, // rpx
    },
    autoPlay: {
      type: Boolean,
      default: true,
    },
    fps: {
      type: Number,
      default: 8,
    },
    pixelScale: {
      type: Number,
      default: 3, // 像素放大倍数（越大越像素化）
    },
  },

  emits: ['frame', 'ready', 'error', 'tap'],

  data() {
    return {
      canvasId: `pixel-char-${++_uidCounter}`,
      loading: true,
      isPlaceholder: false,
      currentFrame: 0,
      totalFrames: 4,
      // Canvas 内部对象
      _canvas: null,
      _ctx: null,
      _sprite: null,
      _animTimer: null,
      _dpr: 1,
    }
  },

  computed: {
    containerStyle() {
      const px = this._rpx2px(this.size)
      return {
        width: `${px}px`,
        height: `${px}px`,
      }
    },
    canvasStyle() {
      const px = this._rpx2px(this.size)
      return {
        width: `${px}px`,
        height: `${px}px`,
      }
    },
  },

  watch: {
    form() { this._reload() },
    animation() { this._reload() },
    autoPlay(val) { val ? this._startAnimLoop() : this._stopAnimLoop() },
  },

  mounted() {
    this._dpr = uni.getSystemInfoSync?.()?.pixelRatio || 2
    this.$nextTick(() => {
      this._initCanvas()
    })
  },

  beforeUnmount() {
    this._stopAnimLoop()
    this._sprite = null
  },

  methods: {
    // ==================== 公开方法 ====================

    /** 强制重绘一帧 */
    drawFrame(frameIndex) {
      if (!this._ctx || !this._sprite) return
      this._renderFrame(frameIndex ?? this.currentFrame)
    },

    /** 获取 Canvas 上下文（供外部扩展） */
    getContext() {
      return this._ctx
    },

    /** 获取 Canvas 节点 */
    getCanvas() {
      return this._canvas
    },

    // ==================== 初始化 ====================

    async _initCanvas() {
      try {
        // 获取 Canvas 节点和上下文
        const query = uni.createSelectorQuery().in(this)
        const result = await new Promise((resolve) => {
          query.select(`#${this.canvasId}`).fields({ node: true, size: true }).exec(resolve)
        })

        const canvasNode = result?.[0]?.node
        if (!canvasNode) {
          console.error('[PixelCharacter] Canvas 节点获取失败')
          this.loading = false
          return
        }

        this._canvas = canvasNode
        const sizePx = this._rpx2px(this.size)

        // 设置 Canvas 实际分辨率（DPR 缩放保证清晰度）
        canvasNode.width = sizePx * this._dpr
        canvasNode.height = sizePx * this._dpr

        this._ctx = canvasNode.getContext('2d')
        // 关键：关闭平滑以保持像素风格
        this._ctx.imageSmoothingEnabled = false
        this._ctx.scale(this._dpr, this._dpr)

        // 加载素材
        await this._reload()
      } catch (e) {
        console.error('[PixelCharacter] 初始化失败:', e.message)
        this.loading = false
      }
    },

    // ==================== 素材加载 ====================

    async _reload() {
      this._stopAnimLoop()
      this.loading = true

      const resolver = getAssetResolver()
      const loader = getSpriteLoader()

      try {
        const resolved = resolver.resolve(this.form, this.animation)
        this._sprite = await loader.load(resolved)
        this.isPlaceholder = resolved.isPlaceholder
        this.totalFrames = this._sprite.config.frames

        this.loading = false
        this.$emit('ready', {
          form: this.form,
          animation: this.animation,
          isPlaceholder: this.isPlaceholder,
        })

        // 开始动画循环
        if (this.autoPlay) {
          this._startAnimLoop()
        } else {
          this._renderFrame(0)
        }
      } catch (e) {
        this.loading = false
        this.$emit('error', { message: e.message })
        console.error('[PixelCharacter] 素材加载失败:', e.message)
      }
    },

    // ==================== 动画循环 ====================

    _startAnimLoop() {
      this._stopAnimLoop()
      if (!this._sprite) return

      const config = this._sprite.config
      const interval = 1000 / (config.fps || this.fps)
      this.currentFrame = 0

      const animate = () => {
        if (!this._sprite || !this._ctx) return

        this._renderFrame(this.currentFrame)
        this.$emit('frame', this.currentFrame, this.totalFrames)

        this.currentFrame++
        if (this.currentFrame >= this.totalFrames) {
          if (config.loop !== false) {
            this.currentFrame = 0
          } else {
            this.currentFrame = this.totalFrames - 1
            return // 不循环，停在最后一帧
          }
        }

        this._animTimer = setTimeout(animate, interval)
      }

      animate()
    },

    _stopAnimLoop() {
      if (this._animTimer) {
        clearTimeout(this._animTimer)
        this._animTimer = null
      }
    },

    // ==================== Canvas 绘制 ====================

    _renderFrame(frameIndex) {
      const ctx = this._ctx
      if (!ctx || !this._sprite) return

      const sizePx = this._rpx2px(this.size)

      // 清空画布
      ctx.clearRect(0, 0, sizePx, sizePx)

      // 像素网格背景（可选：淡色辅助线）
      this._drawGrid(ctx, sizePx)

      // 绘制角色 Sprite
      const image = this._sprite.image
      const config = this._sprite.config

      if (image) {
        const loader = getSpriteLoader()
        const frameSrc = loader.getFrameSource(this._sprite, frameIndex)

        // 计算绘制位置（居中）
        const targetW = sizePx * 0.8
        const targetH = sizePx * 0.8
        const targetX = (sizePx - targetW) / 2
        const targetY = (sizePx - targetH) / 2

        try {
          ctx.drawImage(
            image,
            frameSrc.sx, frameSrc.sy, frameSrc.sw, frameSrc.sh,
            targetX, targetY, targetW, targetH
          )
        } catch (e) {
          // drawImage 可能因图片未就绪而失败
        }
      }

      // 绘制像素边框
      this._drawPixelBorder(ctx, sizePx)
    },

    /** 绘制像素网格（调试/风格化） */
    _drawGrid(ctx, size) {
      // 仅在占位模式下绘制网格
      if (!this.isPlaceholder) return
      const gridSize = size / 16
      ctx.strokeStyle = 'rgba(255,255,255,0.03)'
      ctx.lineWidth = 0.5
      for (let i = 0; i <= 16; i++) {
        ctx.beginPath()
        ctx.moveTo(i * gridSize, 0)
        ctx.lineTo(i * gridSize, size)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, i * gridSize)
        ctx.lineTo(size, i * gridSize)
        ctx.stroke()
      }
    },

    /** 绘制像素风格边框 */
    _drawPixelBorder(ctx, size) {
      ctx.strokeStyle = 'rgba(232, 184, 109, 0.2)'
      ctx.lineWidth = 2
      ctx.strokeRect(1, 1, size - 2, size - 2)
    },

    // ==================== 交互 ====================

    handleTouch() {
      this.$emit('tap')
    },

    // ==================== 工具 ====================

    /** rpx 转 px（近似） */
    _rpx2px(rpx) {
      const info = uni.getSystemInfoSync?.()
      const screenWidth = info?.screenWidth || 375
      return Math.round(rpx * screenWidth / 750)
    },
  },
}
</script>

<style lang="scss" scoped>
.pixel-character {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pixel-canvas {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;          // CSS 像素渲染
  image-rendering: crisp-edges;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 15, 35, 0.6);
}

.loading-text {
  font-size: 36rpx;
  color: $color-accent;
  animation: lunaTwinkle 1.5s ease-in-out infinite;
}

.placeholder-badge {
  position: absolute;
  bottom: 8rpx;
  right: 8rpx;
  padding: 4rpx 12rpx;
  background: rgba($color-warning, 0.2);
  border: 1px solid rgba($color-warning, 0.4);
  border-radius: 4rpx;

  .badge-text {
    font-size: 18rpx;
    color: $color-warning;
  }
}
</style>
