/**
 * @luna/audio-engine — 音频引擎
 *
 * 负责："她如何感受到音乐"
 * - 音频加载与播放控制
 * - BPM / 音量 / 节拍 / 能量 / 高潮检测
 * - 文件格式校验
 * - 上传管理
 *
 * 输入: MP3/WAV/M4A → 输出: AudioAnalysisResult
 */
export { AudioAnalyzer, getAudioAnalyzer } from './AudioAnalyzer'
export { FileValidator, SUPPORTED_AUDIO_TYPES, SIZE_LIMITS } from './FileValidator'
export { Uploader, getUploader, UploadStatus } from './Uploader'
export type { AudioAnalysisResult, AudioAnalyzerConfig, PlayMode } from '@luna/shared-types'
