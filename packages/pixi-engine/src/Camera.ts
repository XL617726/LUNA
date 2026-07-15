/**
 * Camera — 2D 摄像机
 * 支持平滑跟随、缩放、震动效果
 */
import type { CameraBounds } from './types'

export class Camera {
  private _x = 0
  private _y = 0
  private _targetX = 0
  private _targetY = 0
  private _zoom = 1
  private _targetZoom = 1
  private _bounds: CameraBounds | null = null
  private _shakeIntensity = 0
  private _shakeTimer: any = null
  private _container: any = null // PIXI.Container

  /** 绑定到 PixiJS Container */
  bind(container: any) { this._container = container }

  /** 平滑跟随目标 */
  follow(targetX: number, targetY: number) {
    this._targetX = targetX
    this._targetY = targetY
  }

  /** 设置缩放 */
  zoomTo(zoom: number) { this._targetZoom = Math.max(0.5, Math.min(3, zoom)) }

  /** 震动效果 */
  shake(intensity = 5, duration = 300) {
    this._shakeIntensity = intensity
    if (this._shakeTimer) clearTimeout(this._shakeTimer)
    this._shakeTimer = setTimeout(() => { this._shakeIntensity = 0 }, duration)
  }

  /** 设置边界 */
  setBounds(bounds: CameraBounds) { this._bounds = bounds }

  /** 每帧更新 */
  update(_delta: number) {
    // 平滑插值
    this._x += (this._targetX - this._x) * 0.1
    this._y += (this._targetY - this._y) * 0.1
    this._zoom += (this._targetZoom - this._zoom) * 0.1

    // 震动偏移
    let shakeX = 0, shakeY = 0
    if (this._shakeIntensity > 0) {
      shakeX = (Math.random() - 0.5) * this._shakeIntensity * 2
      shakeY = (Math.random() - 0.5) * this._shakeIntensity * 2
    }

    // 边界限制
    if (this._bounds) {
      this._x = Math.max(this._bounds.x, Math.min(this._bounds.x + this._bounds.width, this._x))
      this._y = Math.max(this._bounds.y, Math.min(this._bounds.y + this._bounds.height, this._y))
    }

    // 应用到容器
    if (this._container) {
      this._container.x = -this._x + shakeX
      this._container.y = -this._y + shakeY
      this._container.scale.set(this._zoom)
    }
  }

  /** 重置位置 */
  reset() {
    this._x = 0; this._y = 0; this._targetX = 0; this._targetY = 0
    this._zoom = 1; this._targetZoom = 1; this._shakeIntensity = 0
  }

  get x(): number { return this._x }
  get y(): number { return this._y }
  get zoom(): number { return this._zoom }
}
