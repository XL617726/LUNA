<script setup lang="ts">
defineProps<{
  isPlaying: boolean; songName?: string; progress?: number
}>()
defineEmits<{ play: []; pause: []; next: []; prev: [] }>()
</script>

<template>
  <div class="music-ctrl">
    <div class="music-ctrl__info">
      <span class="music-ctrl__song">{{ songName || '未选择歌曲' }}</span>
      <div class="music-ctrl__progress">
        <div class="music-ctrl__track" :style="{ width: ((progress || 0) * 100) + '%' }" />
      </div>
    </div>
    <div class="music-ctrl__buttons">
      <button class="music-ctrl__btn" @click="$emit('prev')" aria-label="上一首">⏮</button>
      <button class="music-ctrl__btn music-ctrl__btn--play" @click="isPlaying ? $emit('pause') : $emit('play')" :aria-label="isPlaying ? '暂停' : '播放'">
        {{ isPlaying ? '⏸' : '▶️' }}
      </button>
      <button class="music-ctrl__btn" @click="$emit('next')" aria-label="下一首">⏭</button>
    </div>
  </div>
</template>

<style scoped>
.music-ctrl {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; background: var(--luna-bg-card); border-radius: var(--luna-radius-lg);
  border: 1px solid var(--luna-border-color);
}
.music-ctrl__info { flex: 1; min-width: 0; }
.music-ctrl__song { font-size: var(--luna-font-size-sm); color: var(--luna-text-primary); display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.music-ctrl__progress { height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; margin-top: 6px; overflow: hidden; }
.music-ctrl__track { height: 100%; background: var(--luna-accent); border-radius: 2px; transition: width 0.3s ease; }
.music-ctrl__buttons { display: flex; align-items: center; gap: 12px; margin-left: 16px; }
.music-ctrl__btn { background: none; border: none; color: var(--luna-text-secondary); font-size: 22px; cursor: pointer; padding: 4px; transition: all var(--luna-transition-fast); }
.music-ctrl__btn:hover { color: var(--luna-accent); transform: scale(1.1); }
.music-ctrl__btn--play { font-size: 32px; color: var(--luna-accent); }
</style>
