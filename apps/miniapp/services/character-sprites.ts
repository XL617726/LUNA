/**
 * LUNA · 星光歌姬 — Sprite 帧加载器
 *
 * 负责：
 * 1. 加载精灵图 PNG
 * 2. 解析 JSON 配置获取帧坐标
 * 3. 提供帧裁剪与绘制能力
 * 4. 素材缺失时生成像素占位图
 *
 * 兼容：微信小程序 Canvas 2D + uni-app
 */

/**
 * Sprite 加载器
 */
export class SpriteLoader {
  constructor() {
    this._sprites = new Map()   // 已加载的图片对象
    this._configs = new Map()   // 已加载的配置
    this._loading = new Map()   // 正在加载的 Promise
    this._canvasCache = new Map() // 离屏 Canvas 缓存
  }

  /**
   * 加载精灵图并返回可绘制的 Sprite 对象
   * @param {Object} resolved - AssetResolver.resolve() 的结果
   * @returns {Promise<Object>} { image, config, frames: [] }
   */
  async load(resolved) {
    const { spritePath, config, isPlaceholder } = resolved

    // 占位模式：生成像素色块 Sprite
    if (isPlaceholder) {
      return this._generatePlaceholderSprite(resolved.animation)
    }

    // 已缓存
    if (this._sprites.has(spritePath)) {
      return {
        image: this._sprites.get(spritePath),
        config: this._configs.get(spritePath) || config,
      }
    }

    // 正在加载（防重复）
    if (this._loading.has(spritePath)) {
      return this._loading.get(spritePath)
    }

    const loadPromise = this._doLoad(resolved)
    this._loading.set(spritePath, loadPromise)

    try {
      const result = await loadPromise
      return result
    } catch (e) {
      console.warn(`[SpriteLoader] 加载失败: ${spritePath}`, e.message)
      return this._generatePlaceholderSprite(resolved.animation)
    } finally {
      this._loading.delete(spritePath)
    }
  }

  /**
   * 获取单帧的绘制参数
   * @param {Object} sprite - 已加载的 sprite 对象
   * @param {number} frameIndex - 帧序号
   * @returns {{ sx: number, sy: number, sw: number, sh: number }}
   */
  getFrameSource(sprite, frameIndex) {
    const config = sprite.config
    const columns = Math.floor(sprite.image.width / config.frameWidth)
    const col = frameIndex % columns
    const row = Math.floor(frameIndex / columns)

    return {
      sx: col * config.frameWidth,
      sy: row * config.frameHeight,
      sw: config.frameWidth,
      sh: config.frameHeight,
    }
  }

  /**
   * 获取总帧数
   */
  getFrameCount(sprite) {
    return sprite.config.frames
  }

  /**
   * 预加载一组素材
   * @param {Object[]} resolvables - AssetResolver.resolve() 结果数组
   */
  async preload(resolvables) {
    const results = await Promise.allSettled(
      resolvables.map(r => this.load(r))
    )
    return results.map((r, i) =>
      r.status === 'fulfilled' ? r.value : this._generatePlaceholderSprite(resolvables[i].animation)
    )
  }

  /**
   * 清除缓存
   */
  clear() {
    this._sprites.clear()
    this._configs.clear()
    this._loading.clear()
    this._canvasCache.clear()
  }

  // ==================== 私有方法 ====================

  /** 实际加载逻辑 */
  async _doLoad(resolved) {
    const { localPath, remotePath, configPath } = resolved

    // 1. 加载 JSON 配置
    //    优先从静态资源加载（小程序 require），降级到网络请求
    let config = resolved.config
    try {
      // 尝试静态引入（微信小程序支持 require JSON）
      try {
        const staticCfg = require(`@/assets/characters/LUNA/${resolved._form || 'graduation'}/${resolved._anim || 'idle'}.json`)
        if (staticCfg) {
          config = { ...resolved.config, ...staticCfg }
        }
      } catch (_) {
        // 静态引入失败，尝试网络请求
        try {
          const cfgRes = await uni.request({ url: configPath, method: 'GET' })
          if (cfgRes.statusCode === 200 && cfgRes.data) {
            config = { ...resolved.config, ...cfgRes.data }
          }
        } catch (__) {
          // JSON 配置加载失败，使用默认配置
        }
      }
    } catch (_) {
      // 使用默认配置
    }

    // 2. 加载精灵图 PNG
    const image = await this._loadImage(localPath, remotePath)

    this._sprites.set(resolved.spritePath, image)
    this._configs.set(resolved.spritePath, config)

    return { image, config }
  }

  /** 加载图片（本地优先，远程降级） */
  _loadImage(localPath, remotePath) {
    return new Promise((resolve, reject) => {
      // 微信小程序环境使用 Canvas.createImage
      let img
      if (typeof wx !== 'undefined' && wx.createImage) {
        // @ts-ignore - 微信小程序 Canvas API
        img = wx.createImage()
      } else {
        img = new Image()
      }

      img.onload = () => resolve(img)
      img.onerror = () => {
        // 本地失败，尝试远程
        if (remotePath && img.src !== remotePath) {
          img.src = remotePath
        } else {
          reject(new Error('图片加载失败'))
        }
      }

      img.src = localPath
    })
  }

  /** 生成像素占位 Sprite — 用色块画出简单角色形状 */
  _generatePlaceholderSprite(animation) {
    const key = `placeholder_${animation}`
    if (this._canvasCache.has(key)) {
      return this._canvasCache.get(key)
    }

    const size = 128
    const canvas = this._createOffscreenCanvas(size, size)
    const ctx = canvas.getContext('2d')

    // 关闭平滑以保持像素风格
    ctx.imageSmoothingEnabled = false

    // 根据动画状态绘制不同的像素色块角色
    this._drawPixelPlaceholder(ctx, size, animation)

    const dataUrl = canvas.toDataURL?.() || ''
    const cached = { image: canvas, config: { frameWidth: size, frameHeight: size, frames: 1, fps: 1, loop: true }, isPlaceholder: true, animation }

    this._canvasCache.set(key, cached)
    return cached
  }

  /** 绘制像素占位图 */
  _drawPixelPlaceholder(ctx, size, animation) {
    const s = size / 16 // 像素格子大小（8px each = 16x16 grid）

    // --- 背景透明 ---
    ctx.clearRect(0, 0, size, size)

    // --- 颜色方案 ---
    const colors = {
      skin: '#ffd5b8',
      hair: '#4a3728',
      outfit: '#2a2a5a',
      accent: '#e8b86d',
      eye: '#222',
    }

    // 根据动画微调配色
    if (animation === 'happy') {
      colors.outfit = '#5a3a6a'
      colors.accent = '#ffb6c1'
    } else if (animation === 'bow') {
      colors.accent = '#87ceeb'
    }

    // --- 绘制像素角色（极简 16×16 风格）---
    const drawPixel = (gx, gy, color) => {
      ctx.fillStyle = color
      ctx.fillRect(gx * s, gy * s, s, s)
    }

    // 头发
    for (let x = 3; x <= 11; x++) {
      for (let y = 0; y <= 3; y++) {
        if ((x >= 4 && x <= 10) || y < 2) drawPixel(x, y, colors.hair)
      }
    }

    // 脸
    for (let x = 4; x <= 9; x++) {
      for (let y = 3; y <= 7; y++) {
        if (!((x === 4 || x === 9) && y === 3)) drawPixel(x, y, colors.skin)
      }
    }

    // 眼睛
    drawPixel(5, 5, colors.eye)
    drawPixel(8, 5, colors.eye)

    // 嘴巴（根据动画变化）
    if (animation === 'happy') {
      drawPixel(6, 7, '#e04070')
      drawPixel(8, 7, '#e04070')
    } else if (animation === 'sing') {
      drawPixel(6, 7, colors.eye)
      drawPixel(7, 7, colors.eye)
      drawPixel(8, 7, colors.eye)
    } else {
      drawPixel(6, 7, colors.eye)
      drawPixel(7, 7, colors.eye)
    }

    // 身体/服装
    for (let x = 4; x <= 9; x++) {
      for (let y = 8; y <= 12; y++) {
        drawPixel(x, y, colors.outfit)
      }
    }

    // 领口/装饰
    drawPixel(6, 8, colors.accent)
    drawPixel(7, 8, colors.accent)

    // 手臂（根据动画变化）
    if (animation === 'sing') {
      // 拿麦克风姿势
      for (let y = 8; y <= 10; y++) drawPixel(10, y, colors.skin)
      drawPixel(11, 9, '#666') // 麦克风
      for (let y = 8; y <= 10; y++) drawPixel(3, y, colors.skin)
    } else if (animation === 'dance') {
      for (let y = 8; y <= 10; y++) drawPixel(10, y, colors.skin)
      for (let y = 8; y <= 10; y++) drawPixel(3, y, colors.skin)
    } else if (animation === 'bow') {
      for (let y = 8; y <= 11; y++) drawPixel(2, y, colors.skin)
      for (let y = 8; y <= 11; y++) drawPixel(11, y, colors.skin)
    } else {
      // idle
      for (let y = 8; y <= 11; y++) drawPixel(3, y, colors.skin)
      for (let y = 8; y <= 11; y++) drawPixel(10, y, colors.skin)
    }
  }

  /** 创建离屏 Canvas */
  _createOffscreenCanvas(width, height) {
    if (typeof wx !== 'undefined' && wx.createOffscreenCanvas) {
      // @ts-ignore
      return wx.createOffscreenCanvas({ type: '2d', width, height })
    }
    // Web 降级
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return canvas
  }
}

/** 单例 */
let instance = null
export function getSpriteLoader() {
  if (!instance) {
    instance = new SpriteLoader()
  }
  return instance
}

export default SpriteLoader
