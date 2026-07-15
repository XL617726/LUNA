<!-- LUNA Miniapp — AI 聊天页 -->
<template>
  <view class="page">
    <view class="header">
      <text class="title">💬 LUNA</text>
    </view>
    <view class="messages">
      <view class="msg luna" v-for="(m, i) in messages" :key="i">
        <text>{{ m.role === 'luna' ? '🌙 ' : '' }}{{ m.text }}</text>
      </view>
    </view>
    <view class="input-area">
      <input v-model="input" class="msg-input" placeholder="和 LUNA 说点什么..." @confirm="send" />
      <button class="send-btn" @tap="send">发送</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { getDialogueEngine } from '@/services/ai-dialogue'

const dialogue = getDialogueEngine()
const messages = ref([{ role: 'luna', text: dialogue.speak('greeting') }])
const input = ref('')

function send() {
  const text = input.value.trim()
  if (!text) return
  messages.value.push({ role: 'user', text })
  input.value = ''
  setTimeout(() => {
    messages.value.push({ role: 'luna', text: dialogue.speak('greeting') })
  }, 600)
}
</script>

<style scoped>
.page { min-height: 100vh; background: #0f0f23; display: flex; flex-direction: column; }
.header { padding: 16px; }
.title { color: #e8b86d; font-size: 20px; }
.messages { flex: 1; padding: 16px; }
.msg { padding: 10px 14px; margin: 6px 0; border-radius: 12px; font-size: 14px; max-width: 80%; }
.msg.luna { background: #16213e; color: #f0e6d3; align-self: flex-start; }
.msg text[style*="user"] { background: rgba(232,184,109,0.15); color: #f0e6d3; align-self: flex-end; }
.input-area { display: flex; padding: 12px; gap: 8px; background: #1a1a2e; }
.msg-input { flex: 1; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; color: #f0e6d3; font-size: 14px; }
.send-btn { padding: 10px 20px; background: #e8b86d; border: none; border-radius: 20px; color: #0f0f23; font-size: 14px; }
</style>
