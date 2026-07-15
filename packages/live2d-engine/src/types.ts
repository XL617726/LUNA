/** Live2D Cubism 模型定义 */
export interface Live2DModel {
  id: string
  name: string
  modelPath: string         // .moc3 文件路径
  modelJsonPath: string     // .model3.json 路径
  textures: string[]
  motions: Live2DMotion[]
  expressions: Live2DExpression[]
  hitAreas: Live2DHitArea[]
}

/** 动作定义 */
export interface Live2DMotion {
  id: string
  name: string
  file: string              // .motion3.json 路径
  group: string             // idle / sing / dance / greet
  loop: boolean
  fadeIn: number            // ms
  fadeOut: number           // ms
}

/** 表情定义 */
export interface Live2DExpression {
  id: string
  name: string
  file: string              // .exp3.json 路径
  params: Live2DParam[]
}

/** Cubism 参数 */
export interface Live2DParam {
  id: string
  value: number             // 0-1
  blend: 'add' | 'multiply' | 'overwrite'
}

/** 点击区域 */
export interface Live2DHitArea {
  id: string
  name: string
  x: number; y: number; w: number; h: number
}

/** Cubism 配置 */
export interface CubismConfig {
  canvasWidth: number
  canvasHeight: number
  pixelRatio: number
  scale: number
  centerX: number
  centerY: number
}
