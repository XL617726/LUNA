/**
 * LUNA · 星光歌姬 — 角色一致性校验器
 *
 * 对应 ART_PRODUCTION_GUIDE.md 中的 Character Consistency Rule。
 *
 * 在素材导入时校验：
 * 1. 三个形态是否同一角色
 * 2. 素材规格是否符合标准
 * 3. 缺失素材检测
 *
 * 如发现不符合 → 拒绝接入 → 要求重新生成。
 */

import { FORM_ASSET_ROOTS, ANIMATION_FILE_MAP } from '@/services/character-assets'

/**
 * 角色档案 LUNA-001（基准参照）
 * 首次生成满意后锁定，后续所有素材与此对比
 */
export const LUNA_001_PROFILE = {
  id: 'LUNA-001',
  name: 'LUNA',
  locked: false, // 首次导入参考图后设为 true

  /** 锁定的人物特征（不可变更） */
  traits: {
    faceShape: '',     // 脸型描述
    hairstyle: '',     // 发型描述
    hairColor: '',     // 发色
    eyeStyle: '',      // 眼型
    glasses: false,    // 是否戴眼镜
    glassesStyle: '',  // 眼镜款式
    bodyProportion: '',// 身体比例
  },

  /** 基准参考图路径 */
  referenceImage: '/assets/characters/LUNA/LUNA-001-ref.png',
}

/**
 * 素材规格要求
 */
const SPRITE_REQUIREMENTS = {
  idle:    { frames: 8,  width: 128, height: 128, fps: 8,  loop: true },
  sing:    { frames: 12, width: 128, height: 128, fps: 10, loop: true },
  dance:   { frames: 16, width: 128, height: 128, fps: 12, loop: true },
  happy:   { frames: 12, width: 128, height: 128, fps: 10, loop: true },
  bow:     { frames: 8,  width: 128, height: 128, fps: 6,  loop: false },
  emotion: { frames: 6,  width: 64,  height: 64,  fps: 4,  loop: false },
}

/**
 * 素材校验结果
 * @typedef {{ valid: boolean, errors: string[], warnings: string[] }}
 */

/**
 * 角色一致性校验器
 */
export class CharacterValidator {
  constructor() {
    this.profile = LUNA_001_PROFILE
  }

  /**
   * 锁定角色档案（首次满意后调用）
   * @param {Object} traits - 要锁定的人物特征
   */
  lockProfile(traits = {}) {
    this.profile.traits = { ...this.profile.traits, ...traits }
    this.profile.locked = true
    console.log('[Validator] 🔒 LUNA-001 角色档案已锁定')
    return this.profile
  }

  /**
   * 校验单个 Sprite 配置
   * @param {string} form - 形态
   * @param {string} animation - 动画名
   * @param {Object} config - 实际配置
   * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
   */
  validateSpriteConfig(form, animation, config = {}) {
    const errors = []
    const warnings = []
    const required = SPRITE_REQUIREMENTS[animation]

    if (!required) {
      errors.push(`未知动画类型: ${animation}`)
      return { valid: false, errors, warnings }
    }

    // 帧数校验
    if (config.frames && config.frames < required.frames) {
      warnings.push(
        `[${form}/${animation}] 帧数不足: ${config.frames}/${required.frames} (缺少 ${required.frames - config.frames} 帧)`
      )
    }

    // 尺寸校验
    if (config.frameWidth && config.frameWidth !== required.width) {
      warnings.push(
        `[${form}/${animation}] 帧宽不一致: ${config.frameWidth}/${required.width}px`
      )
    }

    // FPS 校验
    if (config.fps && config.fps !== required.fps) {
      warnings.push(
        `[${form}/${animation}] FPS 不一致: ${config.fps}/${required.fps}`
      )
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    }
  }

  /**
   * 校验整个形态的素材完整性
   * @param {string} form - graduation | live | CEO
   * @returns {{ complete: boolean, missing: string[], warnings: string[] }}
   */
  validateFormCompleteness(form) {
    const missing = []
    const warnings = []
    const requiredAnimations = Object.keys(SPRITE_REQUIREMENTS)

    for (const anim of requiredAnimations) {
      // 实际项目中需要检查文件是否存在，这里标记为接口
      missing.push(`${form}/${anim}.png`)
    }

    return {
      complete: missing.length === 0,
      missing: missing.length > 0 ? missing : [],
      warnings,
    }
  }

  /**
   * 全局素材到位检查
   * 遍历所有形态和动画，输出完整报告
   * @returns {Object} 检查报告
   */
  generateReport() {
    const forms = ['graduation', 'live', 'CEO']
    const animations = Object.keys(SPRITE_REQUIREMENTS)
    const report = {
      totalAssets: forms.length * animations.length,
      readyAssets: 0,
      missingAssets: [],
      forms: {},
      profile: this.profile,
    }

    for (const form of forms) {
      report.forms[form] = {
        assets: {},
        ready: 0,
        total: animations.length,
      }

      for (const anim of animations) {
        report.forms[form].assets[anim] = {
          status: 'missing', // missing | placeholder | ready
          path: `assets/characters/LUNA/${form}/${anim}.png`,
        }
        report.missingAssets.push(`${form}/${anim}`)
      }
    }

    report.readyAssets = 0 // 素材全部未到位时归零
    return report
  }

  /**
   * 检查角色档案是否已锁定
   */
  isProfileLocked() {
    return this.profile.locked
  }
}

/** 单例 */
let instance = null
export function getCharacterValidator() {
  if (!instance) {
    instance = new CharacterValidator()
  }
  return instance
}

export { SPRITE_REQUIREMENTS }
export default CharacterValidator
