<!--
  LUNA · 星光歌姬 — 角色中心
  类似游戏衣柜，支持三种形态切换
  切换动画：像素碎片消散 → 星光出现
-->
<template>
  <view class="page-character">
    <!-- 顶部标题 -->
    <view class="page-header">
      <text class="page-title luna-pixel-text">👗 角色衣柜</text>
      <text class="page-subtitle">选择 LUNA 的形态</text>
    </view>

    <!-- 当前形态预览 -->
    <view class="preview-area">
      <view class="preview-character">
        <text class="preview-icon">{{ currentFormIcon }}</text>
        <text class="preview-name">{{ currentFormInfo.name }}</text>
        <text class="preview-theme">《{{ currentFormInfo.theme }}》</text>
      </view>
    </view>

    <!-- 形态切换卡片（Task06 CharacterSwitcher 接入点）-->
    <view class="form-cards">
      <view
        v-for="form in forms"
        :key="form.id"
        class="form-card"
        :class="{ active: characterStore.currentForm === form.id }"
        @tap="handleSwitch(form.id)"
      >
        <view class="card-bg" :class="form.bgClass" />
        <view class="card-content">
          <text class="card-icon">{{ form.icon }}</text>
          <view class="card-info">
            <text class="card-name">{{ form.name }}</text>
            <text class="card-theme">{{ form.theme }}</text>
          </view>
          <view v-if="characterStore.currentForm === form.id" class="card-badge">
            <text>当前</text>
          </view>
        </view>
        <view class="card-detail">
          <text class="detail-label">场景元素</text>
          <view class="detail-tags">
            <text v-for="elem in form.elements" :key="elem" class="tag">{{ elem }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 动作解锁状态 -->
    <view class="unlocked-section">
      <text class="section-title">已解锁动作</text>
      <view class="action-tags">
        <text
          v-for="action in characterStore.unlocked.actions"
          :key="action"
          class="action-tag"
        >
          {{ actionLabels[action] || action }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCharacterStore } from '@/stores/character'

const characterStore = useCharacterStore()

const forms = [
  {
    id: 'graduation',
    name: '🎓 毕业生',
    theme: '那个夏天',
    icon: '🎓',
    bgClass: 'bg-school',
    elements: ['学士服', '毕业帽', '花束', '校园'],
  },
  {
    id: 'live',
    name: '🎤 女主播',
    theme: '第一次站上舞台',
    icon: '🎤',
    bgClass: 'bg-live',
    elements: ['直播间', '麦克风', '电脑', 'RGB灯'],
  },
  {
    id: 'CEO',
    name: '💼 CEO',
    theme: '未来的自己',
    icon: '💼',
    bgClass: 'bg-office',
    elements: ['办公室', '城市夜景', '文件', '奖杯'],
  },
]

const actionLabels = {
  idle: '🧍 待机',
  sing: '🎵 唱歌',
  dance: '💃 跳舞',
  happy: '😊 开心',
  bow: '🙇 谢幕',
}

const currentFormInfo = computed(() => characterStore.formInfo)
const currentFormIcon = computed(() => {
  const icons = { graduation: '🎓', live: '🎤', CEO: '💼' }
  return icons[characterStore.currentForm] || '🎤'
})

const handleSwitch = (formId) => {
  if (characterStore.currentForm === formId) return

  // 切换过渡（Task06 将添加碎片消散动画）
  uni.showLoading({ title: '变换中...', mask: true })
  setTimeout(() => {
    characterStore.switchForm(formId)
    uni.hideLoading()
    uni.showToast({
      title: `已切换至${currentFormInfo.value.name}`,
      icon: 'none',
    })
  }, 500)
}
</script>

<style lang="scss" scoped>
.page-character {
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

/* 当前形态预览 */
.preview-area {
  padding: $space-lg;
  display: flex;
  justify-content: center;
}
.preview-character {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $space-xl;
  background: $color-bg-card;
  border-radius: 16rpx;
  border: 1px solid rgba($color-accent, 0.2);
  gap: $space-sm;
  width: 300rpx;
}
.preview-icon { font-size: 80rpx; }
.preview-name { font-size: $font-size-lg; color: $color-accent; }
.preview-theme { font-size: $font-size-sm; color: $color-text-secondary; }

/* 形态卡片 */
.form-cards {
  padding: 0 $space-lg;
  display: flex;
  flex-direction: column;
  gap: $space-md;
}
.form-card {
  padding: $space-lg;
  border-radius: 12rpx;
  border: 2px solid transparent;
  background: $color-bg-card;
  transition: all $transition-normal;
  position: relative;
  overflow: hidden;

  &.active {
    border-color: $color-accent;
    box-shadow: 0 0 24rpx rgba($color-accent, 0.15);
  }
}
.card-content {
  display: flex;
  align-items: center;
  gap: $space-md;
  position: relative;
  z-index: 1;
}
.card-icon { font-size: 48rpx; }
.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.card-name { font-size: $font-size-lg; color: $color-text-primary; }
.card-theme { font-size: $font-size-sm; color: $color-text-secondary; }
.card-badge {
  padding: 4rpx 16rpx;
  background: $color-accent;
  border-radius: 20rpx;

  text {
    font-size: $font-size-xs;
    color: $color-bg-primary;
  }
}
.card-detail {
  margin-top: $space-md;
  position: relative;
  z-index: 1;
}
.detail-label {
  font-size: $font-size-xs;
  color: $color-text-muted;
}
.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $space-xs;
  margin-top: $space-xs;
}
.tag {
  padding: 4rpx 16rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4rpx;
  font-size: $font-size-xs;
  color: $color-text-secondary;
}

/* 已解锁动作 */
.unlocked-section {
  padding: $space-xl $space-lg;
}
.section-title {
  font-size: $font-size-sm;
  color: $color-text-muted;
  margin-bottom: $space-sm;
}
.action-tags {
  display: flex;
  gap: $space-sm;
}
.action-tag {
  padding: $space-xs $space-sm;
  background: rgba($color-success, 0.1);
  border: 1px solid rgba($color-success, 0.3);
  border-radius: 8rpx;
  font-size: $font-size-sm;
}
</style>
