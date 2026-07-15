import type { CharacterState } from './character'

/** 动画指令 — 驱动一次动画播放 */
export interface AnimationCommand {
  state: CharacterState
  duration: number // ms
  loop: boolean
}

/** Sprite 精灵图配置 */
export interface SpriteConfig {
  name: string
  file: string
  frameWidth: number
  frameHeight: number
  frames: number
  fps: number
  loop: boolean
  description?: string
}

/** 角色切换过渡阶段 */
export type TransitionPhase = 'idle' | 'dissolve' | 'transition' | 'emerge' | 'complete'

/** 动画状态机转换规则表 */
export type TransitionMap = Record<CharacterState, CharacterState[]>

/** 动画状态变化事件 */
export interface AnimationEvent {
  from: CharacterState
  to: CharacterState
  reason: string
}

/** TransionEffect 粒子 */
export interface TransitionParticle {
  x: number
  y: number
  targetX?: number
  targetY?: number
  color: string
  size: number
  life: number
  vx?: number
  vy?: number
  rotation?: number
  rotSpeed?: number
  decay?: number
  glow?: number
  delay?: number
}

/** 星光粒子 */
export interface StarParticle {
  x: number
  y: number
  size: number
  speed: number
  color: string
  alpha: number
  twinkle: number
  wobble: number
  wobbleSpeed: number
}

/** 粒子系统配置 */
export interface ParticleSystemConfig {
  count: number
  baseSize: number
  speed: number
  colors: string[]
  twinkleSpeed: number
}
