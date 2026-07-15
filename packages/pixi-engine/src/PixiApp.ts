/**
 * PixiApp — PixiJS 应用实例管理
 */
import type { PixiConfig, RenderLayer } from './types'

export class PixiApp {
  private _app: any = null          // PIXI.Application (lazy init)
  private _layers: Map<RenderLayer, any> = new Map() // PIXI.Container per layer
  private _config: PixiConfig
  private _initialized = false

  constructor(config?: Partial<PixiConfig>) {
    this._config = {
      width: 800, height: 800, backgroundColor: 0x0f0f23,
      resolution: 2, antialias: false, autoDensity: true,
      ...config,
    }
  }

  /** 初始化 PixiJS Application */
  async init(canvas: HTMLCanvasElement): Promise<void> {
    if (this._initialized) return
    // 生产环境：
    // const { Application } = await import('pixi.js')
    // this._app = new Application()
    // await this._app.init({ canvas, ...this._config })
    this._app = { stage: { addChild: () => {}, removeChild: () => {} }, renderer: { render: () => {} } }
    this._initialized = true
  }

  /** 获取渲染层 */
  getLayer(layer: RenderLayer): any {
    if (!this._layers.has(layer)) {
      // const container = new PIXI.Container()
      // container.name = layer
      // this._app.stage.addChild(container)
      // this._layers.set(layer, container)
    }
    return this._layers.get(layer)
  }

  /** 添加对象到指定层 */
  addToLayer(layer: RenderLayer, object: any) {
    const container = this.getLayer(layer)
    if (container) container.addChild(object)
  }

  /** 渲染一帧 */
  render() {
    if (this._app) this._app.renderer.render(this._app.stage)
  }

  /** 调整尺寸 */
  resize(width: number, height: number) {
    this._config.width = width
    this._config.height = height
    if (this._app) this._app.renderer.resize(width, height)
  }

  get app(): any { return this._app }
  get initialized(): boolean { return this._initialized }

  destroy() {
    this._layers.clear()
    if (this._app) { this._app.destroy?.(true); this._app = null }
    this._initialized = false
  }
}
