<script setup lang="ts">
/**
 * Chapter 0 — 《第一次相遇》
 * 场景序列：黑屏 → 星光 → LUNA背影 → 转身 → 对话 → 上传第一首歌
 */
import { ref, onMounted } from 'vue'

const emit = defineEmits<{ complete: [] }>()

const phase = ref(0)             // 0-5
const text = ref('')
const showButton = ref(false)
const uploading = ref(false)

const script = [
  { text: '', delay: 1500 },                                    // 0: 黑屏
  { text: '有些声音，会被时间保存。', delay: 3000 },              // 1
  { text: '', delay: 1500 },                                    // 2: 星光
  { text: '你好。', delay: 2000 },                               // 3: 转身
  { text: '我是 LUNA。', delay: 2000 },                          // 4
  { text: '听说，你有喜欢的歌？', delay: 2500 },                  // 5
]

onMounted(() => playScene())

async function playScene() {
  for (let i = 0; i < script.length; i++) {
    phase.value = i
    if (script[i].text) {
      // Typewriter effect for text
      const chars = script[i].text.split('')
      text.value = ''
      for (const c of chars) {
        text.value += c
        await sleep(50 + Math.random() * 30)
      }
    }
    await sleep(script[i].delay)
  }
  showButton.value = true
}

function handleUpload() {
  uploading.value = true
  const input = document.createElement('input')
  input.type = 'file'; input.accept = '.mp3,.wav,.m4a'
  input.onchange = () => {
    uploading.value = false
    emit('complete')
  }
  input.click()
}

function handleSkip() { emit('complete') }

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }
</script>

<template>
  <div class="first-meet" :class="`phase-${phase}`">
    <!-- 星光粒子 -->
    <div v-if="phase >= 2" class="stars">
      <div v-for="i in 20" :key="i" class="star-dot" :style="{
        left: (10 + Math.random() * 80) + '%', top: (10 + Math.random() * 80) + '%',
        animationDelay: Math.random() * 2 + 's',
        animationDuration: (1.5 + Math.random() * 3) + 's',
      }" />
    </div>

    <!-- LUNA 剪影 -->
    <div v-if="phase >= 2" class="luna-silhouette" :class="{ turned: phase >= 3 }">
      <div class="silhouette-body">
        <div class="head" />
        <div class="body" />
        <div class="mic" v-if="phase >= 4">🎤</div>
      </div>
    </div>

    <!-- 对白文字 -->
    <div v-if="text" class="dialogue">
      <p>{{ text }}</p>
    </div>

    <!-- 上传按钮 -->
    <button v-if="showButton" class="upload-btn" @click="handleUpload" :disabled="uploading">
      {{ uploading ? '⏳' : '📤 上传第一首歌' }}
    </button>

    <!-- 跳过 -->
    <button v-if="phase >= 1" class="skip-btn" @click="handleSkip">跳过 ›</button>
  </div>
</template>

<style scoped>
.first-meet {
  position: fixed; inset: 0; z-index: 100; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  transition: background 1s ease;
}
.phase-0, .phase-1 { background: #000; }
.phase-2, .phase-3, .phase-4, .phase-5 { background: radial-gradient(ellipse at center, #1a1a3e 0%, #0a0a1a 70%, #000 100%); }

/* 星光 */
.stars { position: absolute; inset: 0; overflow: hidden; }
.star-dot { position: absolute; width: 2px; height: 2px; background: #ffd700; border-radius: 50%; animation: twinkle 2s ease-in-out infinite; }
@keyframes twinkle { 0%,100%{opacity:0.2} 50%{opacity:1} }

/* LUNA 剪影 */
.luna-silhouette { margin-bottom: 40px; transition: transform 1s ease; }
.luna-silhouette.turned { transform: rotateY(0deg); }
.luna-silhouette:not(.turned) { transform: rotateY(180deg); }
.silhouette-body { display: flex; flex-direction: column; align-items: center; }
.head {
  width: 64px; height: 64px; border-radius: 50%;
  background: linear-gradient(180deg, #1a1a3e, #0a0a1a);
  box-shadow: 0 0 40px rgba(232,184,109,0.15);
}
.body {
  width: 48px; height: 80px; margin-top: -4px;
  background: linear-gradient(180deg, #1a1a3e, #0a0a1a);
  border-radius: 8px 8px 0 0;
}
.mic { position: absolute; margin-top: 50px; font-size: 24px; animation: float 2s ease-in-out infinite; }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

/* 对白 */
.dialogue {
  padding: 16px 32px; max-width: 320px; text-align: center;
  z-index: 10;
}
.dialogue p {
  color: #f0e6d3; font-size: 18px; line-height: 1.8;
  text-shadow: 0 0 20px rgba(232,184,109,0.3);
  animation: fadeIn 0.5s ease;
}
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } }

/* 按钮 */
.upload-btn {
  margin-top: 24px; padding: 14px 36px;
  background: linear-gradient(135deg, rgba(232,184,109,0.2), rgba(201,160,78,0.1));
  border: 1px solid rgba(232,184,109,0.4); border-radius: 24px;
  color: #e8b86d; font-size: 16px; cursor: pointer; z-index: 10;
  animation: fadeIn 0.5s ease;
}
.upload-btn:hover { background: rgba(232,184,109,0.2); }
.skip-btn {
  position: absolute; bottom: 40px; right: 24px; z-index: 10;
  background: none; border: none; color: #6a6a7e; font-size: 14px; cursor: pointer;
}
.skip-btn:hover { color: #a0a0b8; }
</style>
