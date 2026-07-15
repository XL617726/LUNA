/**
 * LUNA · 星光歌姬 — 音频分析器
 * 基于 Web Audio API 分析音频特征
 *
 * 输出:
 *   - BPM (节拍检测)
 *   - Volume (音量 0-1)
 *   - Beat (是否在重拍上)
 *   - Energy (频谱能量 0-1)
 *   - isClimax (是否高潮段落)
 *
 * 注意: 微信小程序中 Web Audio API 受限，
 * 此为接口定义层，实际实现需对接 InnerAudioContext + 定时采样
 */

/**
 * 音频分析器类
 * 提供节拍检测、能量分析、高潮识别能力
 */
interface AnalyzerOptions {
  bpmWindow?: number
  energySmoothing?: number
  climaxThreshold?: number
  beatThreshold?: number
}

export class AudioAnalyzer {
  bpmDetectionWindow: number
  energySmoothing: number
  climaxThreshold: number
  beatThreshold: number
  _beatHistory: number[]
  _energyHistory: number[]
  _lastBeatTime: number
  _initialized: boolean
  _audioContext: unknown
  result: { bpm: number; volume: number; beat: boolean; energy: number; isClimax: boolean }

  constructor(options: AnalyzerOptions = {}) {
    this.bpmDetectionWindow = options.bpmWindow || 5
    this.energySmoothing = options.energySmoothing || 0.3
    this.climaxThreshold = options.climaxThreshold || 0.7
    this.beatThreshold = options.beatThreshold || 1.3
    this._beatHistory = []
    this._energyHistory = []
    this._lastBeatTime = 0
    this._initialized = false
    this._audioContext = null
    this.result = { bpm: 0, volume: 0, beat: false, energy: 0, isClimax: false }
  }

  /**
   * 初始化分析器
   * 微信小程序环境：监听 onTimeUpdate 事件，定时采样
   * @param {Object} audioContext - InnerAudioContext 实例
   */
  init(audioContext: any) {
    if (this._initialized) return
    this._audioContext = audioContext
    this._initialized = true
    console.log('[AudioAnalyzer] 初始化完成')
  }

  /**
   * 输入音频时间域数据进行分析
   * 在小程序中由 onTimeUpdate 定时调用
   * @param {Object} data - { currentTime, duration, ... }
   */
  analyze(data: { currentTime: number; duration: number }) {
    const { currentTime, duration } = data

    // 简化版分析：基于时间位置估算
    // 实际 BPM 检测需要频率域数据，此处为接口定义
    const progress = duration > 0 ? currentTime / duration : 0

    // 音量模拟（基于歌曲进度位置的结构变化）
    const simulatedVolume = this._simulateVolume(progress, currentTime)

    // 节拍检测
    const now = Date.now()
    const beatDetected = this._detectBeat(currentTime, simulatedVolume)

    // 能量计算
    const energy = this._calculateEnergy(simulatedVolume, beatDetected)

    // 高潮检测
    const isClimax = energy > this.climaxThreshold

    this.result = {
      bpm: this._estimateBPM(),
      volume: simulatedVolume,
      beat: beatDetected,
      energy: Math.round(energy * 100) / 100,
      isClimax,
    }

    return this.result
  }

  /**
   * 获取当前分析结果
   */
  getResult() {
    return { ...this.result }
  }

  /**
   * 获取推荐的动画状态
   * 基于 BPM 和能量值
   */
  getRecommendedAnimation() {
    const { bpm, energy, isClimax, volume } = this.result

    if (volume < 0.1) return 'idle'
    if (isClimax) return 'happy'
    if (bpm > 110) return 'dance'
    return 'sing'
  }

  /**
   * 销毁分析器
   */
  destroy() {
    this._initialized = false
    this._beatHistory = []
    this._energyHistory = []
    this._audioContext = null
  }

  // ==================== 私有方法 ====================

  /** 模拟音量曲线 */
  _simulateVolume(progress: number, currentTime: number) {
    const baseVolume = 0.5
    const variation = Math.sin(currentTime * 2) * 0.2
    const structuralVolume =
      progress < 0.1 ? 0.7 : // 前奏
      progress > 0.8 ? 0.9 : // 尾奏
      baseVolume               // 主段
    return Math.max(0, Math.min(1, structuralVolume + variation))
  }

  /** 节拍检测 */
  _detectBeat(currentTime, volume) {
    const timeSinceLastBeat = currentTime - this._lastBeatTime
    // 简单阈值检测
    if (volume > this.beatThreshold * 0.7 && timeSinceLastBeat > 0.3) {
      this._lastBeatTime = currentTime
      this._beatHistory.push(currentTime)
      if (this._beatHistory.length > 10) this._beatHistory.shift()
      return true
    }
    return false
  }

  /** 估算 BPM */
  _estimateBPM() {
    if (this._beatHistory.length < 2) return 0
    const intervals = []
    for (let i = 1; i < this._beatHistory.length; i++) {
      intervals.push(this._beatHistory[i] - this._beatHistory[i - 1])
    }
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    return Math.round(60 / avgInterval)
  }

  /** 计算能量值 */
  _calculateEnergy(volume, isBeat) {
    const instantEnergy = volume * (isBeat ? 1.3 : 1.0)
    this._energyHistory.push(instantEnergy)
    if (this._energyHistory.length > 20) this._energyHistory.shift()

    const smoothedEnergy =
      this._energyHistory.reduce((a, b) => a + b, 0) / this._energyHistory.length
    this.result.energy = smoothedEnergy
    return smoothedEnergy
  }
}

/** 创建单例 */
let instance = null
export function getAudioAnalyzer() {
  if (!instance) {
    instance = new AudioAnalyzer()
  }
  return instance
}

export default AudioAnalyzer
