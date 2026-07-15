/**
 * ModelLoader — Live2D 模型加载器
 * 加载 .moc3 + .model3.json + textures
 */
import type { Live2DModel } from './types'

export class ModelLoader {
  private _cache: Map<string, Live2DModel> = new Map()

  /** 加载模型（当前为接口层，生产环境对接 Cubism SDK） */
  async load(modelPath: string): Promise<Live2DModel> {
    if (this._cache.has(modelPath)) return this._cache.get(modelPath)!

    // 生产环境：使用 Cubism SDK
    // const cubism = await import('@cubism/sdk')
    // const model = await cubism.loadModel(modelPath)

    // 接口层返回模拟模型
    const model: Live2DModel = {
      id: 'LUNA-001',
      name: 'LUNA',
      modelPath,
      modelJsonPath: modelPath.replace('.moc3', '.model3.json'),
      textures: ['textures/texture_00.png'],
      motions: [
        { id: 'idle', name: '待机', file: 'motions/idle.motion3.json', group: 'idle', loop: true, fadeIn: 500, fadeOut: 500 },
        { id: 'sing', name: '唱歌', file: 'motions/sing.motion3.json', group: 'sing', loop: true, fadeIn: 300, fadeOut: 300 },
        { id: 'dance', name: '跳舞', file: 'motions/dance.motion3.json', group: 'dance', loop: true, fadeIn: 200, fadeOut: 200 },
        { id: 'bow', name: '谢幕', file: 'motions/bow.motion3.json', group: 'greet', loop: false, fadeIn: 200, fadeOut: 800 },
      ],
      expressions: [
        { id: 'normal', name: '普通', file: 'expressions/normal.exp3.json', params: [] },
        { id: 'happy', name: '开心', file: 'expressions/happy.exp3.json', params: [] },
        { id: 'shy', name: '害羞', file: 'expressions/shy.exp3.json', params: [] },
        { id: 'singing', name: '唱歌', file: 'expressions/singing.exp3.json', params: [] },
      ],
      hitAreas: [
        { id: 'head', name: '头部', x: -0.3, y: 0.4, w: 0.6, h: 0.3 },
        { id: 'body', name: '身体', x: -0.4, y: -0.2, w: 0.8, h: 0.6 },
      ],
    }

    this._cache.set(modelPath, model)
    return model
  }

  /** 预加载 */
  async preload(paths: string[]): Promise<Live2DModel[]> {
    return Promise.all(paths.map(p => this.load(p)))
  }

  /** 清除缓存 */
  dispose() { this._cache.clear() }
}
