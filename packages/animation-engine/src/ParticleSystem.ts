// @ts-nocheck — JS port, full TS migration tracked for Sprint 3
/**
 * LUNA 路 鏄熷厜姝屽К 鈥?鏄熷厜绮掑瓙绯荤粺
 *
 * 鐢ㄤ簬棣栭〉鑳屾櫙鐨勬槦鍏夋紓娴矑瀛愭晥鏋溿€? * 鐙珛浜庤鑹插姩鐢伙紝鎸佺画杩愯銆? *
 * 鐗规€э細
 * - 绮掑瓙缂撳姩婕傛诞
 * - 闅忔満闂儊
 * - 鍙厤缃瘑搴?閫熷害/棰滆壊
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

  /** 鍒濆鍖栫矑瀛?*/
  init() {
    this.particles = []
    for (let i = 0; i < this.config.count; i++) {
      this.particles.push(this._createParticle(true))
    }
  }

  /** 寮€濮嬫覆鏌撳惊鐜?*/
  start() {
    if (this.isRunning) return
    if (this.particles.length === 0) this.init()
    this.isRunning = true
    this._loop()
  }

  /** 鍋滄娓叉煋 */
  stop() {
    this.isRunning = false
    if (this._timer) {
      cancelAnimationFrame(this._timer)
      this._timer = null
    }
  }

  /** 璋冩暣鐢诲竷灏哄 */
  resize(width, height) {
    this.width = width
    this.height = height
  }

  // ==================== 绉佹湁鏂规硶 ====================

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

      // 涓婂崌
      p.y -= p.speed
      // 寰按骞冲亸绉?      p.wobble += p.wobbleSpeed
      p.x += Math.sin(p.wobble) * 0.3
      // 闂儊
      p.twinkle += this.config.twinkleSpeed
      const twinkleAlpha = p.alpha * (0.5 + 0.5 * Math.sin(p.twinkle))

      // 缁樺埗
      ctx.save()
      ctx.globalAlpha = twinkleAlpha
      ctx.fillStyle = p.color
      ctx.shadowColor = p.color
      ctx.shadowBlur = p.size * 4
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // 瓒呭嚭灞忓箷鍒欓噸鐢?      if (p.y < -10 || p.x < -10 || p.x > this.width + 10) {
        this.particles[i] = this._createParticle(false)
      }
    }

    this._timer = requestAnimationFrame(() => this._loop())
  }
}

export default ParticleSystem

