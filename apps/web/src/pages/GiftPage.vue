<script setup lang="ts">
/**
 * Gift Page — 礼物分享入口
 * 朋友扫描二维码或点击链接时首先看到此页
 */
import { ref, onMounted } from 'vue'

const showContent = ref(false)
const showButton = ref(false)

onMounted(() => {
  setTimeout(() => { showContent.value = true }, 800)
  setTimeout(() => { showButton.value = true }, 3500)
})
</script>

<template>
  <div class="gift-page">
    <!-- 星空 -->
    <div class="stars">
      <div v-for="i in 30" :key="i" class="star" :style="{
        left: (Math.random() * 100) + '%', top: (Math.random() * 100) + '%',
        animationDelay: Math.random() * 3 + 's',
      }" />
    </div>

    <div class="gift-content" :class="{ visible: showContent }">
      <!-- 礼物图标 -->
      <div class="gift-icon">🎁</div>

      <!-- 标题 -->
      <h1 class="title">LUNA</h1>
      <p class="subtitle">星光歌姬</p>

      <!-- 信息 -->
      <div class="message">
        <p>有人为你准备了一份特别的礼物。</p>
        <p class="highlight">一个会唱歌、会陪伴、会记住你们故事的</p>
        <p class="highlight">数字音乐小世界。</p>
      </div>

      <!-- 进入按钮 -->
      <button v-if="showButton" class="enter-btn" @click="$router.push('/')">
        ✨ 打开礼物
      </button>

      <!-- 底部文字 -->
      <p class="footer-text">Made with 🤍</p>
    </div>
  </div>
</template>

<style scoped>
.gift-page {
  position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
  background: radial-gradient(ellipse at center, #1a1a3e 0%, #0a0a1a 50%, #000 100%);
  overflow: hidden;
}
.stars { position: absolute; inset: 0; }
.star { position: absolute; width: 2px; height: 2px; background: #ffd700; border-radius: 50%; animation: twinkle 2.5s ease-in-out infinite; }
@keyframes twinkle { 0%,100%{opacity:0.15} 50%{opacity:0.8} }

.gift-content {
  text-align: center; z-index: 10; opacity: 0; transform: translateY(20px);
  transition: all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.gift-content.visible { opacity: 1; transform: translateY(0); }

.gift-icon { font-size: 64px; margin-bottom: 16px; animation: float 3s ease-in-out infinite; }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

.title {
  font-family: 'Courier New', monospace; font-size: 48px; color: #e8b86d;
  letter-spacing: 12px; margin: 0; text-shadow: 0 0 40px rgba(232,184,109,0.3);
}
.subtitle { font-size: 16px; color: #c9a04e; margin: 8px 0 32px; letter-spacing: 8px; }

.message { margin-bottom: 32px; }
.message p { font-size: 15px; color: #a0a0b8; margin: 4px 0; line-height: 1.8; }
.message .highlight { color: #f0e6d3; }

.enter-btn {
  padding: 16px 48px; font-size: 18px;
  background: linear-gradient(135deg, rgba(232,184,109,0.25), rgba(201,160,78,0.1));
  border: 2px solid rgba(232,184,109,0.4); border-radius: 30px;
  color: #e8b86d; cursor: pointer;
  animation: fadeIn 0.8s ease;
  transition: all 0.2s;
}
.enter-btn:hover { background: rgba(232,184,109,0.3); transform: scale(1.03); box-shadow: 0 0 30px rgba(232,184,109,0.15); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } }

.footer-text { margin-top: 48px; font-size: 12px; color: #6a6a7e; }
</style>
