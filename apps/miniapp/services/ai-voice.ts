/**
 * LUNA · 星光歌姬 — 语音系统接口
 *
 * 预留语音合成（TTS）接口。
 * 目前为接口定义层，实际实现可对接：
 * - 微信小程序 plugin-tts
 * - 腾讯云语音合成
 * - 预录音频素材
 *
 * 语音类型：
 * - greeting: 问候
 * - reaction: 反应（开心/惊讶/害羞）
 * - singing: 唱歌相关
 * - emotion: 情绪表达
 */

/**
 * 语音资源映射
 * 预录音频文件存放在 assets/audio/voice/
 */
const VOICE_FILES = {
  greeting_hello: 'hello.mp3',
  greeting_welcome: 'welcome.mp3',
  reaction_happy: 'happy_laugh.mp3',
  reaction_surprise: 'surprise.mp3',
  reaction_shy: 'shy.mp3',
  singing_start: 'singing_start.mp3',
  singing_encore: 'encore.mp3',
  emotion_warm: 'warm_sigh.mp3',
  emotion_excited: 'excited.mp3',
}

/**
 * 语音系统（接口层）
 */
export class VoiceSystem {
  constructor(options = {}) {
    this.enabled = options.enabled !== false
    this.volume = options.volume || 0.8
    this.useTTS = options.useTTS || false // 是否使用 TTS 合成
    this.ttsConfig = options.ttsConfig || null

    this._audioContext = null
    this._playing = false
  }

  /**
   * 播放预录音频
   * @param {string} voiceKey - VOICE_FILES 中的键
   * @returns {Promise<void>}
   */
  async play(voiceKey) {
    if (!this.enabled) return

    const fileName = VOICE_FILES[voiceKey]
    if (!fileName) {
      console.warn(`[Voice] 未知语音: ${voiceKey}`)
      return
    }

    return this._playFile(`/assets/audio/voice/${fileName}`)
  }

  /**
   * 根据场景播放语音
   * @param {string} scene - 场景标识
   */
  async speakScene(scene) {
    const voiceMap = {
      first_meet: 'greeting_hello',
      greeting: 'greeting_welcome',
      music_climax: 'emotion_excited',
      level_up: 'reaction_happy',
      night: 'emotion_warm',
      birthday: 'reaction_surprise',
    }

    const voiceKey = voiceMap[scene]
    if (voiceKey) {
      await this.play(voiceKey)
    }
  }

  /**
   * TTS 语音合成（预留接口）
   * @param {string} text - 要合成的文字
   * @returns {Promise<string>} 音频 URL
   */
  async synthesize(text) {
    if (!this.useTTS || !this.ttsConfig) {
      console.log('[Voice] TTS 未配置，跳过合成')
      return null
    }

    // TODO: 对接腾讯云 TTS API
    // 接口预留，返回 null 表示未实现
    console.log(`[Voice] TTS 合成: ${text.substring(0, 20)}...`)
    return null
  }

  /**
   * 停止播放
   */
  stop() {
    if (this._audioContext) {
      this._audioContext.stop()
      this._audioContext.destroy()
      this._audioContext = null
    }
    this._playing = false
  }

  /**
   * 设置音量
   */
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol))
    if (this._audioContext) {
      this._audioContext.volume = this.volume
    }
  }

  // ==================== 私有方法 ====================

  _playFile(filePath) {
    return new Promise((resolve, reject) => {
      try {
        const audio = uni.createInnerAudioContext()
        audio.src = filePath
        audio.volume = this.volume
        audio.autoplay = true

        audio.onEnded(() => {
          this._playing = false
          audio.destroy()
          resolve()
        })

        audio.onError((err) => {
          this._playing = false
          audio.destroy()
          // 语音播放失败不阻塞流程
          console.warn('[Voice] 播放失败:', err.message)
          resolve()
        })

        this._audioContext = audio
        this._playing = true
      } catch (e) {
        console.warn('[Voice] 播放异常:', e.message)
        resolve()
      }
    })
  }
}

/** 单例 */
let instance = null
export function getVoiceSystem() {
  if (!instance) {
    instance = new VoiceSystem()
  }
  return instance
}

export { VOICE_FILES }
export default VoiceSystem
