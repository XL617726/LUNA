/**
 * ParticleSystem — PixiJS 粒子系统
 * 星光、特效、天气粒子
 */
import type { ParticleConfig } from './types'

export class ParticleSystem {
  private _emitters: Map<string, any> = new Map() // id → PIXI.ParticleContainer
  private _active = false

  /** 创建粒子发射器 */
  createEmitter(id: string, config: ParticleConfig) {
    // 生产环境：使用 @pixi/particle-emitter
    // const emitter = new particles.Emitter(container, config)
    this._emitters.set(id, { config, active: false })
  }

  /** 开始发射 */
  start(id: string) {
    const emitter = this._emitters.get(id)
    if (emitter) { emitter.active = true; this._active = true }
  }

  /** 停止发射 */
  stop(id: string) {
    const emitter = this._emitters.get(id)
    if (emitter) { emitter.active = false; this._active = [...this._emitters.values()].some(e => e.active) }
  }

  /** 更新所有粒子 */
  update(delta: number) {
    if (!this._active) return
    for (const [, emitter] of this._emitters) {
      if (emitter.active) emitter.update?.(delta)
    }
  }

  /** 预设：星光粒子 */
  createStarfield(count = 40) {
    this.createEmitter('starfield', {
      texture: 'star', count,
      speed: { min: 0.1, max: 0.3 },
      lifetime: { min: 3000, max: 8000 },
      alpha: { start: 0.6, end: 0 },
      scale: { start: 1, end: 0.3 },
      color: ['#ffd700', '#ffffff', '#87ceeb'],
      blendMode: 'add',
    })
  }

  /** 预设：音乐音符粒子 */
  createMusicNotes(count = 15) {
    this.createEmitter('music_notes', {
      texture: 'note', count,
      speed: { min: 0.5, max: 1.5 },
      lifetime: { min: 1000, max: 3000 },
      alpha: { start: 0.8, end: 0 },
      scale: { start: 0.5, end: 1.5 },
      color: ['#e8b86d', '#ffb6c1'],
      blendMode: 'add',
    })
  }

  get isActive(): boolean { return this._active }

  destroy() {
    this._emitters.forEach(e => e.destroy?.())
    this._emitters.clear()
    this._active = false
  }
}
