/**
 * ExpressionController — Live2D 表情控制器
 * 管理面部表情参数和切换
 */
export class ExpressionController {
  private _current: string = 'normal'
  private _params: Map<string, number> = new Map()
  private _transitioning = false

  /** 切换到指定表情 */
  set(expressionId: string): boolean {
    if (this._transitioning) return false
    this._current = expressionId
    this._transitioning = true
    // 模拟过渡时间
    setTimeout(() => { this._transitioning = false }, 300)
    return true
  }

  /** 设置单个参数值 */
  setParam(paramId: string, value: number) {
    this._params.set(paramId, Math.max(0, Math.min(1, value)))
  }

  /** 获取参数值 */
  getParam(paramId: string): number {
    return this._params.get(paramId) || 0
  }

  /** 获取多个参数 */
  getParams(paramIds: string[]): Record<string, number> {
    const result: Record<string, number> = {}
    for (const id of paramIds) result[id] = this.getParam(id)
    return result
  }

  /** 批量设置参数 */
  setParams(params: Record<string, number>) {
    for (const [id, val] of Object.entries(params)) this.setParam(id, val)
  }

  /** 重置到默认 */
  reset() {
    this._current = 'normal'
    this._params.clear()
    this._transitioning = false
  }

  get current(): string { return this._current }
  get isTransitioning(): boolean { return this._transitioning }

  dispose() { this.reset() }
}
