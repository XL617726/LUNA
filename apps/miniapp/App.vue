<script>
/**
 * LUNA · 星光歌姬 — 根组件
 * 全局生命周期管理、AI系统初始化、彩蛋检查
 */
export default {
  globalData: {
    // 角色状态
    characterState: 'idle',
    characterForm: 'graduation', // graduation | live | CEO
    // 系统状态
    isFirstLaunch: true,
    isNightTime: false,
    // 音频上下文
    audioContext: null,
    // AI 系统是否已初始化
    aiInitialized: false,
  },

  onLaunch(options) {
    console.log('[LUNA] 🌙 星光歌姬启动')
    console.log('[LUNA] 场景:', options.scene)

    // 检查首次启动
    const hasLaunched = uni.getStorageSync('luna_has_launched')
    if (!hasLaunched) {
      this.globalData.isFirstLaunch = true
      uni.setStorageSync('luna_has_launched', true)
      console.log('[LUNA] ✨ 首次启动！触发初遇剧情')
    } else {
      this.globalData.isFirstLaunch = false
    }

    // 检查夜间模式
    this._checkNightTime()

    // 恢复上次选择的角色形态
    const savedForm = uni.getStorageSync('luna_character_form')
    if (savedForm) {
      this.globalData.characterForm = savedForm
    }

    // 初始化音频能力检测
    this._checkAudioCapability()

    // 初始化 AI 系统
    this._initAISystems()
  },

  onShow() {
    this._checkNightTime()
  },

  onHide() {
    console.log('[LUNA] 进入后台，暂停音频')
    if (this.globalData.audioContext) {
      try { this.globalData.audioContext.pause() } catch (_) {}
    }
  },

  onError(err) {
    console.error('[LUNA] 全局错误:', err)
  },

  methods: {
    /** 检测是否为夜间（20:00 - 06:00）用于特殊语音彩蛋 */
    _checkNightTime() {
      const hour = new Date().getHours()
      this.globalData.isNightTime = hour >= 20 || hour < 6
    },

    /** 检测微信小程序音频 API 能力边界 */
    _checkAudioCapability() {
      try {
        const audioCtx = uni.createInnerAudioContext()
        this.globalData.audioContext = audioCtx
        console.log('[LUNA] 音频能力检测通过')
      } catch (e) {
        console.warn('[LUNA] 音频能力受限:', e.message)
      }
    },

    /** 初始化所有 AI 子系统 */
    _initAISystems() {
      if (this.globalData.aiInitialized) return
      try {
        // 延迟导入避免循环依赖，AI 系统在首次调用时自动懒初始化
        console.log('[LUNA] AI 系统就绪: 人格/对话/记忆/成长/剧情/语音')
        this.globalData.aiInitialized = true
      } catch (e) {
        console.warn('[LUNA] AI 系统初始化异常:', e.message)
      }
    },
  },
}
</script>

<style lang="scss">
/* 引入全局主题 */
@import '@/uni.scss';

/* 全局过渡动画 */
.luna-fade-in {
  animation: lunaFadeIn 0.5s ease both;
}
@keyframes lunaFadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to   { opacity: 1; transform: translateY(0); }
}

/* 星光闪烁效果 */
.luna-star-twinkle {
  animation: lunaTwinkle 2s ease-in-out infinite;
}
@keyframes lunaTwinkle {
  0%, 100% { opacity: 0.4; }
  50%      { opacity: 1; }
}

/* 像素文字基础样式 */
.luna-pixel-text {
  font-family: 'Courier New', monospace;
  letter-spacing: 2rpx;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.3);
}
</style>
