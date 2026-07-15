/**
 * WorldEventBus — 世界事件总线
 * 解耦各系统之间的通信
 */
import type { WorldEvent } from './types'

type EventHandler = (event: WorldEvent) => void

export class WorldEventBus {
  private _handlers: Map<string, Set<EventHandler>> = new Map()
  private _history: WorldEvent[] = []

  /** 注册事件监听 */
  on(type: string, handler: EventHandler): () => void {
    if (!this._handlers.has(type)) this._handlers.set(type, new Set())
    this._handlers.get(type)!.add(handler)
    return () => this._handlers.get(type)?.delete(handler)
  }

  /** 触发事件 */
  emit(type: string, data?: Record<string, unknown>, target?: string) {
    const event: WorldEvent = { id: `evt_${Date.now()}_${Math.random().toString(36).slice(2,6)}`, type: type as any, target, data, timestamp: Date.now() }
    this._history.push(event)
    if (this._history.length > 100) this._history.shift()
    this._handlers.get(type)?.forEach(h => h(event))
    // 同时通知 'all' 监听者
    if (type !== 'all') this._handlers.get('all')?.forEach(h => h(event))
  }

  /** 获取事件历史 */
  getHistory(limit = 20): WorldEvent[] { return this._history.slice(-limit) }

  /** 清除监听 */
  clear() { this._handlers.clear() }
}

/** 全局单例 */
let instance: WorldEventBus | null = null
export function getWorldEventBus(): WorldEventBus {
  if (!instance) instance = new WorldEventBus()
  return instance
}
