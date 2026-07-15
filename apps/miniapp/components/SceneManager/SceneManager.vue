<!--
  LUNA · 星光歌姬 — SceneManager 场景管理器
  根据角色形态切换背景场景

  场景: school / live / office
  互动对象: mic / window / plant / wardrobe
-->
<template>
  <view class="scene-manager" :class="currentScene">
    <!-- 背景层 -->
    <view class="scene-background">
      <!-- 学校场景 -->
      <view v-if="currentScene === 'school'" class="scene school-scene">
        <view class="bg-element window-element">
          <text class="element-emoji">🪟</text>
        </view>
        <view class="bg-element plant-element">
          <text class="element-emoji">🪴</text>
        </view>
        <view class="bg-element desk-element">
          <text class="element-emoji">📚</text>
        </view>
      </view>

      <!-- 直播场景 -->
      <view v-if="currentScene === 'live'" class="scene live-scene">
        <view class="bg-element mic-element" @tap="handleInteract('mic')">
          <text class="element-emoji">🎤</text>
        </view>
        <view class="bg-element ringlight-element">
          <text class="element-emoji">💡</text>
        </view>
        <view class="bg-element monitor-element">
          <text class="element-emoji">🖥️</text>
        </view>
      </view>

      <!-- 办公室场景 -->
      <view v-if="currentScene === 'office'" class="scene office-scene">
        <view class="bg-element window-element">
          <text class="element-emoji">🌃</text>
        </view>
        <view class="bg-element desk-element">
          <text class="element-emoji">📊</text>
        </view>
        <view class="bg-element trophy-element" @tap="handleInteract('trophy')">
          <text class="element-emoji">🏆</text>
        </view>
      </view>
    </view>

    <!-- 场景名称标签 -->
    <view class="scene-label">
      <text>{{ sceneName }}</text>
    </view>
  </view>
</template>

<script>
import { useCharacterStore } from '@/stores/character'

const SCENE_MAP = {
  graduation: 'school',
  live: 'live',
  CEO: 'office',
}

const SCENE_NAMES = {
  school: '🏫 校园',
  live: '🎬 直播间',
  office: '🏢 办公室',
}

export default {
  name: 'SceneManager',

  props: {
    form: { type: String, default: 'graduation' },
  },

  emits: ['interact'],

  computed: {
    characterStore() { return useCharacterStore() },
    currentScene() {
      return SCENE_MAP[this.form] || SCENE_MAP[this.characterStore.currentForm] || 'school'
    },
    sceneName() {
      return SCENE_NAMES[this.currentScene] || ''
    },
  },

  methods: {
    handleInteract(target) {
      this.$emit('interact', { target, scene: this.currentScene })

      const messages = {
        mic: '麦克风已就绪 🎤',
        trophy: '属于你的奖杯 ✨',
      }
      if (messages[target]) {
        uni.showToast({ title: messages[target], icon: 'none' })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.scene-manager {
  position: relative;
  width: 100%;
  min-height: 400rpx;
  border-radius: 16rpx;
  overflow: hidden;
  transition: background 0.5s ease;
}

.scene-background {
  position: absolute;
  inset: 0;
}

/* 场景基础 */
.scene {
  width: 100%;
  height: 100%;
  position: relative;
  min-height: 400rpx;
}

/* 学校场景 */
.school-scene {
  background: linear-gradient(180deg, #87ceeb33, #1a3a5c66, #0f0f23);
}

/* 直播间场景 */
.live-scene {
  background: linear-gradient(180deg, #2a1a3a, #4a1a3a, #0f0f23);
}

/* 办公室场景 */
.office-scene {
  background: linear-gradient(180deg, #1a1a3a, #1a2a4a, #0f0f23);
}

/* 背景元素 */
.bg-element {
  position: absolute;
  opacity: 0.5;
  transition: all 0.3s ease;

  &:active {
    opacity: 0.8;
    transform: scale(1.1);
  }
}
.element-emoji {
  font-size: 48rpx;
}

/* 元素位置 */
.window-element { top: 10%; right: 15%; }
.plant-element { bottom: 20%; left: 10%; }
.desk-element { bottom: 10%; right: 20%; }
.mic-element { top: 15%; left: 20%; }
.ringlight-element { top: 10%; right: 20%; }
.monitor-element { bottom: 15%; left: 15%; }
.trophy-element { top: 20%; right: 25%; }

/* 场景标签 */
.scene-label {
  position: absolute;
  bottom: $space-sm;
  left: $space-sm;
  padding: 4rpx 16rpx;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20rpx;

  text {
    font-size: $font-size-xs;
    color: $color-text-secondary;
  }
}
</style>
