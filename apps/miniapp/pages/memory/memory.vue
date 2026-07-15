<!--
  LUNA · 星光歌姬 — 回忆空间
  包含：图片墙、留言、隐藏剧情入口
-->
<template>
  <view class="page-memory">
    <!-- 顶部 -->
    <view class="page-header">
      <text class="page-title luna-pixel-text">💫 回忆空间</text>
      <text class="page-subtitle">保存与 LUNA 的每一个瞬间</text>
    </view>

    <!-- 回忆统计 -->
    <view class="memory-stats">
      <view class="stat-item">
        <text class="stat-num">{{ stats.interactionDays }}</text>
        <text class="stat-label">相伴天数</text>
      </view>
      <view class="stat-item">
        <text class="stat-num">{{ stats.totalPlays }}</text>
        <text class="stat-label">播放次数</text>
      </view>
      <view class="stat-item">
        <text class="stat-num">{{ stats.totalSongs }}</text>
        <text class="stat-label">收藏歌曲</text>
      </view>
    </view>

    <!-- 图片墙（预留）-->
    <view class="photo-wall">
      <text class="section-title">📷 记忆相册</text>
      <view class="photo-grid">
        <view
          v-for="i in 6"
          :key="i"
          class="photo-slot"
        >
          <text class="photo-placeholder">🖼️</text>
          <text class="photo-hint">等待回忆</text>
        </view>
      </view>
    </view>

    <!-- 留言列表 -->
    <view class="messages">
      <text class="section-title">💌 留言</text>
      <view class="message-list">
        <view class="message-item system-message">
          <text class="msg-author">LUNA</text>
          <text class="msg-content">每一首歌，都是一段回忆 ✨</text>
          <text class="msg-time">现在</text>
        </view>
      </view>
      <view class="add-message" @tap="handleAddMessage">
        <text class="add-icon">+</text>
        <text class="add-text">留下想说的话</text>
      </view>
    </view>

    <!-- 隐藏剧情入口（Task07 彩蛋系统接入）-->
    <view class="hidden-story-section">
      <text class="section-title">🔮 隐藏剧情</text>
      <view class="story-list">
        <view
          v-for="story in stories"
          :key="story.id"
          class="story-item"
          :class="{ locked: !story.unlocked }"
          @tap="story.unlocked ? handleOpenStory(story) : null"
        >
          <text class="story-icon">{{ story.unlocked ? story.icon : '🔒' }}</text>
          <view class="story-info">
            <text class="story-name">{{ story.unlocked ? story.name : '???' }}</text>
            <text class="story-hint">{{ story.hint }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useCharacterStore } from '@/stores/character'

const characterStore = useCharacterStore()
const stats = computed(() => characterStore.stats)

const stories = [
  {
    id: 'first_meet',
    name: '初遇',
    icon: '🌟',
    hint: '第一次打开小程序',
    unlocked: true,
  },
  {
    id: 'first_song',
    name: '第一首歌',
    icon: '🎵',
    hint: '上传第一首歌曲',
    unlocked: false,
  },
  {
    id: 'ten_songs',
    name: '音乐马拉松',
    icon: '🏆',
    hint: '连续播放10首歌',
    unlocked: false,
  },
  {
    id: 'birthday',
    name: '生日快乐',
    icon: '🎂',
    hint: '在生日那天打开',
    unlocked: false,
  },
  {
    id: 'night_visit',
    name: '深夜访客',
    icon: '🌙',
    hint: '在深夜打开',
    unlocked: false,
  },
]

const handleAddMessage = () => {
  uni.showToast({ title: '💌 留言功能即将开放', icon: 'none' })
}

const handleOpenStory = (story) => {
  uni.showModal({
    title: story.name,
    content: `剧情「${story.name}」将在 Task07 中实现`,
    showCancel: false,
  })
}
</script>

<style lang="scss" scoped>
.page-memory {
  min-height: 100vh;
  background: $color-bg-primary;
  padding-bottom: $space-xl;
}
.page-header {
  padding: $space-lg;
  display: flex;
  flex-direction: column;
  gap: $space-xs;
}
.page-title {
  font-size: $font-size-xl;
  color: $color-accent;
}
.page-subtitle {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

/* 统计 */
.memory-stats {
  display: flex;
  padding: $space-lg;
  gap: $space-md;
}
.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $space-md;
  background: $color-bg-card;
  border-radius: 8rpx;
}
.stat-num {
  font-size: $font-size-xl;
  color: $color-accent;
  font-family: $font-pixel;
}
.stat-label {
  font-size: $font-size-xs;
  color: $color-text-muted;
  margin-top: $space-xs;
}

.section-title {
  font-size: $font-size-md;
  color: $color-text-primary;
  padding: 0 $space-lg;
  margin-bottom: $space-md;
  display: block;
}

/* 图片墙 */
.photo-wall {
  padding: $space-lg 0;
}
.photo-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 0 $space-lg;
  gap: $space-sm;
}
.photo-slot {
  width: calc(33.33% - 8rpx);
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: $color-bg-card;
  border-radius: 8rpx;
  border: 1px dashed rgba(255, 255, 255, 0.1);
}
.photo-placeholder { font-size: 36rpx; opacity: 0.4; }
.photo-hint { font-size: $font-size-xs; color: $color-text-muted; }

/* 留言 */
.messages {
  padding: $space-lg 0;
}
.message-list {
  padding: 0 $space-lg;
}
.message-item {
  padding: $space-md;
  background: $color-bg-card;
  border-radius: 8rpx;
  margin-bottom: $space-sm;
  display: flex;
  flex-direction: column;
  gap: $space-xs;
}
.msg-author {
  font-size: $font-size-sm;
  color: $color-accent;
}
.msg-content {
  font-size: $font-size-md;
  color: $color-text-primary;
}
.msg-time {
  font-size: $font-size-xs;
  color: $color-text-muted;
}
.add-message {
  display: flex;
  align-items: center;
  gap: $space-sm;
  padding: $space-md $space-lg;
  margin: 0 $space-lg;
  border: 1px dashed rgba($color-accent, 0.3);
  border-radius: 8rpx;
  justify-content: center;

  &:active { background: rgba($color-accent, 0.05); }
}
.add-icon {
  color: $color-accent;
  font-size: $font-size-lg;
}
.add-text {
  color: $color-text-secondary;
  font-size: $font-size-sm;
}

/* 隐藏剧情 */
.hidden-story-section {
  padding: $space-lg 0;
}
.story-list {
  padding: 0 $space-lg;
  display: flex;
  flex-direction: column;
  gap: $space-sm;
}
.story-item {
  display: flex;
  align-items: center;
  padding: $space-md;
  background: $color-bg-card;
  border-radius: 8rpx;
  gap: $space-md;
  transition: all $transition-fast;

  &.locked {
    opacity: 0.5;
  }

  &:not(.locked):active {
    background: rgba($color-accent, 0.08);
  }
}
.story-icon { font-size: 36rpx; }
.story-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.story-name { font-size: $font-size-md; color: $color-text-primary; }
.story-hint { font-size: $font-size-xs; color: $color-text-muted; }
</style>
