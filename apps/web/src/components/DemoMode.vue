<script setup lang="ts">
/**
 * DemoMode — 自动演示 LUNA 的完整功能
 * 页面自动切换，展示所有核心体验
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const step = ref(0)
const stepText = ref('')
let timers: number[] = []

const demoSteps = [
  { route: '/gift', text: '🎁 礼物封面 — 有人为你准备了一份特别的礼物', delay: 3000 },
  { route: '/', text: '🏠 音乐房间 — LUNA 在这里等你', delay: 2500 },
  { route: '/character', text: '👗 角色衣柜 — 三种形态：毕业生 / 女主播 / CEO', delay: 2500 },
  { route: '/music', text: '🎼 音乐中心 — 上传你喜欢的歌，LUNA 会跟着唱', delay: 2500 },
  { route: '/memory', text: '💫 回忆空间 — 每个特别的日子都在这里', delay: 2000 },
  { route: '/chat', text: '💬 AI 对话 — 和 LUNA 聊天，她会记得你', delay: 2000 },
  { route: '/perform', text: '🎤 表演模式 — 上传歌曲 → 分析 → 演唱 → 保存回忆', delay: 3000 },
  { route: '/gift', text: '✨ LUNA — 一个会唱歌、会陪伴、保存朋友故事的小世界', delay: 4000 },
]

onMounted(() => {
  let totalDelay = 0
  for (let i = 0; i < demoSteps.length; i++) {
    const s = demoSteps[i]
    const t = window.setTimeout(() => {
      step.value = i
      stepText.value = s.text
      router.push(s.route)
    }, totalDelay)
    timers.push(t)
    totalDelay += s.delay
  }

  // Loop after completion
  const loop = window.setTimeout(() => {
    step.value = 0
  }, totalDelay + 1000)
  timers.push(loop)
})

onUnmounted(() => timers.forEach(clearTimeout))
</script>

<template>
  <div class="demo-overlay">
    <div class="demo-badge">📺 Demo 模式</div>
    <Transition name="fade">
      <div v-if="stepText" :key="step" class="demo-step">
        {{ stepText }}
      </div>
    </Transition>
    <div class="demo-dots">
      <span v-for="(s, i) in demoSteps" :key="i" class="dot" :class="{ active: i === step, done: i < step }" />
    </div>
  </div>
</template>

<style scoped>
.demo-overlay {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 80;
  padding: 16px; background: linear-gradient(0deg, rgba(0,0,0,0.8), transparent);
  pointer-events: none;
}
.demo-badge {
  position: fixed; top: 12px; right: 16px; z-index: 80;
  padding: 4px 12px; background: rgba(232,184,109,0.15); border: 1px solid rgba(232,184,109,0.3);
  border-radius: 12px; font-size: 11px; color: #e8b86d;
}
.demo-step {
  text-align: center; padding: 8px; font-size: 14px; color: #f0e6d3;
  animation: slideIn 0.4s ease;
}
@keyframes slideIn { from { opacity: 0; transform: translateY(8px); } }
.demo-dots { display: flex; justify-content: center; gap: 6px; margin-top: 8px; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.15); transition: all 0.3s; }
.dot.active { background: #e8b86d; transform: scale(1.5); }
.dot.done { background: rgba(232,184,109,0.4); }
.fade-enter-active { transition: opacity 0.4s; }
.fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
