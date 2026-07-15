// @ts-nocheck — JS port, full TS migration tracked for Sprint 3
/**
 * LUNA 路 鏄熷厜姝屽К 鈥?杩囨浮鐗规晥寮曟搸
 *
 * 鎻愪緵瑙掕壊鐘舵€佸垏鎹㈡椂鐨勮繃娓″姩鐢伙細
 * 1. 鍍忕礌纰庣墖娑堟暎锛堝綋鍓嶈鑹插儚绱犲寲纰庤锛? * 2. 鏄熷厜鍑濊仛鍑虹幇锛堟柊瑙掕壊浠庢槦鍏変腑娴幇锛? *
 * 涓ょ杩囨浮妯″紡鍙粍鍚堜娇鐢ㄣ€? */

/**
 * 杩囨浮鐗规晥绠＄悊鍣? */
export class TransitionEffects {
  constructor(canvasCtx, options = {}) {
    this.ctx = canvasCtx
    this.canvasWidth = options.width || 400
    this.canvasHeight = options.height || 400
    this.pixelSize = options.pixelSize || 8

    // 绮掑瓙鏁扮粍
    this.particles = []
    this.isRunning = false
    this._timer = null
    this._startTime = 0
  }

  /**
   * 鎵ц鍍忕礌纰庣墖娑堟暎鍔ㄧ敾
   * @param {ImageData} sourceData - 婧愯鑹茬殑鍍忕礌鏁版嵁
   * @param {number} duration - 鍔ㄧ敾鏃堕暱锛坢s锛?   * @returns {Promise<void>}
   */
  dissolve(sourceData, duration = 400) {
    return new Promise((resolve) => {
      this._initDissolveParticles(sourceData)
      this._runAnimation('dissolve', duration, resolve)
    })
  }

  /**
   * 鎵ц鏄熷厜鍑濊仛鍔ㄧ敾
   * @param {number} duration - 鍔ㄧ敾鏃堕暱锛坢s锛?   * @returns {Promise<void>}
   */
  emerge(duration = 400) {
    return new Promise((resolve) => {
      this._initEmergeParticles()
      this._runAnimation('emerge', duration, resolve)
    })
  }

  /**
   * 缁勫悎杩囨浮锛氬厛娑堟暎 鈫?鍐嶅嚌鑱?   * @param {ImageData} sourceData - 鏃у浘鍍忔暟鎹?   * @param {number} dissolveDuration
   * @param {number} emergeDuration
   */
  async fullTransition(sourceData, dissolveDuration = 400, emergeDuration = 400) {
    await this.dissolve(sourceData, dissolveDuration)
    await this.emerge(emergeDuration)
  }

  /** 鍋滄褰撳墠鍔ㄧ敾 */
  stop() {
    this.isRunning = false
    if (this._timer) {
      cancelAnimationFrame(this._timer)
      this._timer = null
    }
    this.particles = []
  }

  // ==================== 绉佹湁鏂规硶 ====================

  /** 鍒濆鍖栫鐗囩矑瀛?*/
  _initDissolveParticles(sourceData) {
    this.particles = []
    const step = this.pixelSize

    for (let y = 0; y < sourceData.height; y += step) {
      for (let x = 0; x < sourceData.width; x += step) {
        const idx = (y * sourceData.width + x) * 4
        const r = sourceData.data[idx]
        const g = sourceData.data[idx + 1]
        const b = sourceData.data[idx + 2]
        const a = sourceData.data[idx + 3]

        // 璺宠繃閫忔槑鍍忕礌
        if (a < 10) continue

        this.particles.push({
          x, y,
          color: `rgba(${r},${g},${b},${a / 255})`,
          // 闅忔満杩愬姩鍙傛暟
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3 - Math.random() * 2, // 鍋忎笂
          life: 1.0,       // 鍒濆鐢熷懡鍊?          decay: 0.5 + Math.random() * 0.5, // 娑堟暎閫熷害
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.2,
        })
      }
    }
  }

  /** 鍒濆鍖栨槦鍏夌矑瀛?*/
  _initEmergeParticles() {
    this.particles = []
    const cx = this.canvasWidth / 2
    const cy = this.canvasHeight / 2

    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = 50 + Math.random() * 150
      this.particles.push({
        x: cx + Math.cos(angle) * distance,
        y: cy + Math.sin(angle) * distance,
        targetX: cx + (Math.random() - 0.5) * 100,
        targetY: cy + (Math.random() - 0.5) * 120,
        color: Math.random() > 0.5 ? '#ffd700' : '#ffb6c1',
        size: 1 + Math.random() * 3,
        life: 0.0,    // 浠?寮€濮嬪闀?        glow: 0.3 + Math.random() * 0.7,
        delay: Math.random() * 0.3, // 閿欏紑鍑虹幇
      })
    }
  }

  /** 杩愯鍔ㄧ敾寰幆 */
  _runAnimation(type, duration, resolve) {
    this.isRunning = true
    this._startTime = performance.now()

    const tick = (now) => {
      if (!this.isRunning) {
        resolve()
        return
      }

      const elapsed = now - this._startTime
      const progress = Math.min(1, elapsed / duration)

      // 娓呯┖鐢诲竷
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

      // 缁樺埗绮掑瓙
      for (const p of this.particles) {
        if (type === 'dissolve') {
          this._updateDissolveParticle(p, progress)
        } else {
          this._updateEmergeParticle(p, progress)
        }
        this._drawParticle(p, type, progress)
      }

      if (progress < 1) {
        this._timer = requestAnimationFrame(tick)
      } else {
        this.isRunning = false
        this.particles = []
        resolve()
      }
    }

    this._timer = requestAnimationFrame(tick)
  }

  /** 鏇存柊纰庣墖绮掑瓙 */
  _updateDissolveParticle(p, progress) {
    p.x += p.vx
    p.y += p.vy
    p.vy -= 0.05 // 閲嶅姏
    p.rotation += p.rotSpeed
    p.life = Math.max(0, 1 - progress * p.decay)
  }

  /** 鏇存柊鏄熷厜绮掑瓙 */
  _updateEmergeParticle(p, progress) {
    const effectiveProgress = Math.max(0, (progress - p.delay) / (1 - p.delay))
    p.life = Math.min(1, effectiveProgress * 1.5)
    // 鍚戠洰鏍囦綅缃Щ鍔?    const t = effectiveProgress * effectiveProgress // ease-in
    p.x += (p.targetX - p.x) * t * 0.1
    p.y += (p.targetY - p.y) * t * 0.1
  }

  /** 缁樺埗鍗曚釜绮掑瓙 */
  _drawParticle(p, type, progress) {
    const ctx = this.ctx
    ctx.save()
    ctx.translate(p.x, p.y)

    if (type === 'dissolve') {
      ctx.rotate(p.rotation)
      ctx.globalAlpha = p.life
      ctx.fillStyle = p.color
      ctx.fillRect(-4, -4, 8, 8)
    } else {
      ctx.globalAlpha = p.life * p.glow
      ctx.fillStyle = p.color
      ctx.shadowColor = p.color
      ctx.shadowBlur = p.size * 3
      ctx.beginPath()
      ctx.arc(0, 0, p.size, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }
}

export default TransitionEffects

