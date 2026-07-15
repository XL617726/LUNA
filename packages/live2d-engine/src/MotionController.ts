/**
 * MotionController — Live2D 动作控制器
 * 管理动作播放队列、优先级、循环
 */
export class MotionController {
  private _current: string | null = null
  private _queue: Array<{ id: string; priority: number }> = []
  private _loops: Map<string, number> = new Map() // motionId → intervalId
  private _physics: Map<string, number> = new Map() // physicsId → value

  /** 播放动作 */
  play(motionId: string, priority = 0): boolean {
    // 低优先级不打断高优先级
    if (this._current && priority < (this._queue[0]?.priority || 0)) {
      this._queue.push({ id: motionId, priority })
      return false
    }
    this._current = motionId
    return true
  }

  /** 开始循环动作（如呼吸） */
  startLoop(motionId: string, intervalMs: number) {
    this.stopLoop(motionId)
    this._loops.set(motionId, window.setInterval(() => {
      if (!this._current) this.play(motionId, -1)
    }, intervalMs))
  }

  /** 停止循环 */
  stopLoop(motionId: string) {
    const id = this._loops.get(motionId)
    if (id) { clearInterval(id); this._loops.delete(motionId) }
  }

  /** 添加物理效果 */
  addPhysics(id: string, value: number) {
    this._physics.set(id, value)
    setTimeout(() => this._physics.delete(id), 200)
  }

  /** 获取物理效果值 */
  getPhysics(id: string): number {
    return this._physics.get(id) || 0
  }

  /** 当前播放的动作 */
  get current(): string | null { return this._current }

  dispose() {
    this._loops.forEach(id => clearInterval(id))
    this._loops.clear()
    this._queue = []
    this._current = null
  }
}
