/**
 * @luna/shared-types — 全局类型定义
 *
 * 所有 packages 和 apps 共享的纯类型接口。
 * 零运行时依赖，仅包含 type/interface/enum。
 */

// === 角色 ===
export type {
  CharacterState,
  CharacterForm,
  CharacterProfile,
  CharacterOutfit,
  CharacterUnlocks,
  CharacterStats,
} from './character'

// === 动画 ===
export type {
  AnimationCommand,
  SpriteConfig,
  TransitionPhase,
  TransitionMap,
  AnimationEvent,
} from './animation'

// === 音频 ===
export type {
  AudioAnalysisResult,
  AudioAnalyzerConfig,
  PlayMode,
} from './audio'

// === AI ===
export type {
  Personality,
  MoodState,
  Memory,
  DialogueRecord,
  GrowthLevel,
} from './ai'

// === 剧情 ===
export type {
  StoryChapter,
  StoryContext,
} from './story'

// === 音乐 ===
export type {
  Song,
  UploadTask,
} from './music'

// === 用户 ===
export type {
  UserProfile,
} from './user'

// === 记忆 ===
export type {
  MemoryItem,
  GrowthRecord,
} from './memory'

// === 引擎通用 ===
/** 单例工厂类型 */
export interface Singleton<T> {
  getInstance(): T
}

/** 可序列化接口 */
export interface Serializable {
  toJSON(): Record<string, unknown>
  fromJSON(data: Record<string, unknown>): void
}

/** 存储键值对 */
export type StorageData = Record<string, unknown>

/** 带 ID 的实体基类 */
export interface Entity {
  id: string
  createdAt: string
  updatedAt?: string
}
