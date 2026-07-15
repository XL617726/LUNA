/** PixiJS 渲染配置 */
export interface PixiConfig {
  width: number
  height: number
  backgroundColor: number
  resolution: number
  antialias: boolean
  autoDensity: boolean
}

/** 渲染层级 */
export type RenderLayer = 'background' | 'scene' | 'character' | 'effects' | 'ui' | 'overlay'

/** 粒子配置 */
export interface ParticleConfig {
  texture: string          // 粒子纹理 key
  count: number
  speed: { min: number; max: number }
  lifetime: { min: number; max: number }
  alpha: { start: number; end: number }
  scale: { start: number; end: number }
  color: string[]
  blendMode: 'normal' | 'add' | 'multiply'
}

/** 摄像机边界 */
export interface CameraBounds {
  x: number; y: number; width: number; height: number
}
