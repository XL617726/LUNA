<!--
  LUNA · 星光歌姬 — UploadBox 上传组件
  拖拽/选择文件 → 校验 → 上传 → 完成

  功能：
  - 支持 MP3 / WAV / M4A
  - 上传进度条
  - 批量上传
  - 自动 BPM 检测（上传后触发）
-->
<template>
  <view class="upload-box">
    <!-- 上传区域 -->
    <view
      class="drop-zone"
      :class="{ active: isDragging, uploading: isUploading }"
      @tap="handleChooseFile"
    >
      <!-- 空闲状态 -->
      <view v-if="!isUploading" class="drop-content">
        <text class="drop-icon">📤</text>
        <text class="drop-title">点击上传歌曲</text>
        <text class="drop-hint">
          支持 {{ supportedFormats.join(' / ') }}
        </text>
        <text class="drop-limit">
          最大 {{ maxSizeMB }}MB
        </text>
      </view>

      <!-- 上传中 -->
      <view v-else class="uploading-content">
        <text class="uploading-icon">⏳</text>
        <text class="uploading-title">正在上传...</text>
        <view class="progress-bar-wrapper">
          <view class="progress-bar" :style="{ width: overallProgress + '%' }" />
        </view>
        <text class="progress-text">
          {{ completedCount }} / {{ totalCount }}
        </text>
      </view>
    </view>

    <!-- 上传队列 -->
    <view v-if="uploadQueue.length > 0" class="upload-queue">
      <view
        v-for="item in uploadQueue"
        :key="item.id"
        class="queue-item"
      >
        <view class="queue-info">
          <text class="queue-name">{{ item.name }}</text>
          <text class="queue-status" :class="item.status">
            {{ statusLabels[item.status] }}
          </text>
        </view>
        <view class="queue-progress-bar" v-if="item.status === 'uploading'">
          <view class="queue-progress-fill" :style="{ width: item.progress + '%' }" />
        </view>
        <text v-if="item.error" class="queue-error">{{ item.error }}</text>
      </view>
    </view>

    <!-- 上传完成后填写歌曲信息 -->
    <view v-if="showMetaForm" class="meta-form">
      <text class="form-title">歌曲信息</text>
      <input
        v-model="songMeta.name"
        class="meta-input"
        placeholder="歌曲名称"
        placeholder-style="color: #6a6a7e"
      />
      <view class="meta-row">
        <input
          v-model="songMeta.bpm"
          class="meta-input half"
          type="number"
          placeholder="BPM（选填）"
          placeholder-style="color: #6a6a7e"
        />
        <view class="picker-wrapper half">
          <picker
            :value="animModeIndex"
            :range="animModeOptions"
            @change="handleAnimModeChange"
          >
            <text class="picker-text">
              动画: {{ animModeOptions[animModeIndex] }}
            </text>
          </picker>
        </view>
      </view>
      <view class="form-actions">
        <text class="btn-cancel" @tap="handleCancelMeta">取消</text>
        <text class="btn-save" @tap="handleSaveMeta">保存</text>
      </view>
    </view>
  </view>
</template>

<script>
import { FileValidator, getUploader } from '@/services'
import { useMusicStore } from '@/stores/music'

export default {
  name: 'UploadBox',

  props: {
    maxSize: { type: Number, default: 50 }, // MB
    autoDetectBpm: { type: Boolean, default: true },
  },

  emits: ['upload-start', 'upload-progress', 'upload-complete', 'upload-error', 'song-added'],

  data() {
    return {
      isDragging: false,
      isUploading: false,
      uploadQueue: [],
      supportedFormats: ['MP3', 'WAV', 'M4A', 'AAC', 'OGG', 'FLAC'],
      showMetaForm: false,
      songMeta: { name: '', bpm: '', animationMode: 'auto' },
      completedFile: null,
      statusLabels: {
        pending: '等待中',
        uploading: '上传中',
        done: '✓ 完成',
        error: '失败',
        cancelled: '已取消',
      },
      animModeIndex: 0,
      animModeOptions: ['auto', 'sing', 'dance', 'happy'],
    }
  },

  computed: {
    musicStore() { return useMusicStore() },
    maxSizeMB() { return this.maxSize },
    overallProgress() {
      if (this.uploadQueue.length === 0) return 0
      const total = this.uploadQueue.reduce((s, i) => s + i.progress, 0)
      return Math.round(total / this.uploadQueue.length)
    },
    totalCount() { return this.uploadQueue.length },
    completedCount() {
      return this.uploadQueue.filter(i => i.status === 'done').length
    },
  },

  methods: {
    // ==================== 文件选择 ====================

    async handleChooseFile() {
      if (this.isUploading) return

      try {
        // 微信小程序选择文件
        const res = await new Promise((resolve, reject) => {
          uni.chooseMessageFile({
            count: 5,
            type: 'file',
            extension: this.supportedFormats.map(f => f.toLowerCase()),
            success: resolve,
            fail: reject,
          })
        })

        const files = res.tempFiles
        if (!files || files.length === 0) return

        // 校验文件
        const validator = new FileValidator({
          maxSize: this.maxSize * 1024 * 1024,
        })
        const { valid, invalid } = validator.validateBatch(files)

        // 提示无效文件
        if (invalid.length > 0) {
          uni.showToast({
            title: invalid[0].error,
            icon: 'none',
            duration: 2500,
          })
        }

        if (valid.length === 0) return

        // 开始上传
        await this._startUpload(valid)

      } catch (e) {
        if (e.errMsg?.includes('cancel')) return // 用户取消
        console.error('[UploadBox] 选择文件失败:', e)
      }
    },

    // ==================== 上传流程 ====================

    async _startUpload(files) {
      this.isUploading = true
      this.$emit('upload-start', files)

      const uploader = getUploader()

      // 初始化队列
      this.uploadQueue = files.map(f => ({
        id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: f.name || '未知文件',
        file: f,
        progress: 0,
        status: 'pending',
        error: null,
      }))

      // 逐个上传（串行，保证顺序）
      for (const item of this.uploadQueue) {
        item.status = 'uploading'

        try {
          const result = await uploader.upload(item.file, {
            name: item.name,
          })

          item.status = result.status === 'done' ? 'done' : 'error'
          item.progress = 100
          item.error = result.error

          if (result.status === 'done') {
            this.completedFile = result.result
            this.musicStore.addSong({
              name: item.name,
              duration: 0,
              bpm: 0,
              animationMode: 'sing',
              fileUrl: result.result.url || result.result.localPath,
              coverUrl: '',
            })

            this.$emit('upload-complete', result)
            this.$emit('song-added', {
              name: item.name,
              fileUrl: result.result.url || result.result.localPath,
            })
          }
        } catch (e) {
          item.status = 'error'
          item.error = e.message
          this.$emit('upload-error', { file: item.name, error: e.message })
        }
      }

      this.isUploading = false

      // 显示歌曲信息填写表单
      if (this.completedFile) {
        this.songMeta.name = this.uploadQueue.find(i => i.status === 'done')?.name || ''
        this.showMetaForm = true
      }

      // 清理
      this.uploadQueue = this.uploadQueue.filter(i => i.status !== 'done')
    },

    handleAnimModeChange(e) {
      this.animModeIndex = e.detail.value
      this.songMeta.animationMode = this.animModeOptions[this.animModeIndex]
    },

    handleSaveMeta() {
      // 更新最后添加的歌曲信息
      const playlist = this.musicStore.playlist
      if (playlist.length > 0) {
        const lastSong = playlist[playlist.length - 1]
        lastSong.name = this.songMeta.name || lastSong.name
        lastSong.bpm = parseInt(this.songMeta.bpm) || 0
        lastSong.animationMode = this.songMeta.animationMode
      }
      this.showMetaForm = false
      uni.showToast({ title: '歌曲已保存 ✨', icon: 'success' })
    },

    handleCancelMeta() {
      this.showMetaForm = false
    },
  },
}
</script>

<style lang="scss" scoped>
.upload-box {
  width: 100%;
}

/* 上传区域 */
.drop-zone {
  padding: $space-xl * 1.5;
  border: 2px dashed rgba($color-accent, 0.3);
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.02);
  transition: all $transition-normal;

  &.active {
    border-color: $color-accent;
    background: rgba($color-accent, 0.05);
  }

  &.uploading {
    border-style: solid;
    border-color: rgba($color-accent, 0.5);
  }

  &:active { opacity: 0.9; }
}

.drop-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-sm;
}
.drop-icon { font-size: 64rpx; }
.drop-title { font-size: $font-size-md; color: $color-text-primary; }
.drop-hint { font-size: $font-size-sm; color: $color-text-secondary; }
.drop-limit { font-size: $font-size-xs; color: $color-text-muted; }

/* 上传中 */
.uploading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-sm;
}
.uploading-icon { font-size: 48rpx; }
.uploading-title { font-size: $font-size-sm; color: $color-accent; }

.progress-bar-wrapper {
  width: 80%;
  height: 8rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4rpx;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, $color-accent-dark, $color-accent);
  border-radius: 4rpx;
  transition: width 0.3s ease;
}
.progress-text {
  font-size: $font-size-xs;
  color: $color-text-muted;
}

/* 上传队列 */
.upload-queue {
  margin-top: $space-md;
  display: flex;
  flex-direction: column;
  gap: $space-sm;
}
.queue-item {
  padding: $space-sm $space-md;
  background: $color-bg-card;
  border-radius: 8rpx;
}
.queue-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.queue-name {
  font-size: $font-size-sm;
  color: $color-text-primary;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.queue-status {
  font-size: $font-size-xs;
  &.done { color: $color-success; }
  &.uploading { color: $color-accent; }
  &.error { color: $color-error; }
  &.pending { color: $color-text-muted; }
}
.queue-progress-bar {
  margin-top: $space-xs;
  height: 4rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2rpx;
  overflow: hidden;
}
.queue-progress-fill {
  height: 100%;
  background: $color-accent;
  transition: width 0.2s ease;
}
.queue-error {
  font-size: $font-size-xs;
  color: $color-error;
  margin-top: 4rpx;
}

/* 歌曲信息表单 */
.meta-form {
  margin-top: $space-lg;
  padding: $space-lg;
  background: $color-bg-card;
  border-radius: 12rpx;
  border: 1px solid rgba($color-accent, 0.15);
}
.form-title {
  font-size: $font-size-md;
  color: $color-accent;
  margin-bottom: $space-md;
  display: block;
}
.meta-input {
  width: 100%;
  padding: $space-sm $space-md;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
  color: $color-text-primary;
  font-size: $font-size-sm;
  margin-bottom: $space-sm;
  box-sizing: border-box;

  &.half {
    width: calc(50% - 8rpx);
  }
}
.meta-row {
  display: flex;
  gap: $space-sm;
}
.picker-wrapper {
  padding: $space-sm $space-md;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
  display: flex;
  align-items: center;
}
.picker-text {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: $space-md;
  margin-top: $space-md;
}
.btn-cancel {
  padding: $space-sm $space-lg;
  color: $color-text-secondary;
  font-size: $font-size-sm;
}
.btn-save {
  padding: $space-sm $space-xl;
  background: $color-accent;
  color: $color-bg-primary;
  border-radius: 8rpx;
  font-size: $font-size-sm;
  font-weight: 600;
}
</style>
