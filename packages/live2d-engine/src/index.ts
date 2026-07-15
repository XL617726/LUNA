/**
 * @luna/live2d-engine — Live2D 角色引擎 v2.0
 *
 * 负责 Live2D Cubism 模型的加载、动作、表情。
 * 当前为接口层，实际渲染依赖 Cubism SDK for Web。
 *
 * 架构：
 *   Live2DManager → ModelLoader → MotionController + ExpressionController
 */
export { Live2DManager } from './Live2DManager'
export { ModelLoader } from './ModelLoader'
export { MotionController } from './MotionController'
export { ExpressionController } from './ExpressionController'
export type { Live2DModel, Live2DMotion, Live2DExpression, CubismConfig } from './types'
