/**
 * LUNA · 星光歌姬 — 文件校验器
 *
 * 校验上传文件的格式、大小等
 */

/** 支持的音频格式 */
const SUPPORTED_AUDIO_TYPES = ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac']

/** MIME 类型映射 */
const MIME_MAP = {
  'audio/mpeg': 'mp3',
  'audio/mp3': 'mp3',
  'audio/wav': 'wav',
  'audio/wave': 'wav',
  'audio/x-wav': 'wav',
  'audio/mp4': 'm4a',
  'audio/x-m4a': 'm4a',
  'audio/aac': 'aac',
  'audio/ogg': 'ogg',
  'audio/flac': 'flac',
}

/** 文件大小限制 */
const SIZE_LIMITS = {
  default: 50 * 1024 * 1024, // 50MB
  vip: 200 * 1024 * 1024,    // 200MB (预留)
}

/**
 * 文件校验器
 */
export class FileValidator {
  constructor(options = {}) {
    this.maxSize = options.maxSize || SIZE_LIMITS.default
    this.allowedTypes = options.allowedTypes || SUPPORTED_AUDIO_TYPES
  }

  /**
   * 校验单个文件
   * @param {Object} file - uni.chooseFile 返回的文件对象
   * @returns {{ valid: boolean, error?: string, ext?: string }}
   */
  validate(file) {
    if (!file) {
      return { valid: false, error: '文件无效' }
    }

    // 获取文件扩展名
    const ext = this._getExtension(file)

    // 格式校验
    if (!this.allowedTypes.includes(ext)) {
      return {
        valid: false,
        error: `不支持的格式 .${ext}，仅支持 ${this.allowedTypes.join('/')}`,
        ext,
      }
    }

    // 大小校验
    if (file.size > this.maxSize) {
      const maxMB = Math.round(this.maxSize / 1024 / 1024)
      return {
        valid: false,
        error: `文件过大（最大 ${maxMB}MB）`,
        ext,
      }
    }

    return { valid: true, ext }
  }

  /**
   * 批量校验
   * @param {Object[]} files
   * @returns {{ valid: Object[], invalid: Object[] }}
   */
  validateBatch(files) {
    const valid = []
    const invalid = []

    for (const file of files) {
      const result = this.validate(file)
      if (result.valid) {
        valid.push({ ...file, ext: result.ext })
      } else {
        invalid.push({ ...file, error: result.error })
      }
    }

    return { valid, invalid }
  }

  /** 获取文件扩展名 */
  _getExtension(file) {
    // 从小程序文件路径提取
    if (file.name) {
      const parts = file.name.split('.')
      return parts[parts.length - 1].toLowerCase()
    }
    if (file.path) {
      const parts = file.path.split('.')
      return parts[parts.length - 1].toLowerCase()
    }
    // 尝试从 MIME 类型推断
    if (file.type && MIME_MAP[file.type]) {
      return MIME_MAP[file.type]
    }
    return ''
  }
}

export { SUPPORTED_AUDIO_TYPES, SIZE_LIMITS }
export default FileValidator
