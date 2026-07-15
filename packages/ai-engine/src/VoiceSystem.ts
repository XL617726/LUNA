// @ts-nocheck — JS port, full TS migration tracked for Sprint 3
/**
 * LUNA 路 鏄熷厜姝屽К 鈥?璇煶绯荤粺鎺ュ彛
 *
 * 棰勭暀璇煶鍚堟垚锛圱TS锛夋帴鍙ｃ€? * 鐩墠涓烘帴鍙ｅ畾涔夊眰锛屽疄闄呭疄鐜板彲瀵规帴锛? * - 寰俊灏忕▼搴?plugin-tts
 * - 鑵捐浜戣闊冲悎鎴? * - 棰勫綍闊抽绱犳潗
 *
 * 璇煶绫诲瀷锛? * - greeting: 闂€? * - reaction: 鍙嶅簲锛堝紑蹇?鎯婅/瀹崇緸锛? * - singing: 鍞辨瓕鐩稿叧
 * - emotion: 鎯呯华琛ㄨ揪
 */

/**
 * 璇煶璧勬簮鏄犲皠
 * 棰勫綍闊抽鏂囦欢瀛樻斁鍦?assets/audio/voice/
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
 * 璇煶绯荤粺锛堟帴鍙ｅ眰锛? */
export class VoiceSystem {
  constructor(options = {}) {
    this.enabled = options.enabled !== false
    this.volume = options.volume || 0.8
    this.useTTS = options.useTTS || false // 鏄惁浣跨敤 TTS 鍚堟垚
    this.ttsConfig = options.ttsConfig || null

    this._audioContext = null
    this._playing = false
  }

  /**
   * 鎾斁棰勫綍闊抽
   * @param {string} voiceKey - VOICE_FILES 涓殑閿?   * @returns {Promise<void>}
   */
  async play(voiceKey) {
    if (!this.enabled) return

    const fileName = VOICE_FILES[voiceKey]
    if (!fileName) {
      console.warn(`[Voice] 鏈煡璇煶: ${voiceKey}`)
      return
    }

    return this._playFile(`/assets/audio/voice/${fileName}`)
  }

  /**
   * 鏍规嵁鍦烘櫙鎾斁璇煶
   * @param {string} scene - 鍦烘櫙鏍囪瘑
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
   * TTS 璇煶鍚堟垚锛堥鐣欐帴鍙ｏ級
   * @param {string} text - 瑕佸悎鎴愮殑鏂囧瓧
   * @returns {Promise<string>} 闊抽 URL
   */
  async synthesize(text) {
    if (!this.useTTS || !this.ttsConfig) {
      console.log('[Voice] TTS 鏈厤缃紝璺宠繃鍚堟垚')
      return null
    }

    // TODO: 瀵规帴鑵捐浜?TTS API
    // 鎺ュ彛棰勭暀锛岃繑鍥?null 琛ㄧず鏈疄鐜?    console.log(`[Voice] TTS 鍚堟垚: ${text.substring(0, 20)}...`)
    return null
  }

  /**
   * 鍋滄鎾斁
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
   * 璁剧疆闊抽噺
   */
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol))
    if (this._audioContext) {
      this._audioContext.volume = this.volume
    }
  }

  // ==================== 绉佹湁鏂规硶 ====================

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
          // 璇煶鎾斁澶辫触涓嶉樆濉炴祦绋?          console.warn('[Voice] 鎾斁澶辫触:', err.message)
          resolve()
        })

        this._audioContext = audio
        this._playing = true
      } catch (e) {
        console.warn('[Voice] 鎾斁寮傚父:', e.message)
        resolve()
      }
    })
  }
}

/** 鍗曚緥 */
let instance = null
export function getVoiceSystem() {
  if (!instance) {
    instance = new VoiceSystem()
  }
  return instance
}

export { VOICE_FILES }
export default VoiceSystem

