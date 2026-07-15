<!--
  LUNA · 星光歌姬 — CharacterSwitcher 角色形态切换器
  三种形态卡片 + 切换过渡动画

  切换流程：
  用户点击 → 像素碎片消散 → 星光过渡 → 新角色浮现
-->
<template>
  <view class="character-switcher">
    <!-- 过渡动画 Canvas -->
    <canvas
      v-if="isTransitioning"
      :id="transitionCanvasId"
      type="2d"
      class="transition-canvas"
    />

    <!-- 形态卡片列表 -->
    <view class="form-cards" v-if="!isTransitioning">
      <view
        v-for="form in forms"
        :key="form.id"
        class="form-card"
        :class="{
          active: currentForm === form.id,
          locked: !form.unlocked,
        }"
        @tap="handleSwitch(form)"
      >
        <!-- 卡片背景图 -->
        <view class="card-visual" :class="form.bgClass">
          <text class="card-icon-large">{{ form.icon }}</text>
        </view>

        <!-- 卡片信息 -->
        <view class="card-body">
          <text class="card-name">{{ form.name }}</text>
          <text class="card-theme">《{{ form.theme }}》</text>
          <view class="card-elements">
            <text
              v-for="elem in form.elements"
              :key="elem"
              class="element-tag"
            >{{ elem }}</text>
          </view>
        </view>

        <!-- 选中标记 -->
        <view v-if="currentForm === form.id" class="active-badge">
          <text>✦ 当前</text>
        </view>

        <!-- 锁定标记 -->
        <view v-if="!form.unlocked" class="lock-overlay">
          <text class="lock-icon">🔒</text>
          <text class="lock-text">{{ form.unlockHint }}</text>
        </view>
      </view>
    </view>

    <!-- 切换中状态 -->
    <view v-if="isTransitioning" class="switching-status">
      <text class="switching-text">✨ 变换中...</text>
      <text class="switching-phase">{{ phaseLabel }}</text>
    </view>
  </view>
</template>

<script>
import { SwitchTransition } from '@/services/animation-transitions'
import { useCharacterStore } from '@/stores/character'

let _uidCounter = 0

export default {
  name: 'CharacterSwitcher',

  props: {
    /** 角色 Canvas 上下文（用于获取旧形态像素数据） */
    characterCanvas: { type: Object, default: null },
  },

  emits: ['switch-start', 'switch-phase', 'switch-complete', 'switch-error'],

  data() {
    return {
      transitionCanvasId: `switch-cvs-${++_uidCounter}`,
      isTransitioning: false,
      currentPhase: 'idle',
      _transition: null,
      _transitionCanvas: null,
      _transitionCtx: null,

      forms: [
        {
          id: 'graduation',
          name: '🎓 毕业生',
          theme: '那个夏天',
          icon: '🎓',
          bgClass: 'bg-graduation',
          elements: ['学士服', '毕业帽', '花束', '校园'],
          unlocked: true,
          unlockHint: '',
        },
        {
          id: 'live',
          name: '🎤 女主播',
          theme: '第一次站上舞台',
          icon: '🎤',
          bgClass: 'bg-live',
          elements: ['直播间', '麦克风', '电脑', 'RGB灯'],
          unlocked: true,
          unlockHint: '',
        },
        {
          id: 'CEO',
          name: '💼 CEO',
          theme: '未来的自己',
          icon: '💼',
          bgClass: 'bg-ceo',
          elements: ['办公室', '城市夜景', '文件', '奖杯'],
          unlocked: true,
          unlockHint: '',
        },
      ],
    }
  },

  computed: {
    characterStore() { return useCharacterStore() },
    currentForm() { return this.characterStore.currentForm },
    phaseLabel() {
      const labels = {
        idle: '',
        dissolve: '碎片消散中...',
        transition: '星光凝聚中...',
        emerge: '角色浮现中...',
        complete: '完成!',
      }
      return labels[this.currentPhase] || ''
    },
  },

  beforeUnmount() {
    if (this._transition) this._transition.abort()
  },

  methods: {
    async handleSwitch(form) {
      if (this.isTransitioning) return
      if (form.id === this.currentForm) return
      if (!form.unlocked) {
        uni.showToast({ title: form.unlockHint || '尚未解锁', icon: 'none' })
        return
      }

      this.isTransitioning = true
      this.$emit('switch-start', { from: this.currentForm, to: form.id })

      try {
        // 初始化过渡 Canvas
        await this.$nextTick()
        await this._initTransitionCanvas()

        // 获取旧形态像素数据
        let sourceData = null
        if (this.characterCanvas) {
          try {
            const ctx = this.characterCanvas.getContext?.('2d')
            if (ctx) {
              sourceData = ctx.getImageData(0, 0, this.characterCanvas.width, this.characterCanvas.height)
            }
          } catch (_) {}
        }

        // 执行过渡
        this._transition = new SwitchTransition(this._transitionCtx, {
          width: this._transitionCanvas?.width || 400,
          height: this._transitionCanvas?.height || 400,
        })

        this._transition.onPhaseChange((phase) => {
          this.currentPhase = phase
          this.$emit('switch-phase', phase)
        })

        await this._transition.execute(sourceData, {
          dissolveDuration: 400,
          transitionDuration: 300,
          emergeDuration: 400,
        })

        // 切换形态
        this.characterStore.switchForm(form.id)

        this.$emit('switch-complete', { form: form.id })

        // 延迟隐藏过渡 Canvas
        setTimeout(() => {
          this.isTransitioning = false
          this.currentPhase = 'idle'
        }, 200)

      } catch (e) {
        console.error('[CharacterSwitcher] 切换失败:', e.message)
        this.isTransitioning = false
        this.$emit('switch-error', { message: e.message })

        // 降级：直接切换
        this.characterStore.switchForm(form.id)
      }
    },

    async _initTransitionCanvas() {
      const query = uni.createSelectorQuery().in(this)
      const result = await new Promise((resolve) => {
        query.select(`#${this.transitionCanvasId}`)
          .fields({ node: true, size: true })
          .exec(resolve)
      })

      const canvasNode = result?.[0]?.node
      if (!canvasNode) {
        console.warn('[CharacterSwitcher] 过渡 Canvas 初始化失败')
        return
      }

      const dpr = uni.getSystemInfoSync()?.pixelRatio || 2
      const sizePx = 400
      canvasNode.width = sizePx * dpr
      canvasNode.height = sizePx * dpr

      this._transitionCanvas = canvasNode
      this._transitionCtx = canvasNode.getContext('2d')
      this._transitionCtx.scale(dpr, dpr)
    },
  },
}
</script>

<style lang="scss" scoped>
.character-switcher {
  position: relative;
}

/* 过渡 Canvas */
.transition-canvas {
  width: 400rpx;
  height: 400rpx;
  margin: 0 auto;
}

/* 形态卡片 */
.form-cards {
  display: flex;
  flex-direction: column;
  gap: $space-lg;
}

.form-card {
  position: relative;
  border-radius: 16rpx;
  overflow: hidden;
  background: $color-bg-card;
  border: 2px solid transparent;
  transition: all $transition-normal;

  &.active {
    border-color: $color-accent;
    box-shadow: 0 0 32rpx rgba($color-accent, 0.12);
  }

  &.locked {
    opacity: 0.6;
  }

  &:not(.locked):active {
    transform: scale(0.98);
  }
}

/* 卡片视觉区 */
.card-visual {
  height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &.bg-graduation {
    background: linear-gradient(135deg, #1a3a5c, #2a5a8c);
  }
  &.bg-live {
    background: linear-gradient(135deg, #3a1a3a, #6a2a5a);
  }
  &.bg-ceo {
    background: linear-gradient(135deg, #1a1a2e, #2a2a4e);
  }
}
.card-icon-large {
  font-size: 80rpx;
}

/* 卡片信息 */
.card-body {
  padding: $space-md $space-lg;
}
.card-name {
  font-size: $font-size-lg;
  color: $color-text-primary;
  font-weight: 600;
}
.card-theme {
  display: block;
  font-size: $font-size-sm;
  color: $color-text-secondary;
  margin-top: 4rpx;
}
.card-elements {
  display: flex;
  flex-wrap: wrap;
  gap: $space-xs;
  margin-top: $space-sm;
}
.element-tag {
  padding: 2rpx 14rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4rpx;
  font-size: $font-size-xs;
  color: $color-text-muted;
}

/* 选中标记 */
.active-badge {
  position: absolute;
  top: $space-sm;
  right: $space-sm;
  padding: 4rpx 16rpx;
  background: $color-accent;
  border-radius: 20rpx;

  text {
    font-size: $font-size-xs;
    color: $color-bg-primary;
  }
}

/* 锁定 */
.lock-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  gap: $space-xs;
}
.lock-icon { font-size: 48rpx; }
.lock-text { font-size: $font-size-xs; color: $color-text-muted; }

/* 切换状态 */
.switching-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $space-xl;
  gap: $space-sm;
}
.switching-text {
  font-size: $font-size-lg;
  color: $color-accent;
  animation: lunaTwinkle 1.5s ease-in-out infinite;
}
.switching-phase {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}
</style>
