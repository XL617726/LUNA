/**
 * LUNA · 星光歌姬 — 成长系统
 *
 * 等级:
 *   Lv1 初见     — 首次打开
 *   Lv2 熟悉     — 累计播放10首
 *   Lv3 朋友     — 累计30天互动
 *   Lv4 星光伙伴  — 隐藏条件
 *
 * 成长解锁:
 *   - 新动作
 *   - 新语音
 *   - 新场景
 *   - 新剧情
 */

import { getCharacterEngine } from '../../character-engine/src/CharacterEngine'
import { getMemorySystem } from './MemorySystem'
import { getDialogueEngine } from './DialogueEngine'

/**
 * 等级定义
 */
export const LEVELS = {
  1: {
    name: '初见',
    title: '第一次相遇',
    description: '欢迎来到 LUNA 的音乐世界',
    requirements: { interactionDays: 0 },
    unlocks: {
      actions: ['idle', 'sing'],
      voices: ['greeting'],
      scenes: ['school'],
      stories: [],
    },
  },
  2: {
    name: '熟悉',
    title: '渐渐了解彼此',
    description: '你越来越了解我的旋律',
    requirements: { interactionDays: 10 },
    unlocks: {
      actions: ['dance'],
      voices: ['music_play', 'upload'],
      scenes: ['live'],
      stories: ['first_song'],
    },
  },
  3: {
    name: '朋友',
    title: '重要的朋友',
    description: '谢谢你一直在我身边',
    requirements: { interactionDays: 30 },
    unlocks: {
      actions: ['happy'],
      voices: ['memory', 'night'],
      scenes: ['office'],
      stories: ['night_visit'],
    },
  },
  4: {
    name: '星光伙伴',
    title: '最闪耀的伙伴',
    description: '你是我心中最亮的星',
    requirements: { interactionDays: 100, hiddenSongUnlocked: true },
    unlocks: {
      actions: ['bow'],
      voices: ['birthday', 'easter_egg_hidden_song'],
      scenes: [], // 全场景已解锁
      stories: ['ten_songs', 'birthday'],
    },
  },
}

/**
 * 成长系统
 */
export class GrowthSystem {
  constructor() {
    this._levelUpHandlers = []
  }

  /**
   * 检查并处理升级
   * @param {Object} stats - characterStore.stats
   * @returns {{ leveledUp: boolean, from: number, to: number, unlocks: Object } | null}
   */
  checkLevelUp(stats: { interactionDays: number }) {
    const engine = getCharacterEngine()
    const currentLevel = engine.level

    let newLevel = currentLevel

    // 逐级检查
    for (const [lvl, def] of Object.entries(LEVELS)) {
      const lvlNum = parseInt(lvl)
      if (lvlNum <= currentLevel) continue

      const req = def.requirements as { interactionDays?: number }
      const meets = stats.interactionDays >= (req.interactionDays || 0)

      if (meets) {
        newLevel = Math.max(newLevel, lvlNum)
      }
    }

    if (newLevel > currentLevel) {
      const fromLevel = currentLevel
      const unlocks = (LEVELS as any)[newLevel].unlocks

      // 应用解锁
      this._applyUnlocks(engine, unlocks, newLevel)

      // 触发升级对话
      const dialogue = getDialogueEngine()
      const msg = dialogue.speak(`level_${newLevel}`)

      // 通知处理器
      for (const handler of this._levelUpHandlers) {
        handler({ from: fromLevel, to: newLevel, unlocks, message: msg })
      }

      return {
        leveledUp: true,
        from: fromLevel,
        to: newLevel,
        unlocks,
        message: msg,
      }
    }

    return null
  }

  /**
   * 注册升级回调
   */
  onLevelUp(handler) {
    this._levelUpHandlers.push(handler)
  }

  /**
   * 获取下一级信息
   */
  getNextLevel(currentLevel) {
    if (currentLevel >= 4) return null
    return LEVELS[currentLevel + 1]
  }

  /**
   * 获取等级详情
   */
  getLevelInfo(level) {
    return LEVELS[level] || LEVELS[1]
  }

  // ==================== 私有方法 ====================

  _applyUnlocks(engine: ReturnType<typeof getCharacterEngine>, unlocks: { actions: string[], voices: string[], scenes: string[], stories: string[] }, _level: number) {
    engine.unlockActions(unlocks.actions)
  }
}

/** 单例 */
let instance = null
export function getGrowthSystem() {
  if (!instance) {
    instance = new GrowthSystem()
  }
  return instance
}

export default GrowthSystem
