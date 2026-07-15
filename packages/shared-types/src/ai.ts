/** AI 人格配置 */
export interface Personality {
  id: string
  name: string
  nameCN: string
  traits: {
    warmth: number
    energy: number
    nostalgia: number
    dream: number
  }
  speakingStyle: {
    maxLength: number
    prefersShortSentence: boolean
    usesEmoji: boolean
    tone: string
    avoidsTopics: string[]
  }
  tones: Record<string, string>
  coreIdentity: {
    creator: string
    createdAt: string
    mission: string
  }
}

/** 情绪状态 */
export interface MoodState {
  mood: 'quiet' | 'warm' | 'excited' | 'intimate' | 'gentle'
  intensity: number
  label: string
}

/** 说话参数 */
export interface SpeakingParams {
  maxLength: number
  emojiFrequency: 'low' | 'medium' | 'high'
  warmthBoost: number
  energyModifier: number
}

/** 记忆条目 */
export interface Memory {
  id: string
  type: 'music' | 'story' | 'interaction' | 'milestone' | 'easter_egg' | 'first_upload' | 'favorite_song' | 'birthday' | 'special_message'
  content: string
  data?: Record<string, unknown>
  timestamp: string
}

/** 记忆类型枚举 */
export const MemoryType = {
  FIRST_UPLOAD: 'first_upload' as const,
  FAVORITE_SONG: 'favorite_song' as const,
  BIRTHDAY: 'birthday' as const,
  SPECIAL_MESSAGE: 'special_message' as const,
  MILESTONE: 'milestone' as const,
  EASTER_EGG: 'easter_egg' as const,
} as const
export type MemoryType = typeof MemoryType[keyof typeof MemoryType]

/** 对话记录 */
export interface DialogueRecord {
  scene: string
  sentence: string
  time: number
}

/** 成长等级定义 */
export interface GrowthLevel {
  name: string
  title: string
  description: string
  requirements: Record<string, number>
  unlocks: {
    actions: string[]
    voices: string[]
    scenes: string[]
    stories: string[]
  }
}

/** 升级事件 */
export interface LevelUpEvent {
  from: number
  to: number
  unlocks: GrowthLevel['unlocks']
  message: string
}

/** AI 对话上下文 */
export interface DialogueContext {
  isPlaying?: boolean
  energy?: number
  interactionDays?: number
  level?: number
  mood?: string
}
