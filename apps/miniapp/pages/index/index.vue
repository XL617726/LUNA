<!--
  LUNA · 星光歌姬 — 首页（整合版）
  像一个游戏世界，不是APP
  LUNA角色 + 音乐舞台 + 麦克风 + 星光粒子 + AI对话
-->
<template>
  <view class="page-index">
    <!-- === 场景背景 === -->
    <SceneManager :form="characterStore.currentForm" @interact="handleSceneInteract" />

    <!-- === 角色区域 === -->
    <view class="character-stage">
      <PixelCharacter
        ref="pixelCharRef"
        :form="characterStore.currentForm"
        :animation="currentAnimation"
        :size="400"
        @ready="handleCharReady"
        @tap="handleCharTap"
      />
    </view>

    <!-- === LUNA 对话气泡 === -->
    <view v-if="dialogueText" class="dialogue-bubble" :class="{ show: !!dialogueText }">
      <text class="dialogue-text">{{ dialogueText }}</text>
    </view>

    <!-- === AnimationController（逻辑组件）=== -->
    <AnimationController
      ref="animCtrlRef"
      :audioData="audioAnalysis"
      :isPlaying="musicStore.isPlaying"
      :musicDriven="true"
      @animation-change="handleAnimChange"
      @beat="handleBeat"
      @climax="handleClimax"
    />

    <!-- === 迷你播放器 === -->
    <view v-if="musicStore.currentSong" class="mini-player-bar" @tap="goToMusic">
      <MusicWaveform
        :energy="audioAnalysis.energy"
        :isPlaying="musicStore.isPlaying"
        :height="40"
        :barCount="16"
      />
      <text class="mini-song-name">{{ musicStore.currentSong.name }}</text>
      <text class="mini-play-btn" @tap.stop="handleTogglePlay">
        {{ musicStore.isPlaying ? '⏸' : '▶️' }}
      </text>
    </view>

    <!-- === 底部导航 === -->
    <view class="nav-buttons">
      <view class="nav-btn" @tap="handleSingAction">
        <text class="nav-btn-icon">🎤</text>
        <text class="nav-btn-label">唱歌</text>
      </view>
      <view class="nav-btn" @tap="goToMusic">
        <text class="nav-btn-icon">🎼</text>
        <text class="nav-btn-label">歌曲</text>
      </view>
      <view class="nav-btn" @tap="goToCharacter">
        <text class="nav-btn-icon">👗</text>
        <text class="nav-btn-label">换装</text>
      </view>
      <view class="nav-btn" @tap="goToMemory">
        <text class="nav-btn-icon">💫</text>
        <text class="nav-btn-label">回忆</text>
      </view>
    </view>

    <!-- === 隐藏星星 === -->
    <view class="hidden-star" @tap="handleStarButton">
      <text>⭐</text>
    </view>

    <!-- === 升级提示 === -->
    <view v-if="showLevelUp" class="level-up-toast">
      <text class="level-up-icon">🌟</text>
      <text class="level-up-title">升级了！</text>
      <text class="level-up-detail">{{ levelUpMessage }}</text>
    </view>
  </view>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useCharacterStore } from '@/stores/character'
import { useMusicStore } from '@/stores/music'

// 组件（展示层）
import PixelCharacter from '@/components/PixelCharacter/PixelCharacter.vue'
import AnimationController from '@/components/AnimationController/AnimationController.vue'
import SceneManager from '@/components/SceneManager/SceneManager.vue'
import MusicWaveform from '@/components/MusicPlayer/Waveform.vue'

// 引擎层（业务逻辑）
import { getDialogueEngine, getMemorySystem, getGrowthSystem, getStorySystem } from '@/services'

export default {
  components: {
    PixelCharacter, AnimationController, SceneManager, MusicWaveform,
  },

  setup() {
    const characterStore = useCharacterStore()
    const musicStore = useMusicStore()

    // Refs
    const pixelCharRef = ref(null)
    const animCtrlRef = ref(null)

    // 状态
    const currentAnimation = ref('idle')
    const audioAnalysis = ref({ bpm: 0, volume: 0, beat: false, energy: 0, isClimax: false })
    const dialogueText = ref('')
    const showLevelUp = ref(false)
    const levelUpMessage = ref('')
    let dialogueTimer = null

    // AI 系统实例
    const dialogue = getDialogueEngine()
    const memory = getMemorySystem()
    const growth = getGrowthSystem()
    const story = getStorySystem()

    // ==================== 初始化 ====================

    onMounted(() => {
      // 记录互动
      characterStore.recordInteraction()

      // 检查彩蛋触发
      const app = getApp()?.globalData || {}
      const triggers = story.checkTriggers({
        isFirstLaunch: app.isFirstLaunch,
        isNightTime: app.isNightTime,
        isBirthday: memory.isTodayBirthday(),
        consecutivePlays: musicStore.hiddenSongUnlocked ? 10 : 0,
      })

      // 显示剧情对话
      if (triggers.length > 0) {
        showDialogue(triggers[0].dialogue, 3000)
      } else if (app.isFirstLaunch) {
        showDialogue('你好，我等你很久了。', 3000)
      } else if (app.isNightTime) {
        showDialogue(dialogue.speak('night'), 3000)
      } else {
        // 日常问候
        setTimeout(() => {
          showDialogue(dialogue.speak('greeting'), 2500)
        }, 1500)
      }

      // 检查升级
      const levelResult = growth.checkLevelUp(characterStore.stats)
      if (levelResult?.leveledUp) {
        showLevelUp.value = true
        levelUpMessage.value = levelResult.message
        setTimeout(() => { showLevelUp.value = false }, 4000)
      }
    })

    // ==================== 对话气泡 ====================

    function showDialogue(text, duration = 2500) {
      dialogueText.value = text
      if (dialogueTimer) clearTimeout(dialogueTimer)
      dialogueTimer = setTimeout(() => {
        dialogueText.value = ''
      }, duration)
    }

    // ==================== 事件处理 ====================

    function handleCharReady(data) {
      console.log('[Index] 角色就绪:', data)
    }

    function handleCharTap() {
      showDialogue(dialogue.speak('greeting'))
      characterStore.recordInteraction()
    }

    function handleAnimChange({ from, to }) {
      currentAnimation.value = to

      // 舞蹈状态时触发对话
      if (to === 'dance') {
        showDialogue(dialogue.speak('music_dance'))
      } else if (to === 'happy') {
        showDialogue(dialogue.speak('music_climax'))
      }
    }

    function handleBeat(data) {
      // 节拍可以驱动短期特效（未来扩展）
    }

    function handleClimax(data) {
      showDialogue(dialogue.speak('music_climax'), 2000)
    }

    function handleSceneInteract({ target }) {
      if (target === 'mic') {
        handleSingAction()
      }
      if (target === 'trophy') {
        showDialogue('这些都是我们一起努力得来的 ✨')
      }
    }

    function handleSingAction() {
      if (musicStore.isEmpty) {
        showDialogue('还没有歌曲呢...去上传一首吧 🎵')
        setTimeout(() => uni.navigateTo({ url: '/pages/music/music' }), 1500)
      } else if (!musicStore.isPlaying) {
        musicStore.resume()
        showDialogue(dialogue.speak('music_play'))
      } else {
        musicStore.pause()
        showDialogue(dialogue.speak('music_stop'))
      }
    }

    function handleTogglePlay() {
      musicStore.isPlaying ? musicStore.pause() : musicStore.resume()
    }

    function handleStarButton() {
      const result = story.triggerStory('hidden_star')
      if (result) {
        uni.showModal({
          title: '⭐ 制作人留言',
          content: result.dialogue,
          showCancel: false,
        })
      }
    }

    // 路由
    function goToMusic() { uni.navigateTo({ url: '/pages/music/music' }) }
    function goToCharacter() { uni.navigateTo({ url: '/pages/character/character' }) }
    function goToMemory() { uni.navigateTo({ url: '/pages/memory/memory' }) }

    return {
      // Store
      characterStore, musicStore,
      // Refs
      pixelCharRef, animCtrlRef,
      // State
      currentAnimation, audioAnalysis, dialogueText, showLevelUp, levelUpMessage,
      // Events
      handleCharReady, handleCharTap, handleAnimChange, handleBeat, handleClimax,
      handleSceneInteract, handleSingAction, handleTogglePlay, handleStarButton,
      goToMusic, goToCharacter, goToMemory,
    }
  },
}
</script>

<style lang="scss" scoped>
.page-index {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: $color-bg-primary;
}

/* ---- 角色舞台 ---- */
.character-stage {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  z-index: $z-character;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ---- 对话气泡 ---- */
.dialogue-bubble {
  position: absolute;
  top: 58%;
  left: 50%;
  transform: translateX(-50%);
  z-index: $z-ui;
  padding: $space-sm $space-lg;
  background: rgba(22, 33, 62, 0.92);
  border: 1px solid rgba($color-accent, 0.3);
  border-radius: 20rpx;
  max-width: 500rpx;
  opacity: 0;
  transition: opacity 0.3s ease;

  &.show {
    opacity: 1;
  }
}
.dialogue-text {
  font-size: $font-size-sm;
  color: $color-text-primary;
  line-height: 1.6;
  text-align: center;
}

/* ---- 迷你播放器 ---- */
.mini-player-bar {
  position: absolute;
  top: 70%;
  left: 5%;
  right: 5%;
  z-index: $z-ui;
  display: flex;
  align-items: center;
  padding: $space-sm $space-md;
  background: rgba(22, 33, 62, 0.85);
  border-radius: 32rpx;
  border: 1px solid rgba(255, 255, 255, 0.08);
  gap: $space-sm;
}
.mini-song-name {
  flex: 1;
  font-size: $font-size-xs;
  color: $color-text-secondary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mini-play-btn {
  font-size: 32rpx;
  padding: $space-xs;

  &:active { transform: scale(0.85); }
}

/* ---- 底部导航 ---- */
.nav-buttons {
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: $space-xl;
  z-index: $z-ui;
}
.nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  padding: $space-sm $space-md;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12rpx;
  transition: all $transition-fast;

  &:active {
    background: rgba($color-accent, 0.12);
    border-color: rgba($color-accent, 0.25);
    transform: scale(0.94);
  }
}
.nav-btn-icon { font-size: 36rpx; }
.nav-btn-label { font-size: 20rpx; color: $color-text-secondary; }

/* ---- 隐藏星星 ---- */
.hidden-star {
  position: absolute;
  top: 60rpx;
  right: 36rpx;
  z-index: $z-ui;
  opacity: 0.35;
  font-size: 32rpx;
  padding: $space-xs;

  &:active { opacity: 0.8; }
}

/* ---- 升级提示 ---- */
.level-up-toast {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: $z-overlay;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-sm;
  padding: $space-xl;
  background: rgba(22, 33, 62, 0.95);
  border: 2px solid $color-accent;
  border-radius: 16rpx;
  box-shadow: 0 0 48rpx rgba($color-accent, 0.3);
  animation: lunaFadeIn 0.5s ease;
}
.level-up-icon { font-size: 64rpx; }
.level-up-title {
  font-size: $font-size-xl;
  color: $color-accent;
  font-family: $font-pixel;
}
.level-up-detail {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  text-align: center;
}
</style>
