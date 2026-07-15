/**
 * @luna/ai-engine — AI 人格引擎
 *
 * LUNA 的"灵魂"所在。包含人格定义、对话生成、记忆管理、成长系统。
 *
 * 核心组件:
 * - **Personality**: LUNA 的性格参数 (warm_music_dreamer)
 * - **DialogueEngine**: 场景驱动的对话生成，20+ 场景词库
 * - **MemorySystem**: 持久化记忆管理 (首次上传/常听歌曲/生日/留言)
 * - **GrowthSystem**: Lv1-Lv4 成长等级与解锁
 *
 * @example
 * ```ts
 * import { getDialogueEngine, getMemorySystem } from '@luna/ai-engine'
 *
 * const dialogue = getDialogueEngine()
 * dialogue.speak('greeting')  // → '今天想听什么歌？'
 *
 * const memory = getMemorySystem()
 * memory.add('milestone', { name: '第一次唱歌' })
 * ```
 *
 * @packageDocumentation
 */
export { LUNA_PERSONALITY, getLunaMood, getSpeakingParams } from './Personality'
export { DialogueEngine, getDialogueEngine, DIALOGUE_POOL } from './DialogueEngine'
export { MemorySystem, getMemorySystem, MemoryType } from './MemorySystem'
export { GrowthSystem, getGrowthSystem, LEVELS } from './GrowthSystem'

export type {
  Personality, MoodState, Memory, DialogueRecord, GrowthLevel,
  LevelUpEvent, DialogueContext, SpeakingParams,
} from '@luna/shared-types'
