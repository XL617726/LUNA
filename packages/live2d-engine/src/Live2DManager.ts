/**
 * Live2DManager — Live2D 系统总控
 * 统一管理模型加载、动作播放、表情切换、音频驱动
 */
import type { Live2DModel, CubismConfig } from './types'
import { ModelLoader } from './ModelLoader'
import { MotionController } from './MotionController'
import { ExpressionController } from './ExpressionController'

export class Live2DManager {
  private _model: Live2DModel | null = null
  private _loader = new ModelLoader()
  private _motion = new MotionController()
  private _expression = new ExpressionController()
  private _config: CubismConfig = { canvasWidth: 800, canvasHeight: 800, pixelRatio: 2, scale: 1, centerX: 0, centerY: 0 }
  private _loaded = false

  get model(): Live2DModel | null { return this._model }
  get loaded(): boolean { return this._loaded }
  get motion(): MotionController { return this._motion }
  get expression(): ExpressionController { return this._expression }

  /** 加载模型 */
  async loadModel(modelPath: string): Promise<Live2DModel> {
    this._model = await this._loader.load(modelPath)
    this._loaded = true
    return this._model
  }

  /** 播放动作 */
  playMotion(motionId: string, priority = 0) {
    if (!this._model) return false
    return this._motion.play(motionId, priority)
  }

  /** 设置表情 */
  setExpression(expressionId: string) {
    if (!this._model) return false
    return this._expression.set(expressionId)
  }

  /** 音乐驱动 — 根据音频数据更新 Live2D 参数 */
  updateFromAudio(audioData: { volume: number; beat: boolean; energy: number }) {
    if (!this._loaded) return
    // 嘴型随音量开合
    this._expression.setParam('ParamMouthOpenY', audioData.volume)
    // 身体随节拍微动
    if (audioData.beat) this._motion.addPhysics('body_bounce', 0.3)
    // 眼神随能量变化
    this._expression.setParam('ParamEyeLOpen', 0.5 + audioData.energy * 0.5)
    this._expression.setParam('ParamEyeROpen', 0.5 + audioData.energy * 0.5)
  }

  /** 呼吸动画 */
  startBreathing() { this._motion.startLoop('breath', 3000) }
  stopBreathing() { this._motion.stopLoop('breath') }

  /** 更新配置 */
  setConfig(config: Partial<CubismConfig>) { this._config = { ...this._config, ...config } }

  /** 销毁 */
  dispose() {
    this._loader.dispose()
    this._motion.dispose()
    this._expression.dispose()
    this._model = null; this._loaded = false
  }
}
