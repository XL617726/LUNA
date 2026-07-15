<script setup lang="ts">
/**
 * ErrorBoundary — 全局错误捕获
 * 在任何页面崩溃时显示友好的错误页面而不是白屏
 */
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMsg = ref('')

onErrorCaptured((err: any) => {
  hasError.value = true
  errorMsg.value = err?.message || '未知错误'
  console.error('[LUNA Error]', err)
  return false // 阻止向上传播
})

function retry() {
  hasError.value = false
  errorMsg.value = ''
  window.location.reload()
}
</script>

<template>
  <div v-if="hasError" class="error-page">
    <div class="error-card">
      <div class="error-icon">🌙</div>
      <h2>哎呀，LUNA 遇到了一点问题</h2>
      <p class="error-msg">{{ errorMsg }}</p>
      <button class="retry-btn" @click="retry">重新加载</button>
      <p class="error-hint">如果问题持续，请刷新页面</p>
    </div>
  </div>
  <slot v-else />
</template>

<style scoped>
.error-page {
  position: fixed; inset: 0; z-index: 300;
  display: flex; align-items: center; justify-content: center;
  background: radial-gradient(ellipse at center, #1a1a3e, #0a0a1a, #000);
}
.error-card { text-align: center; padding: 40px; max-width: 320px; }
.error-icon { font-size: 56px; margin-bottom: 16px; animation: pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
h2 { color: #e8b86d; font-size: 18px; margin-bottom: 8px; }
.error-msg { color: #6a6a7e; font-size: 13px; margin-bottom: 24px; word-break: break-all; }
.retry-btn { padding: 10px 32px; background: #e8b86d; border: none; border-radius: 20px; color: #0f0f23; font-size: 14px; font-weight: 600; cursor: pointer; }
.retry-btn:hover { background: #f5d89a; }
.error-hint { margin-top: 16px; font-size: 11px; color: #6a6a7e; }
</style>
