/**
 * @luna/ai-engine — AI 人格引擎
 *
 * 负责："她是什么性格"
 * - LUNA 人格定义（warm_music_dreamer）
 * - 场景对话引擎
 * - 记忆系统
 * - 成长系统（Lv1-Lv4）
 */
export { LUNA_PERSONALITY, getLunaMood, getSpeakingParams } from './Personality'
export { DialogueEngine, getDialogueEngine, DIALOGUE_POOL } from './DialogueEngine'
export { MemorySystem, getMemorySystem, MemoryType } from './MemorySystem'
export { GrowthSystem, getGrowthSystem, LEVELS } from './GrowthSystem'
export type { Personality, MoodState, Memory, DialogueRecord, GrowthLevel } from '@luna/shared-types'
