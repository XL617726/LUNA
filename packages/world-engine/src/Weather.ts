/**
 * WeatherSystem — 天气系统
 * 根据时间和随机因素切换天气，影响粒子特效和场景氛围
 */
import type { WeatherState } from './types'

export class WeatherSystem {
  private _current: WeatherState = { type: 'clear', intensity: 0, particles: false }
  private _timer: any = null

  get current(): WeatherState { return this._current }

  /** 根据时间和随机因素计算天气 */
  update(hour: number): WeatherState {
    // 夜间有概率出现星雨
    if (hour >= 20 || hour <= 5) {
      if (Math.random() < 0.15) {
        this._current = { type: 'starfall', intensity: 0.3 + Math.random() * 0.4, particles: true }
        return this._current
      }
    }
    // 雨天概率（午后较高）
    if (hour >= 14 && hour <= 18 && Math.random() < 0.08) {
      this._current = { type: 'rain', intensity: 0.3 + Math.random() * 0.5, particles: true }
      return this._current
    }
    // 默认晴天
    this._current = { type: 'clear', intensity: 0, particles: false }
    return this._current
  }

  /** 手动设置天气 */
  set(type: WeatherState['type'], intensity = 0.5) {
    this._current = { type, intensity, particles: intensity > 0 }
  }

  /** 获取对应的粒子效果配置 */
  getParticleConfig(): { color: string; speed: number; count: number } | null {
    switch (this._current.type) {
      case 'starfall': return { color: '#ffd700', speed: 0.5, count: 30 }
      case 'rain': return { color: '#87ceeb', speed: 2, count: 60 }
      case 'snow': return { color: '#ffffff', speed: 0.3, count: 40 }
      default: return null
    }
  }
}
