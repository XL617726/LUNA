<script setup lang="ts">
/**
 * GuidedTour — 首次访问引导
 * 在初见剧情完成后，引导用户了解 LUNA 的世界
 */
import { ref, onMounted } from 'vue'

const emit = defineEmits<{ done: [] }>()

const steps = [
  { title: '🎤 点击唱歌', desc: '点击麦克风按钮，进入表演模式。上传你喜欢的歌，LUNA 会跟着唱！', pos: 'bottom' },
  { title: '👗 切换形态', desc: 'LUNA 有三种形态：毕业生、女主播、CEO。每种都有不同的服装和场景。', pos: 'bottom' },
  { title: '💬 和 LUNA 聊天', desc: '在聊天页面，你可以和 LUNA 说话。她会记得你说过的话。', pos: 'bottom' },
  { title: '⭐ 隐藏彩蛋', desc: '点击右上角的星星...有制作人留给你的话。深夜打开也有惊喜哦。', pos: 'bottom' },
]
const currentStep = ref(0)
const show = ref(true)

function next() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  } else {
    show.value = false
    localStorage.setItem('luna_tour_done', '1')
    setTimeout(() => emit('done'), 300)
  }
}

function skip() {
  show.value = false
  localStorage.setItem('luna_tour_done', '1')
  emit('done')
}
</script>

<template>
  <Transition name="tour">
    <div v-if="show" class="tour-overlay">
      <div class="tour-card">
        <div class="step-indicator">
          <span v-for="(s, i) in steps" :key="i" class="dot" :class="{ active: i === currentStep, done: i < currentStep }" />
        </div>
        <h3>{{ steps[currentStep].title }}</h3>
        <p>{{ steps[currentStep].desc }}</p>
        <div class="tour-actions">
          <button class="skip" @click="skip">跳过</button>
          <button class="next" @click="next">
            {{ currentStep < steps.length - 1 ? '下一步 →' : '开始探索 ✨' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.tour-overlay {
  position: fixed; inset: 0; z-index: 90;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
}
.tour-card {
  background: #1a1a2e; border: 1px solid rgba(232,184,109,0.2); border-radius: 20px;
  padding: 32px; max-width: 340px; text-align: center;
  box-shadow: 0 8px 40px rgba(0,0,0,0.5);
  animation: slideUp 0.3s ease;
}
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } }

.step-indicator { display: flex; justify-content: center; gap: 6px; margin-bottom: 20px; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.1); transition: all 0.2s; }
.dot.active { background: #e8b86d; width: 20px; border-radius: 4px; }
.dot.done { background: rgba(232,184,109,0.4); }

h3 { font-size: 18px; color: #e8b86d; margin-bottom: 8px; }
p { font-size: 14px; color: #a0a0b8; line-height: 1.7; margin-bottom: 24px; }

.tour-actions { display: flex; gap: 12px; justify-content: center; }
.skip { padding: 8px 20px; background: none; border: none; color: #6a6a7e; cursor: pointer; font-size: 13px; }
.skip:hover { color: #a0a0b8; }
.next { padding: 10px 24px; background: #e8b86d; border: none; border-radius: 20px; color: #0f0f23; font-weight: 600; cursor: pointer; font-size: 14px; }
.next:hover { background: #f5d89a; }

.tour-enter-active { transition: opacity 0.3s ease; }
.tour-leave-active { transition: opacity 0.2s ease; }
.tour-enter-from, .tour-leave-to { opacity: 0; }
</style>
