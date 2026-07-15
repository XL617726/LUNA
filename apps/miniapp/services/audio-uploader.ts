/**
 * LUNA · 星光歌姬 — 文件上传器
 *
 * 负责：
 * 1. 上传至微信云开发存储 / 腾讯云 COS
 * 2. 上传进度跟踪
 * 3. 上传失败重试
 * 4. 返回可访问的文件 URL
 *
 * 目前为接口定义层，实际对接需要配置云开发环境。
 */

/** 上传状态 */
const UploadStatus = Object.freeze({
  PENDING: 'pending',
  UPLOADING: 'uploading',
  DONE: 'done',
  ERROR: 'error',
  CANCELLED: 'cancelled',
})

/**
 * 上传器类
 */
export class Uploader {
  constructor(options = {}) {
    // 云开发环境 ID
    this.envId = options.envId || ''
    // COS 配置（用于直传）
    this.cosConfig = options.cosConfig || null
    // 最大并发上传数
    this.maxConcurrent = options.maxConcurrent || 2
    // 最大重试次数
    this.maxRetries = options.maxRetries || 3

    // 上传任务队列
    this._queue = []
    this._activeCount = 0
    this._onProgress = null
    this._onComplete = null
    this._onError = null
  }

  /**
   * 上传单个文件
   * @param {Object} file - 文件对象
   * @param {Object} meta - 元数据 { name, bpm, animationMode }
   * @returns {Promise<Object>} 上传结果
   */
  async upload(file, meta = {}) {
    const task = {
      id: `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      file,
      meta,
      progress: 0,
      status: UploadStatus.PENDING,
      retries: 0,
      result: null,
      error: null,
    }

    return this._processTask(task)
  }

  /**
   * 批量上传
   * @param {Object[]} files - 文件对象数组
   * @returns {Promise<Object[]>}
   */
  async uploadBatch(files) {
    const results = []
    const queue = files.map((f, i) => ({
      id: `upload_${Date.now()}_${i}`,
      file: f.file,
      meta: f.meta || {},
      progress: 0,
      status: UploadStatus.PENDING,
      retries: 0,
      result: null,
      error: null,
    }))

    // 并发控制上传
    const executing = new Set()
    for (const task of queue) {
      const promise = this._processTask(task).then(result => {
        executing.delete(promise)
        results.push(result)
      })
      executing.add(promise)

      if (executing.size >= this.maxConcurrent) {
        await Promise.race(executing)
      }
    }

    await Promise.all(executing)
    return results
  }

  /**
   * 注册回调
   */
  onProgress(fn) { this._onProgress = fn; return this }
  onComplete(fn) { this._onComplete = fn; return this }
  onError(fn) { this._onError = fn; return this }

  // ==================== 私有方法 ====================

  async _processTask(task) {
    task.status = UploadStatus.UPLOADING

    try {
      const result = await this._doUpload(task)
      task.status = UploadStatus.DONE
      task.progress = 100
      task.result = result

      if (this._onComplete) this._onComplete(task)
      return task
    } catch (e) {
      if (task.retries < this.maxRetries) {
        task.retries++
        console.log(`[Uploader] 重试 ${task.retries}/${this.maxRetries}: ${task.meta.name}`)
        return this._processTask(task)
      }

      task.status = UploadStatus.ERROR
      task.error = e.message

      if (this._onError) this._onError(task, e)
      return task
    }
  }

  /** 执行实际上传 */
  async _doUpload(task) {
    const { file, meta } = task

    // 微信云开发上传
    if (this.envId) {
      return this._cloudUpload(file, meta, task)
    }

    // COS 直传
    if (this.cosConfig) {
      return this._cosUpload(file, meta, task)
    }

    // 降级：本地存储模式（仅记录路径，不实际上传）
    return this._localMode(file, meta, task)
  }

  /** 微信云开发上传 */
  async _cloudUpload(file, meta, task) {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      wx.cloud.uploadFile({
        cloudPath: `luna/songs/${Date.now()}_${meta.name || 'song'}.${file.ext || 'mp3'}`,
        filePath: file.path,
        success: (res) => {
          resolve({
            fileId: res.fileID,
            url: res.fileID, // 云文件 ID，使用时需换取临时链接
            cloudPath: `luna/songs/`,
          })
        },
        fail: (err) => reject(err),
      })
    })
  }

  /** COS 直传 */
  async _cosUpload(file, meta, task) {
    // COS 上传需要签名，通常由后端提供
    // 此处为接口预留
    return new Promise((resolve, reject) => {
      // TODO: 实现 COS SDK 上传
      const cosPath = `luna/songs/${Date.now()}_${meta.name || 'song'}.${file.ext || 'mp3'}`
      resolve({
        url: `${this.cosConfig.baseUrl}/${cosPath}`,
        path: cosPath,
      })
    })
  }

  /** 本地模式（降级方案） */
  async _localMode(file, meta, task) {
    // 小程序本地保存文件路径
    const savedFilePath = await new Promise((resolve, reject) => {
      uni.saveFile({
        tempFilePath: file.path,
        success: (res) => resolve(res.savedFilePath),
        fail: (err) => reject(err),
      })
    })

    return {
      url: savedFilePath,
      localPath: savedFilePath,
      isLocal: true,
      name: meta.name || '未命名',
    }
  }
}

/** 单例 */
let instance = null
export function getUploader() {
  if (!instance) {
    instance = new Uploader()
  }
  return instance
}

export { UploadStatus }
export default Uploader
