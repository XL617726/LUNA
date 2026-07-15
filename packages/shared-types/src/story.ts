/** 剧情/彩蛋定义 */
export interface StoryChapter {
  id: string
  name: string
  icon: string
  description: string
  trigger: StoryTrigger
  dialogue: string
  unlocked: boolean
  threshold?: number
}

/** 剧情触发类型 */
export type StoryTrigger = 'firstLaunch' | 'firstUpload' | 'consecutivePlays' | 'birthday' | 'nightTime' | 'starButton'

/** 剧情触发上下文 */
export interface StoryContext {
  isFirstLaunch: boolean
  isNightTime: boolean
  isBirthday: boolean
  consecutivePlays: number
  firstUpload: boolean
}

/** 剧情触发结果 */
export interface StoryTriggerResult {
  story: StoryChapter
  dialogue: string
  isRepeat: boolean
}
