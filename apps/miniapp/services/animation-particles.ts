/**
 * LUNA · 星光歌姬 — 星光粒子系统
 *
 * 用于首页背景的星光漂浮粒子效果。
 * 独立于角色动画，持续运行。
 *
 * 特性：
 * - 粒子缓动漂浮
 * - 随机闪烁
 * - 可配置密度/速度/颜色
 */

export class ParticleSystem {
  constructor(canvasCtx, options = {}) {
    this.ctx = canvasCtx
    this.width = options.width || 375
    this.height = options.height || 667

    this.config = {
      count: options.count || 40,
      baseSize: options.baseSize || 1.5,
      speed: options.speed || 0.3,
      colors: options.colors || ['#ffd700', '#87ceeb', '#ffb6c1', '#ffffff'],
      twinkleSpeed: options.twinkleSpeed || 0.02,
    }

    this.particles = []
    this.isRunning = false
    this._timer = null
  }

  /** 初始化粒子 */
  init() {
    this.particles = []
    for (let i = 0; i < this.config.count; i++) {
      this.particles.push(this._createParticle(true))
    }
  }

  /** 开始渲染循环 */
  start() {
    if (this.isRunning) return
    if (this.particles.length === 0) this.init()
    this.isRunning = true
    this._loop()
  }

  /** 停止渲染 */
  stop() {
    this.isRunning = false
    if (this._timer) {
      cancelAnimationFrame(this._timer)
      this._timer = null
    }
  }

  /** 调整画布尺寸 */
  resize(width, height) {
    this.width = width
    this.height = height
  }

  // ==================== 私有方法 ====================

  _createParticle(randomY = false) {
    const { colors, baseSize, speed } = this.config
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : this.height + 10,
      size: baseSize * (0.5 + Math.random() * 1.5),
      speed: speed * (0.5 + Math.random() * 1),
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.2 + Math.random() * 0.6,
      twinkle: Math.random() * Math.PI * 2,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.01 + Math.random() * 0.03,
    }
  }

  _loop() {
    if (!this.isRunning) return

    const ctx = this.ctx
    ctx.clearRect(0, 0, this.width, this.height)

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]

      // 上升
      p.y -= p.speed
      // 微水平偏移
      p.wobble += p.wobbleSpeed
      p.x += Math.sin(p.wobble) * 0.3
      // 闪烁
      p.twinkle += this.config.twinkleSpeed
      const twinkleAlpha = p.alpha * (0.5 + 0.5 * Math.sin(p.twinkle))

      // 绘制
      ctx.save()
      ctx.globalAlpha = twinkleAlpha
      ctx.fillStyle = p.color
      ctx.shadowColor = p.color
      ctx.shadowBlur = p.size * 4
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // 超出屏幕则重生
      if (p.y < -10 || p.x < -10 || p.x > this.width + 10) {
        this.particles[i] = this._createParticle(false)
      }
    }

    this._timer = requestAnimationFrame(() => this._loop())
  }
}

export default ParticleSystem
