/**
 * CharacterRenderer — PixiJS 角色渲染器
 * 升级自 v1.0 Canvas 2D Sprite 渲染
 */
import type { CharacterState } from '@luna/shared-types'

export class CharacterRenderer {
  private _sprite: any = null     // PIXI.AnimatedSprite
  private _state: CharacterState = 'idle'
  private _animations: Map<string, any> = new Map() // state → PIXI.Texture[]

  /** 设置动画帧 */
  setAnimation(state: CharacterState) {
    this._state = state
    const textures = this._animations.get(state)
    if (textures && this._sprite) {
      this._sprite.textures = textures
      this._sprite.gotoAndPlay?.(0)
    }
  }

  /** 注册动画 */
  registerAnimation(state: CharacterState, spriteSheetUrl: string, frameCount: number) {
    // 生产环境：
    // const textures = []
    // for (let i = 0; i < frameCount; i++) textures.push(PIXI.Texture.from(`${spriteSheetUrl}#${i}`))
    // this._animations.set(state, textures)
    this._animations.set(state, [])
  }

  /** 附加到 PixiApp */
  attachTo(app: any) {
    // this._sprite = new PIXI.AnimatedSprite([])
    // app.getLayer('character').addChild(this._sprite)
  }

  /** 设置位置 */
  setPosition(x: number, y: number) {
    if (this._sprite) { this._sprite.x = x; this._sprite.y = y }
  }

  /** 设置透明度 */
  setAlpha(alpha: number) {
    if (this._sprite) this._sprite.alpha = alpha
  }

  /** 像素化渲染（关键：关闭平滑） */
  setPixelMode(enabled: boolean) {
    if (this._sprite) {
      this._sprite.texture.baseTexture.scaleMode = enabled ? 0 : 1 // NEAREST vs LINEAR
    }
  }

  get state(): CharacterState { return this._state }

  destroy() {
    if (this._sprite) { this._sprite.destroy?.(); this._sprite = null }
    this._animations.clear()
  }
}
