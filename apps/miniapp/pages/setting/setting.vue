<!--
  LUNA · 星光歌姬 — 设置页面
-->
<template>
  <view class="page-setting">
    <!-- 顶部 -->
    <view class="page-header">
      <text class="page-title luna-pixel-text">⚙️ 设置</text>
    </view>

    <!-- 设置项 -->
    <view class="setting-group">
      <text class="group-title">通用</text>
      <view class="setting-item">
        <text class="setting-label">播放模式</text>
        <text class="setting-value">{{ playModeLabel }}</text>
      </view>
      <view class="setting-item">
        <text class="setting-label">夜间模式语音</text>
        <text class="setting-value">{{ nightVoiceEnabled ? '开启' : '关闭' }}</text>
      </view>
    </view>

    <view class="setting-group">
      <text class="group-title">数据</text>
      <view class="setting-item" @tap="handleClearCache">
        <text class="setting-label">清除缓存</text>
        <text class="setting-value setting-action">清理</text>
      </view>
      <view class="setting-item" @tap="handleExportData">
        <text class="setting-label">导出我的回忆</text>
        <text class="setting-value setting-action">导出</text>
      </view>
    </view>

    <view class="setting-group">
      <text class="group-title">关于</text>
      <view class="setting-item">
        <text class="setting-label">版本</text>
        <text class="setting-value">V1.0.0</text>
      </view>
      <view class="setting-item" @tap="handleShowCredits">
        <text class="setting-label">制作人</text>
        <text class="setting-value setting-action">查看</text>
      </view>
    </view>

    <!-- 彩蛋区域 -->
    <view class="easter-egg-area">
      <text class="egg-title">🔍 已发现的彩蛋</text>
      <view class="egg-list">
        <text v-if="foundEggs.length === 0" class="egg-empty">还没有发现彩蛋...</text>
        <text v-for="egg in foundEggs" :key="egg" class="egg-item">{{ egg }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMusicStore } from '@/stores/music'
import { getEasterEggs, clearLunaStorage } from '@/services'

const musicStore = useMusicStore()
const nightVoiceEnabled = ref(true)
const foundEggs = ref(getEasterEggs())

const playModeLabel = computed(() => {
  const labels = { list: '列表循环', single: '单曲循环', random: '随机播放' }
  return labels[musicStore.playMode] || '列表循环'
})

const handleClearCache = () => {
  uni.showModal({
    title: '确认清除',
    content: '将清除所有本地数据，包括歌曲列表和回忆。此操作不可恢复。',
    success: (res) => {
      if (res.confirm) {
        clearLunaStorage()
        uni.showToast({ title: '已清除', icon: 'success' })
      }
    },
  })
}

const handleExportData = () => {
  uni.showToast({ title: '📦 导出功能即将开放', icon: 'none' })
}

const handleShowCredits = () => {
  uni.showModal({
    title: '⭐ 制作人',
    content: 'LUNA · 星光歌姬\n\n一个属于朋友的私人数字音乐小世界。\n\n致我最好的朋友——\n愿LUNA的歌声，陪你度过每一个重要的日子。',
    showCancel: false,
  })
}
</script>

<style lang="scss" scoped>
.page-setting {
  min-height: 100vh;
  background: $color-bg-primary;
  padding-bottom: $space-xl;
}
.page-header {
  padding: $space-lg;
}
.page-title {
  font-size: $font-size-xl;
  color: $color-accent;
}

.setting-group {
  padding: 0 $space-lg;
  margin-bottom: $space-xl;
}
.group-title {
  font-size: $font-size-xs;
  color: $color-text-muted;
  text-transform: uppercase;
  letter-spacing: 4rpx;
  margin-bottom: $space-sm;
  display: block;
}
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-md 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.setting-label {
  font-size: $font-size-md;
  color: $color-text-primary;
}
.setting-value {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}
.setting-action {
  color: $color-accent;
}

/* 彩蛋 */
.easter-egg-area {
  padding: $space-xl $space-lg;
}
.egg-title {
  font-size: $font-size-md;
  color: $color-text-primary;
  margin-bottom: $space-sm;
  display: block;
}
.egg-list {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
}
.egg-empty {
  font-size: $font-size-sm;
  color: $color-text-muted;
}
.egg-item {
  padding: $space-xs $space-sm;
  background: rgba($color-star, 0.1);
  border: 1px solid rgba($color-star, 0.3);
  border-radius: 20rpx;
  font-size: $font-size-sm;
  color: $color-star;
}
</style>
