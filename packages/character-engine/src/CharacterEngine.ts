/**
 * CharacterEngine — 角色核心引擎
 *
 * 管理 LUNA 的角色档案、形态切换、状态流转。
 * 平台无关，纯逻辑层。
 */
import type { CharacterForm, CharacterState, CharacterOutfit, CharacterStats, CharacterUnlocks } from '@luna/shared-types'

/** 三种形态定义 */
const OUTFITS: Record<CharacterForm, Omit<CharacterOutfit, 'unlocked'>> = {
  graduation: {
    id: 'graduation', name: '🎓 毕业生', theme: '那个夏天', scene: 'school',
    elements: ['学士服', '毕业帽', '花束', '校园'], spritePath: '/characters/LUNA/graduation',
  },
  live: {
    id: 'live', name: '🎤 女主播', theme: '第一次站上舞台', scene: 'live',
    elements: ['直播间', '麦克风', '电脑', 'RGB灯'], spritePath: '/characters/LUNA/live',
  },
  CEO: {
    id: 'CEO', name: '💼 CEO', theme: '未来的自己', scene: 'office',
    elements: ['办公室', '城市夜景', '文件', '奖杯'], spritePath: '/characters/LUNA/CEO',
  },
}

/** 成长等级 */
const LEVELS: Record<number, { name: string; title: string }> = {
  1: { name: '初见', title: '第一次相遇' },
  2: { name: '熟悉', title: '渐渐了解彼此' },
  3: { name: '朋友', title: '重要的朋友' },
  4: { name: '星光伙伴', title: '最闪耀的伙伴' },
}

export class CharacterEngine {
  // 角色档案
  readonly profile = {
    id: 'LUNA-001',
    name: 'LUNA',
    personality: ['温柔', '活泼', '怀旧', '梦想'],
  }

  // 状态
  private _currentForm: CharacterForm = 'graduation'
  private _currentState: CharacterState = 'idle'
  private _level = 1
  private _stats: CharacterStats = {
    totalPlays: 0, totalSongs: 0, interactionDays: 0, lastInteraction: null,
  }
  private _unlocked: CharacterUnlocks = {
    actions: ['idle', 'sing'], voices: [], scenes: ['school'], stories: [],
  }

  // ==================== 形态 ====================

  get currentForm(): CharacterForm { return this._currentForm }

  getFormInfo(): CharacterOutfit {
    return { ...OUTFITS[this._currentForm], unlocked: true }
  }

  getAllForms(): CharacterOutfit[] {
    return Object.values(OUTFITS).map(o => ({
      ...o, unlocked: this._unlocked.scenes.includes(o.scene),
    }))
  }

  switchForm(form: CharacterForm): boolean {
    if (!OUTFITS[form]) return false
    this._currentForm = form
    return true
  }

  // ==================== 状态 ====================

  get currentState(): CharacterState { return this._currentState }

  setState(state: CharacterState, reason = 'manual'): boolean {
    const validTransitions: Record<CharacterState, CharacterState[]> = {
      idle: ['sing'], sing: ['dance', 'happy', 'bow', 'idle'],
      dance: ['happy', 'sing', 'bow'], happy: ['bow', 'sing'], bow: ['idle'],
    }
    if (state !== this._currentState && !validTransitions[this._currentState]?.includes(state)) {
      console.warn(`[CharacterEngine] 非法状态转换: ${this._currentState} → ${state}`)
      return false
    }
    this._currentState = state
    return true
  }

  // ==================== 等级 ====================

  get level(): number { return this._level }
  get levelTitle(): string { return LEVELS[this._level]?.name || '初见' }

  checkLevelUp(): { leveledUp: boolean; from: number; to: number } | null {
    const thresholds = { 2: 10, 3: 30, 4: 100 }
    let newLevel = this._level
    for (const [lvl, threshold] of Object.entries(thresholds)) {
      if (this._stats.interactionDays >= threshold) newLevel = Math.max(newLevel, parseInt(lvl))
    }
    if (newLevel > this._level) {
      const from = this._level
      this._level = newLevel
      return { leveledUp: true, from, to: newLevel }
    }
    return null
  }

  // ==================== 统计 ====================

  get stats(): CharacterStats { return { ...this._stats } }
  get unlocked(): CharacterUnlocks { return { ...this._unlocked } }

  recordInteraction(): void {
    const today = new Date().toDateString()
    if (this._stats.lastInteraction !== today) {
      this._stats.interactionDays++
      this._stats.lastInteraction = today
    }
  }

  recordPlay(): void { this._stats.totalPlays++ }
  recordSong(): void { this._stats.totalSongs++ }

  unlockActions(actions: string[]): void {
    this._unlocked.actions = [...new Set([...this._unlocked.actions, ...actions])]
  }

  // ==================== 序列化 ====================

  toJSON() {
    return {
      profile: this.profile, currentForm: this._currentForm, currentState: this._currentState,
      level: this._level, stats: this._stats, unlocked: this._unlocked,
    }
  }

  fromJSON(data: Record<string, unknown>): void {
    if (data.currentForm) this._currentForm = data.currentForm as CharacterForm
    if (data.currentState) this._currentState = data.currentState as CharacterState
    if (data.level) this._level = data.level as number
    if (data.stats) this._stats = data.stats as CharacterStats
    if (data.unlocked) this._unlocked = data.unlocked as CharacterUnlocks
  }
}

let instance: CharacterEngine | null = null
export function getCharacterEngine(): CharacterEngine {
  if (!instance) instance = new CharacterEngine()
  return instance
}
