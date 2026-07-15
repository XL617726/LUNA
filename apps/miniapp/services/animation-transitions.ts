/**
 * LUNA · 星光歌姬 — 过渡特效引擎
 *
 * 提供角色状态切换时的过渡动画：
 * 1. 像素碎片消散（当前角色像素化碎裂）
 * 2. 星光凝聚出现（新角色从星光中浮现）
 *
 * 两种过渡模式可组合使用。
 */

/**
 * 过渡特效管理器
 */
export class TransitionEffects {
  constructor(canvasCtx, options = {}) {
    this.ctx = canvasCtx
    this.canvasWidth = options.width || 400
    this.canvasHeight = options.height || 400
    this.pixelSize = options.pixelSize || 8

    // 粒子数组
    this.particles = []
    this.isRunning = false
    this._timer = null
    this._startTime = 0
  }

  /**
   * 执行像素碎片消散动画
   * @param {ImageData} sourceData - 源角色的像素数据
   * @param {number} duration - 动画时长（ms）
   * @returns {Promise<void>}
   */
  dissolve(sourceData, duration = 400) {
    return new Promise((resolve) => {
      this._initDissolveParticles(sourceData)
      this._runAnimation('dissolve', duration, resolve)
    })
  }

  /**
   * 执行星光凝聚动画
   * @param {number} duration - 动画时长（ms）
   * @returns {Promise<void>}
   */
  emerge(duration = 400) {
    return new Promise((resolve) => {
      this._initEmergeParticles()
      this._runAnimation('emerge', duration, resolve)
    })
  }

  /**
   * 组合过渡：先消散 → 再凝聚
   * @param {ImageData} sourceData - 旧图像数据
   * @param {number} dissolveDuration
   * @param {number} emergeDuration
   */
  async fullTransition(sourceData, dissolveDuration = 400, emergeDuration = 400) {
    await this.dissolve(sourceData, dissolveDuration)
    await this.emerge(emergeDuration)
  }

  /** 停止当前动画 */
  stop() {
    this.isRunning = false
    if (this._timer) {
      cancelAnimationFrame(this._timer)
      this._timer = null
    }
    this.particles = []
  }

  // ==================== 私有方法 ====================

  /** 初始化碎片粒子 */
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

        // 跳过透明像素
        if (a < 10) continue

        this.particles.push({
          x, y,
          color: `rgba(${r},${g},${b},${a / 255})`,
          // 随机运动参数
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3 - Math.random() * 2, // 偏上
          life: 1.0,       // 初始生命值
          decay: 0.5 + Math.random() * 0.5, // 消散速度
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.2,
        })
      }
    }
  }

  /** 初始化星光粒子 */
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
        life: 0.0,    // 从0开始增长
        glow: 0.3 + Math.random() * 0.7,
        delay: Math.random() * 0.3, // 错开出现
      })
    }
  }

  /** 运行动画循环 */
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

      // 清空画布
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

      // 绘制粒子
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

  /** 更新碎片粒子 */
  _updateDissolveParticle(p, progress) {
    p.x += p.vx
    p.y += p.vy
    p.vy -= 0.05 // 重力
    p.rotation += p.rotSpeed
    p.life = Math.max(0, 1 - progress * p.decay)
  }

  /** 更新星光粒子 */
  _updateEmergeParticle(p, progress) {
    const effectiveProgress = Math.max(0, (progress - p.delay) / (1 - p.delay))
    p.life = Math.min(1, effectiveProgress * 1.5)
    // 向目标位置移动
    const t = effectiveProgress * effectiveProgress // ease-in
    p.x += (p.targetX - p.x) * t * 0.1
    p.y += (p.targetY - p.y) * t * 0.1
  }

  /** 绘制单个粒子 */
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
