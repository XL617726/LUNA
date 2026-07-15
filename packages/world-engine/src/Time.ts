/**
 * TimeSystem — 游戏内时间系统
 * 跟踪时间变化，触发时段切换事件
 */
import type { TimeState } from './types'

export class TimeSystem {
  private _state: TimeState
  private _interval: any = null
  private _onPeriodChange: Array<(from: string, to: string) => void> = []

  constructor() {
    this._state = this._compute()
  }

  get state(): TimeState { return this._state }

  /** 启动时间轮询（每分钟检查一次） */
  start() {
    this._interval = setInterval(() => {
      const prev = this._state.period
      this._state = this._compute()
      if (prev !== this._state.period) {
        this._onPeriodChange.forEach(fn => fn(prev, this._state.period))
      }
    }, 60000)
  }

  stop() { if (this._interval) { clearInterval(this._interval); this._interval = null } }

  /** 检查是否夜间（彩蛋触发） */
  get isNightTime(): boolean { return this._state.isNightTime }

  /** 获取当前时段 */
  get period(): string { return this._state.period }

  onPeriodChange(fn: (from: string, to: string) => void) { this._onPeriodChange.push(fn) }

  private _compute(): TimeState {
    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()
    let period: TimeState['period']
    if (hour >= 5 && hour < 8) period = 'dawn'
    else if (hour >= 8 && hour < 12) period = 'morning'
    else if (hour >= 12 && hour < 17) period = 'afternoon'
    else if (hour >= 17 && hour < 20) period = 'evening'
    else period = 'night'
    return { hour, minute, period, isNightTime: period === 'night' }
  }
}
