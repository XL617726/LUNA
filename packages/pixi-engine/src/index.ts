/**
 * @luna/pixi-engine — PixiJS 渲染引擎 v2.0
 *
 * 升级自 v1.0 Canvas 2D → PixiJS 高性能渲染。
 * 负责角色渲染、粒子特效、光效、摄像机。
 *
 * 使用方式：
 *   1. 创建 PixiApp
 *   2. 添加 CharacterRenderer
 *   3. 通过 AnimationEngine 驱动动画
 */
export { PixiApp } from './PixiApp'
export { CharacterRenderer } from './CharacterRenderer'
export { ParticleSystem } from './ParticleSystem'
export { Camera } from './Camera'
export type { PixiConfig, RenderLayer } from './types'
