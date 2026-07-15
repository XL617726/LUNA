<script>
/**
 * LUNA · 星光歌姬 — 微信小程序根组件
 * 与 apps/web/src/App.vue 共享引擎层
 */
import { getMemorySystem, getStorySystem } from './services'

export default {
  globalData: {
    characterState: 'idle',
    characterForm: 'graduation',
    isFirstLaunch: true,
    isNightTime: false,
    audioContext: null,
    aiInitialized: false,
  },

  onLaunch(options) {
    console.log('[LUNA Miniapp] 🌙 星光歌姬启动')

    // 检查首次启动
    const hasLaunched = uni.getStorageSync('luna_has_launched')
    this.globalData.isFirstLaunch = !hasLaunched
    if (!hasLaunched) {
      uni.setStorageSync('luna_has_launched', true)
      uni.setStorageSync('luna_first_visit', Date.now())
    }

    // 检查夜间模式
    this._checkNightTime()

    // 恢复角色形态
    const savedForm = uni.getStorageSync('luna_character_form')
    if (savedForm) this.globalData.characterForm = savedForm

    // 初始化 AI
    this._initAI()
  },

  onShow() { this._checkNightTime() },

  onHide() {
    if (this.globalData.audioContext) {
      try { this.globalData.audioContext.pause() } catch (_) {}
    }
  },

  methods: {
    _checkNightTime() {
      const h = new Date().getHours()
      this.globalData.isNightTime = h >= 20 || h < 6
    },

    _initAI() {
      if (this.globalData.aiInitialized) return
      try {
        getMemorySystem().init()
        getStorySystem()
        this.globalData.aiInitialized = true
      } catch (e) {
        console.warn('[LUNA] AI 初始化失败:', e.message)
      }
    },
  },
}
</script>

<style lang="scss">
@import './uni.scss';

.luna-fade-in { animation: lunaFadeIn 0.5s ease both; }
@keyframes lunaFadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.luna-star-twinkle { animation: lunaTwinkle 2s ease-in-out infinite; }
@keyframes lunaTwinkle {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
</style>
