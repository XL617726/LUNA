<!--
  LUNA · 星光歌姬 — AnimationController 动画控制器
  音乐驱动的角色动画状态机

  职责：
  1. 接收音频分析数据
  2. 驱动 AnimationStateMachine 状态转换
  3. 协调过渡特效
  4. 输出目标动画状态给 PixelCharacter

  Props:
    audioData   - AudioAnalyzer.result
    isPlaying   - 是否正在播放
    currentAnim - 当前角色动画状态（双向绑定）

  Events:
    @animation-change -> { from, to, reason }
-->
<template>
  <!-- 纯逻辑组件，无 UI 输出 -->
  <slot :animation="targetAnimation" :isTransitioning="isTransitioning" />
</template>

<script>
import { AnimationStateMachine, AnimationState, getStateMachine } from '@/services/animation'
import { useCharacterStore } from '@/stores/character'

export default {
  name: 'AnimationController',

  props: {
    audioData: {
      type: Object,
      default: () => ({
        bpm: 0,
        volume: 0,
        beat: false,
        energy: 0,
        isClimax: false,
      }),
    },
    isPlaying: {
      type: Boolean,
      default: false,
    },
    /** 是否启用音乐驱动（关闭时手动控制） */
    musicDriven: {
      type: Boolean,
      default: true,
    },
  },

  emits: [
    'animation-change', // { from, to, reason }
    'transition-start', // { from, to }
    'transition-end',   // { current }
    'beat',             // 节拍事件
    'climax',           // 高潮事件
  ],

  data() {
    return {
      targetAnimation: AnimationState.IDLE,
      isTransitioning: false,
      _stateMachine: null,
      _previousBeat: false,
      _previousClimax: false,
      _bowTimer: null,
      _debounceTimer: null,
    }
  },

  computed: {
    characterStore() {
      return useCharacterStore()
    },
  },

  watch: {
    audioData: {
      deep: true,
      handler(data) {
        if (!this.musicDriven || this.isTransitioning) return
        this._evaluateAudio(data)
      },
    },
    isPlaying(val) {
      if (!val) {
        this._onMusicStop()
      } else if (this.musicDriven) {
        this._onMusicStart()
      }
    },
  },

  created() {
    this._stateMachine = getStateMachine()

    // 监听状态转换
    this._stateMachine.onTransition((from, to) => {
      this.targetAnimation = to
      this.characterStore.setAnimationState(to)

      this.$emit('animation-change', {
        from, to,
        reason: 'state_machine',
      })
    })
  },

  beforeUnmount() {
    this._clearTimers()
  },

  methods: {
    // ==================== 公开方法 ====================

    /** 手动设置动画状态 */
    setAnimation(state, reason = 'manual') {
      if (this.isTransitioning) return false
      return this._stateMachine.transition(state, reason)
    },

    /** 强制重置到 idle */
    reset() {
      this._clearTimers()
      this._stateMachine.forceSetState(AnimationState.IDLE, 'reset')
      this.targetAnimation = AnimationState.IDLE
      this.isTransitioning = false
    },

    /** 获取当前状态 */
    getCurrentState() {
      return this._stateMachine.currentState
    },

    /** 执行状态切换过渡 */
    async performTransition(from, to, sourceImageData = null) {
      // 此方法在 Task06 CharacterSwitcher 中使用
      this.isTransitioning = true
      this.$emit('transition-start', { from, to })

      // 过渡时间由 Task06 组件处理 Canvas 动画
      // 这里仅发出事件

      this.isTransitioning = false
      this.$emit('transition-end', { current: to })
    },

    // ==================== 音频驱动逻辑 ====================

    _evaluateAudio(data) {
      const { volume, beat, isClimax } = data

      // 节拍事件
      if (beat && !this._previousBeat) {
        this.$emit('beat', data)
      }
      this._previousBeat = beat

      // 高潮事件
      if (isClimax && !this._previousClimax) {
        this.$emit('climax', data)
      }
      this._previousClimax = isClimax

      // 音乐驱动的状态判定
      const recommendedState = AnimationStateMachine.resolveFromAudio(
        data, this.isPlaying
      )

      // 防抖：避免状态频繁切换
      if (recommendedState !== this._stateMachine.currentState) {
        if (this._debounceTimer) return // 正在防抖中
        this._debounceTimer = setTimeout(() => {
          this._debounceTimer = null
          this._stateMachine.transition(recommendedState, 'audio_driven')
        }, 300) // 300ms 防抖
      }
    },

    _onMusicStart() {
      // 音乐开始 → idle → sing
      if (this._stateMachine.currentState === AnimationState.IDLE) {
        this._stateMachine.transition(AnimationState.SING, 'music_start')
      }
    },

    _onMusicStop() {
      // 音乐停止 → bow → idle
      const current = this._stateMachine.currentState
      if (current !== AnimationState.IDLE && current !== AnimationState.BOW) {
        this._stateMachine.transition(AnimationState.BOW, 'music_stop')

        // 2秒后自动回到 idle
        this._bowTimer = setTimeout(() => {
          this._stateMachine.transition(AnimationState.IDLE, 'bow_timeout')
        }, 2000)
      }
    },

    _clearTimers() {
      if (this._bowTimer) { clearTimeout(this._bowTimer); this._bowTimer = null }
      if (this._debounceTimer) { clearTimeout(this._debounceTimer); this._debounceTimer = null }
    },
  },
}
</script>

<style scoped>
/* 纯逻辑组件，无样式 */
</style>
