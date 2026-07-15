/**
 * LUNA · 星光歌姬 — 隐藏剧情系统
 *
 * 彩蛋触发条件：
 * - 第一次打开 → "你好，我等你很久了。"
 * - 夜晚(20:00-06:00) → 特殊语音
 * - 生日 → 生日场景
 * - 连续播放10首 → 解锁隐藏歌曲
 * - 星星按钮 → 显示制作人留言
 */

import { getMemorySystem } from './ai-memory'
import { getDialogueEngine } from './ai-dialogue'
import { foundEasterEgg } from './storage'

/**
 * 剧情/彩蛋定义
 */
export const STORIES = {
  first_meet: {
    id: 'first_meet',
    name: '初遇',
    icon: '🌟',
    description: '第一次打开小程序',
    trigger: 'firstLaunch',
    dialogue: '你好，我等你很久了。',
  },
  first_song: {
    id: 'first_song',
    name: '第一首歌',
    icon: '🎵',
    description: '上传第一首歌曲',
    trigger: 'firstUpload',
    dialogue: '这是我们的第一首歌，我会永远记得。',
  },
  ten_songs: {
    id: 'ten_songs',
    name: '音乐马拉松',
    icon: '🏆',
    description: '连续播放10首歌',
    trigger: 'consecutivePlays',
    threshold: 10,
    dialogue: '隐藏歌曲已解锁！专属你的旋律 🎵',
  },
  birthday: {
    id: 'birthday',
    name: '生日快乐',
    icon: '🎂',
    description: '在生日那天打开',
    trigger: 'birthday',
    dialogue: '生日快乐！今天我是你的专属歌手 🎂',
  },
  night_visit: {
    id: 'night_visit',
    name: '深夜访客',
    icon: '🌙',
    description: '在深夜打开（22:00-06:00）',
    trigger: 'nightTime',
    dialogue: '这么晚了还来看我...谢谢你。',
  },
  hidden_star: {
    id: 'hidden_star',
    name: '制作人留言',
    icon: '⭐',
    description: '点击首页的星星按钮',
    trigger: 'starButton',
    dialogue: '致我最好的朋友——愿LUNA的歌声，陪你度过每一个重要的日子。',
  },
}

/**
 * 剧情触发器
 */
export class StorySystem {
  constructor() {
    this._triggeredStories = new Set()
  }

  /**
   * 检查所有可触发的剧情
   * @param {Object} context - { isFirstLaunch, isNightTime, consecutivePlays, isBirthday }
   * @returns {Array<{ story: Object, dialogue: string }>}
   */
  checkTriggers(context = {}) {
    const triggered = []

    // 首次启动
    if (context.isFirstLaunch && !this._triggeredStories.has('first_meet')) {
      const result = this._trigger('first_meet')
      if (result) triggered.push(result)
    }

    // 首次上传
    if (context.firstUpload && !this._triggeredStories.has('first_song')) {
      const result = this._trigger('first_song')
      if (result) triggered.push(result)
    }

    // 连续播放
    if (context.consecutivePlays >= 10 && !this._triggeredStories.has('ten_songs')) {
      const result = this._trigger('ten_songs')
      if (result) triggered.push(result)
    }

    // 生日
    if (context.isBirthday && !this._triggeredStories.has('birthday')) {
      const result = this._trigger('birthday')
      if (result) triggered.push(result)
    }

    // 夜间
    if (context.isNightTime && !this._triggeredStories.has('night_visit')) {
      const result = this._trigger('night_visit')
      if (result) triggered.push(result)
    }

    return triggered
  }

  /**
   * 手动触发剧情（如星星按钮）
   */
  triggerStory(storyId) {
    if (this._triggeredStories.has(storyId)) {
      // 已触发过，仍可查看
      const story = STORIES[storyId]
      return { story, dialogue: story.dialogue, isRepeat: true }
    }
    return this._trigger(storyId)
  }

  /**
   * 获取已解锁的剧情列表
   */
  getUnlockedStories() {
    return Object.values(STORIES)
      .filter(s => this._triggeredStories.has(s.id))
      .map(s => ({ ...s, unlockedAt: Date.now() }))
  }

  /**
   * 获取所有剧情（含未解锁）
   */
  getAllStories() {
    return Object.values(STORIES).map(s => ({
      ...s,
      unlocked: this._triggeredStories.has(s.id),
    }))
  }

  // ==================== 私有方法 ====================

  _trigger(storyId) {
    const story = STORIES[storyId]
    if (!story) return null

    this._triggeredStories.add(storyId)

    // 记录彩蛋
    foundEasterEgg(storyId)

    // 添加到记忆
    const memory = getMemorySystem()
    memory.add('easter_egg', { storyId, name: story.name })

    const dialogue = getDialogueEngine()
    const msg = dialogue.speak(`easter_egg_${storyId}`)

    return { story, dialogue: msg, isRepeat: false }
  }
}

/** 单例 */
let instance = null
export function getStorySystem() {
  if (!instance) {
    instance = new StorySystem()
  }
  return instance
}

export default StorySystem
