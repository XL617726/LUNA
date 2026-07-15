/**
 * @luna/animation-engine — 动画引擎
 *
 * 音乐驱动的角色动画系统。核心是禁止随机动画的确定性状态机。
 *
 * 状态流转: idle → sing → dance → happy → bow → idle
 * 所有转换必须由音频分析数据或显式指令触发。
 *
 * @example
 * ```ts
 * import { AnimationStateMachine, AnimationState } from '@luna/animation-engine'
 * const sm = new AnimationStateMachine()
 * sm.transition(AnimationState.SING, 'music_start')  // idle → sing
 * sm.transition(AnimationState.DANCE, 'bpm_high')     // sing → dance
 * ```
 *
 * @packageDocumentation
 */
export { AnimationStateMachine, AnimationState, getStateMachine } from './AnimationStateMachine'
export { TransitionEffects } from './TransitionEffects'
export { ParticleSystem } from './ParticleSystem'

export type {
  AnimationCommand, AnimationEvent, SpriteConfig,
  TransitionPhase, TransitionMap,
} from '@luna/shared-types'
