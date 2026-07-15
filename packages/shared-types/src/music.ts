import type { AudioFormat, PlayMode } from './audio'

/** 歌曲实体 */
export interface Song {
  id: string
  name: string
  artist?: string
  duration: number  // 秒
  bpm: number
  animationMode: string
  coverUrl: string
  fileUrl: string
  uploadedAt: string
}

/** 歌曲元数据（上传时填写） */
export interface SongMeta {
  name: string
  artist?: string
  bpm?: number
  animationMode?: string
}

/** 上传任务 */
export interface UploadTask {
  id: string
  file: FileInfo
  meta: SongMeta
  progress: number
  status: 'pending' | 'uploading' | 'done' | 'error' | 'cancelled'
  error: string | null
  result: unknown
  retries: number
}

/** 文件信息（来自 uni.chooseFile） */
export interface FileInfo {
  path: string
  name?: string
  size: number
  type?: string
  ext?: AudioFormat
}
