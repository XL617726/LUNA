/**
 * LUNA · 星光歌姬 — 素材解析器
 *
 * 负责：
 * 1. 根据形态+动画状态映射素材路径
 * 2. 本地素材优先，远程 COS 降级
 * 3. 素材缺失时返回占位配置（不阻塞渲染）
 */

/** 三种形态的素材根目录 */
const FORM_ASSET_ROOTS = {
  graduation: '/assets/characters/LUNA/graduation',
  live: '/assets/characters/LUNA/live',
  CEO: '/assets/characters/LUNA/CEO',
}

/** 动画状态 → 文件名映射 */
const ANIMATION_FILE_MAP = {
  idle: 'idle',
  sing: 'sing',
  dance: 'dance',
  happy: 'happy',
  bow: 'bow',
  emotion: 'emotion',
}

/** 默认 Sprite 配置（素材缺失时使用） */
const DEFAULT_SPRITE_CONFIG = {
  frameWidth: 128,
  frameHeight: 128,
  frames: 4,
  fps: 6,
  loop: true,
}

/**
 * 素材解析器
 */
export class AssetResolver {
  basePath: string
  useRemote: boolean
  remoteBase: string
  cache: Map<string, any>

  constructor(options: { basePath?: string; useRemote?: boolean; remoteBase?: string } = {}) {
    this.basePath = options.basePath || ''
    this.useRemote = options.useRemote || false
    this.remoteBase = options.remoteBase || ''
    this.cache = new Map()
  }

  /**
   * 解析素材路径
   * @param {string} form - 形态: graduation | live | CEO
   * @param {string} animation - 动画: idle | sing | dance | happy | bow
   * @returns {{ localPath: string, remotePath: string, config: object, isPlaceholder: boolean }}
   */
  resolve(form: string, animation: string) {
    const cacheKey = `${form}_${animation}`
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const formRoot = FORM_ASSET_ROOTS[form]
    const animFile = ANIMATION_FILE_MAP[animation]

    if (!formRoot || !animFile) {
      console.warn(`[AssetResolver] 无效参数: form=${form}, anim=${animation}`)
      return this._placeholder(animation)
    }

    const spritePath = `${formRoot}/${animFile}`

    const result = {
      spritePath: `${spritePath}.png`,
      configPath: `${spritePath}.json`,
      localPath: `${this.basePath}${spritePath}.png`,
      remotePath: this.useRemote ? `${this.remoteBase}${spritePath}.png` : '',
      config: { ...DEFAULT_SPRITE_CONFIG },
      isPlaceholder: false,
      // 传递给 SpriteLoader 以定位静态 JSON 配置
      _form: form,
      _anim: animation,
    }

    this.cache.set(cacheKey, result)
    return result
  }

  /**
   * 设置远程素材（COS 降级）
   */
  setRemoteBase(url) {
    this.remoteBase = url
    this.useRemote = true
  }

  /**
   * 清除缓存（切换形态时调用）
   */
  clearCache() {
    this.cache.clear()
  }

  /**
   * 生成占位素材配置
   * 在 PNG 到位前，用像素色块代替角色
   */
  _placeholder(animation) {
    return {
      spritePath: '',
      configPath: '',
      localPath: '',
      remotePath: '',
      config: { ...DEFAULT_SPRITE_CONFIG },
      isPlaceholder: true,
      animation,
    }
  }
}

/** 单例 */
let instance = null
export function getAssetResolver() {
  if (!instance) {
    instance = new AssetResolver()
  }
  return instance
}

export { FORM_ASSET_ROOTS, ANIMATION_FILE_MAP, DEFAULT_SPRITE_CONFIG }
