/**
 * LUNA · 星光歌姬 — 动画状态机
 *
 * 管理角色动画状态转换，禁止随机动画。
 * 所有状态切换必须有明确的触发条件。
 *
 * 状态图:
 *   idle ──[音乐播放]──→ sing
 *   sing ──[BPM>110]───→ dance
 *   dance ──[高潮段落]──→ happy
 *   happy ──[音乐结束]──→ bow
 *   bow ──[2s后]───────→ idle
 *
 *   任意状态 ──[音乐停止]──→ bow → idle
 */

/** 动画状态枚举 */
export const AnimationState = Object.freeze({
  IDLE: 'idle',
  SING: 'sing',
  DANCE: 'dance',
  HAPPY: 'happy',
  BOW: 'bow',
})

/** 状态转换规则表 */
const TRANSITIONS = {
  [AnimationState.IDLE]: [AnimationState.SING],
  [AnimationState.SING]: [AnimationState.IDLE, AnimationState.DANCE, AnimationState.HAPPY, AnimationState.BOW],
  [AnimationState.DANCE]: [AnimationState.SING, AnimationState.HAPPY, AnimationState.BOW],
  [AnimationState.HAPPY]: [AnimationState.SING, AnimationState.BOW],
  [AnimationState.BOW]: [AnimationState.IDLE],
}

/**
 * 动画状态机类
 */
export class AnimationStateMachine {
  constructor(initialState = AnimationState.IDLE) {
    this.currentState = initialState
    this.previousState = null
    this.stateStartTime = Date.now()
    this.stateDuration = 0

    // 状态回调
    this._callbacks = {
      onTransition: null,  // (from, to) => void
      onEnter: {},         // { [state]: () => void }
      onExit: {},          // { [state]: () => void }
    }
  }

  /**
   * 注册状态进入回调
   */
  onEnter(state, callback) {
    this._callbacks.onEnter[state] = callback
    return this
  }

  /**
   * 注册状态退出回调
   */
  onExit(state, callback) {
    this._callbacks.onExit[state] = callback
    return this
  }

  /**
   * 注册状态转换回调
   */
  onTransition(callback) {
    this._callbacks.onTransition = callback
    return this
  }

  /**
   * 尝试切换到目标状态
   * @param {string} targetState - 目标状态
   * @param {string} reason - 切换原因（用于调试）
   * @returns {boolean} 是否成功切换
   */
  transition(targetState, reason = '') {
    // 相同状态，刷新计时
    if (targetState === this.currentState) {
      this.stateStartTime = Date.now()
      return false
    }

    // 检查是否是有效转换
    const validTargets = TRANSITIONS[this.currentState]
    if (!validTargets || !validTargets.includes(targetState)) {
      console.warn(
        `[StateMachine] 非法状态转换: ${this.currentState} → ${targetState}` +
        (reason ? ` (原因: ${reason})` : '')
      )
      return false
    }

    const from = this.currentState
    const to = targetState

    // 退出当前状态
    if (this._callbacks.onExit[from]) {
      this._callbacks.onExit[from]()
    }

    // 执行转换
    this.previousState = from
    this.currentState = to
    this.stateStartTime = Date.now()

    // 进入新状态
    if (this._callbacks.onEnter[to]) {
      this._callbacks.onEnter[to]()
    }

    // 通知转换
    if (this._callbacks.onTransition) {
      this._callbacks.onTransition(from, to)
    }

    console.log(`[StateMachine] ${from} → ${to}${reason ? ` (${reason})` : ''}`)
    return true
  }

  /**
   * 强制设置状态（跳过验证，仅用于初始化或错误恢复）
   */
  forceSetState(state, reason = 'force') {
    const from = this.currentState
    this.previousState = from
    this.currentState = state
    this.stateStartTime = Date.now()
    console.log(`[StateMachine] 强制设置: ${from} → ${state} (${reason})`)
  }

  /**
   * 获取当前状态持续时间（毫秒）
   */
  getStateDuration() {
    return Date.now() - this.stateStartTime
  }

  /**
   * 音乐驱动的状态判定
   * 根据音频分析结果，返回建议的目标状态
   * @param {Object} audioData - AudioAnalyzer.result
   * @returns {string} 建议状态
   */
  static resolveFromAudio(audioData, isPlaying) {
    if (!isPlaying) return AnimationState.IDLE

    const { volume, bpm, isClimax } = audioData

    if (volume < 0.05) return AnimationState.IDLE
    if (isClimax) return AnimationState.HAPPY
    if (bpm > 110) return AnimationState.DANCE
    return AnimationState.SING
  }
}

/** 创建单例 */
let instance = null
export function getStateMachine() {
  if (!instance) {
    instance = new AnimationStateMachine()
  }
  return instance
}

export default AnimationStateMachine
