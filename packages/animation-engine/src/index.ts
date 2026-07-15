/**
 * @luna/animation-engine — 动画引擎
 *
 * 负责："她怎么动"
 * - 动画状态机（禁止随机动画）
 * - 过渡特效（像素碎片消散 / 星光凝聚）
 * - 粒子系统
 *
 * 所有客户端共享同一套动画逻辑。
 */
export { AnimationStateMachine, AnimationState, getStateMachine } from './AnimationStateMachine'
export { TransitionEffects } from './TransitionEffects'
export { ParticleSystem } from './ParticleSystem'
export type { AnimationCommand, AnimationEvent, SpriteConfig, TransitionPhase, TransitionMap } from '@luna/shared-types'
