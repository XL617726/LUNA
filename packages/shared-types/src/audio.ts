/** 音频分析结果 */
export interface AudioAnalysisResult {
  bpm: number
  volume: number // 0-1
  beat: boolean
  energy: number // 0-1
  isClimax: boolean
}

/** 音频分析器配置 */
export interface AudioAnalyzerConfig {
  bpmWindow: number
  energySmoothing: number
  climaxThreshold: number
  beatThreshold: number
}

/** 播放模式 */
export type PlayMode = 'list' | 'single' | 'random'

/** 支持的音频格式 */
export type AudioFormat = 'mp3' | 'wav' | 'm4a' | 'aac' | 'ogg' | 'flac'

/** 上传状态枚举 */
export type UploadStatus = 'pending' | 'uploading' | 'done' | 'error' | 'cancelled'

/** COS 存储配置 */
export interface CosConfig {
  baseUrl: string
  bucket: string
  region: string
}

/** 上传器配置 */
export interface UploaderConfig {
  envId?: string
  cosConfig?: CosConfig | null
  maxConcurrent: number
  maxRetries: number
}

/** 文件校验结果 */
export interface FileValidationResult {
  valid: boolean
  error?: string
  ext?: string
}
