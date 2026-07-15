/** 角色动画状态 — 动画状态机唯一定义 */
export type CharacterState = 'idle' | 'sing' | 'dance' | 'happy' | 'bow'

/** 角色形态 — 三种身份 */
export type CharacterForm = 'graduation' | 'live' | 'CEO'

/** LUNA 角色档案 */
export interface CharacterProfile {
  readonly id: string
  readonly name: string
  readonly avatar: string
  readonly personality: string[]
  currentForm: CharacterForm
  currentState: CharacterState
  level: number
  levelTitle: string
}

/** 角色形态配置 */
export interface CharacterOutfit {
  id: CharacterForm
  name: string
  theme: string
  scene: CharacterScene
  elements: string[]
  spritePath: string
  unlocked: boolean
}

/** 场景标识 */
export type CharacterScene = 'school' | 'live' | 'office'

/** 角色解锁内容 */
export interface CharacterUnlocks {
  actions: string[]
  voices: string[]
  scenes: string[]
  stories: string[]
}

/** 角色互动统计 */
export interface CharacterStats {
  totalPlays: number
  totalSongs: number
  interactionDays: number
  lastInteraction: string | null
}

/** 角色引擎序列化格式 */
export interface CharacterSnapshot {
  profile: CharacterProfile
  currentForm: CharacterForm
  currentState: CharacterState
  level: number
  stats: CharacterStats
  unlocked: CharacterUnlocks
}

/** 动画状态转换规则表 */
export type ValidTransitions = Record<CharacterState, CharacterState[]>
