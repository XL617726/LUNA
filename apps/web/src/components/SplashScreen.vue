<script setup lang="ts">
/**
 * SplashScreen — LUNA 启动加载画面
 * 应用初始化时显示，加载完成后自动消失
 */
import { ref, onMounted } from 'vue'

const emit = defineEmits<{ done: [] }>()
const visible = ref(true)
const progress = ref(0)
const subtitle = ref('')

const messages = [
  '正在唤醒 LUNA...',
  '星光粒子就绪...',
  '音乐引擎启动中...',
  '回忆正在加载...',
  '准备好了 ✨',
]

onMounted(async () => {
  for (let i = 0; i < messages.length; i++) {
    subtitle.value = messages[i]
    progress.value = ((i + 1) / messages.length) * 100
    await sleep(i === messages.length - 1 ? 600 : 400 + Math.random() * 300)
  }
  await sleep(400)
  visible.value = false
  setTimeout(() => emit('done'), 400)
})

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }
</script>

<template>
  <Transition name="splash">
    <div v-if="visible" class="splash">
      <div class="splash-content">
        <!-- 月亮图标 -->
        <div class="moon">🌙</div>
        <h1 class="title">LUNA</h1>
        <!-- 进度条 -->
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progress + '%' }" />
        </div>
        <p class="subtitle">{{ subtitle }}</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.splash {
  position: fixed; inset: 0; z-index: 200;
  display: flex; align-items: center; justify-content: center;
  background: radial-gradient(ellipse at center, #1a1a3e 0%, #0a0a1a 60%, #000 100%);
}
.splash-leave-active { transition: opacity 0.5s ease; }
.splash-leave-to { opacity: 0; }

.splash-content { text-align: center; }
.moon { font-size: 56px; animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.1);opacity:1} }

.title {
  font-family: 'Courier New', monospace; font-size: 36px; color: #e8b86d;
  letter-spacing: 10px; margin: 12px 0 24px;
  text-shadow: 0 0 30px rgba(232,184,109,0.3);
}

.progress-track {
  width: 180px; height: 3px; margin: 0 auto;
  background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden;
}
.progress-fill {
  height: 100%; background: linear-gradient(90deg, #c9a04e, #e8b86d);
  border-radius: 2px; transition: width 0.5s ease;
}

.subtitle { margin-top: 12px; font-size: 13px; color: #6a6a7e; }
</style>
