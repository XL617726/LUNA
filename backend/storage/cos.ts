/**
 * COS Storage Service — 腾讯云对象存储
 *
 * 管理角色素材、歌曲文件、图片的云端存储。
 * 支持 CDN 加速，素材更新无需重新发版。
 */
import { config } from '../api/src/config'

export interface UploadResult {
  url: string
  key: string
  etag?: string
  size?: number
}

export interface CosUploadOptions {
  bucket?: string
  region?: string
  contentType?: string
  cacheControl?: string
}

export class CosStorageService {
  private config: typeof config.cos

  constructor() {
    this.config = config.cos
  }

  /**
   * 上传文件到 COS
   */
  async upload(
    filePath: string,
    remoteKey: string,
    options: CosUploadOptions = {}
  ): Promise<UploadResult> {
    // 生产环境: 使用 cos-nodejs-sdk-v5
    // const Cos = require('cos-nodejs-sdk-v5')
    // const cos = new Cos({ SecretId, SecretKey })
    // return cos.putObject({ Bucket, Region, Key, Body })

    console.log(`[COS] Upload: ${filePath} → ${remoteKey}`)

    return {
      url: `${this.config.baseUrl}/${remoteKey}`,
      key: remoteKey,
    }
  }

  /**
   * 获取文件访问 URL（带 CDN）
   */
  getUrl(key: string): string {
    return `${this.config.baseUrl}/${key}`
  }

  /**
   * 批量获取 URL
   */
  getUrls(keys: string[]): string[] {
    return keys.map(k => this.getUrl(k))
  }

  /**
   * 删除文件
   */
  async delete(key: string): Promise<boolean> {
    console.log(`[COS] Delete: ${key}`)
    return true
  }

  /**
   * 生成上传签名（客户端直传用）
   */
  generateUploadSignature(key: string, maxSize = 50 * 1024 * 1024): Record<string, any> {
    // 生产环境: 使用 STS 临时密钥
    return {
      url: `${this.config.baseUrl}/${key}`,
      method: 'PUT',
      maxSize,
      expiresIn: 3600,
    }
  }

  /**
   * 上传角色 Sprite 素材
   */
  async uploadCharacterSprite(form: string, animation: string, filePath: string): Promise<UploadResult> {
    const key = `${this.config.paths.characters}LUNA/${form}/${animation}.png`
    return this.upload(filePath, key)
  }

  /**
   * 上传歌曲文件
   */
  async uploadSong(userId: string, fileName: string, filePath: string): Promise<UploadResult> {
    const key = `${this.config.paths.music}${userId}/${Date.now()}_${fileName}`
    return this.upload(filePath, key, { contentType: 'audio/mpeg' })
  }

  /**
   * 上传背景图
   */
  async uploadBackground(scene: string, filePath: string): Promise<UploadResult> {
    const key = `${this.config.paths.backgrounds}${scene}.png`
    return this.upload(filePath, key)
  }
}

/** 单例 */
let instance: CosStorageService | null = null
export function getStorage(): CosStorageService {
  if (!instance) instance = new CosStorageService()
  return instance
}
