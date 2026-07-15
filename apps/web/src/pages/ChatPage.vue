<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { getDialogueEngine, getMemorySystem, getLunaMood } from '@luna/ai-engine'
import { useCharacterStore } from '@/stores/character'

const charStore = useCharacterStore()
const dialogue = getDialogueEngine()
const memory = getMemorySystem()

interface Message { role: 'luna' | 'user'; text: string; time: number }
const messages = ref<Message[]>([])
const input = ref('')
const chatEl = ref<HTMLDivElement>()

const mood = getLunaMood({ interactionDays: charStore.stats.interactionDays, level: charStore.level })

// Initial LUNA greeting
onMounted(() => {
  const greeting = dialogue.speak('greeting')
  messages.value.push({ role: 'luna', text: greeting, time: Date.now() })
})

function send() {
  const text = input.value.trim()
  if (!text) return
  messages.value.push({ role: 'user', text, time: Date.now() })
  input.value = ''

  // LUNA responds based on context
  setTimeout(() => {
    const scene = detectScene(text)
    const reply = dialogue.speak(scene)
    messages.value.push({ role: 'luna', text: reply, time: Date.now() })

    // Save interaction to memory
    memory.add('interaction', { userSaid: text, lunaSaid: reply })
    charStore.recordInteraction()

    nextTick(() => scrollBottom())
  }, 600 + Math.random() * 800)
}

function detectScene(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('累') || t.includes('困') || t.includes('辛苦')) return 'night'
  if (t.includes('生日') || t.includes('快乐')) return 'birthday'
  if (t.includes('歌') || t.includes('唱') || t.includes('听')) return 'music_play'
  if (t.includes('回忆') || t.includes('记得') || t.includes('以前')) return 'memory'
  if (t.includes('谢谢') || t.includes('爱你') || t.includes('喜欢')) return 'level_3'
  return 'greeting'
}

function scrollBottom() {
  chatEl.value?.scrollTo({ top: chatEl.value.scrollHeight, behavior: 'smooth' })
}

const quickReplies = ['今天想听歌 🎵', '换一件衣服吧', '最近过得怎么样？', '讲一个故事']
</script>

<template>
  <div class="chat-page">
    <!-- 顶部信息 -->
    <div class="chat-header">
      <div class="chat-luna-info">
        <span class="luna-avatar">🌙</span>
        <div>
          <div class="luna-name">LUNA</div>
          <div class="luna-mood">{{ mood.label }}</div>
        </div>
      </div>
      <span class="level-badge">Lv{{ charStore.level }}</span>
    </div>

    <!-- 消息列表 -->
    <div ref="chatEl" class="chat-messages">
      <div v-for="(msg, i) in messages" :key="i" class="msg-row" :class="msg.role">
        <div class="msg-bubble">{{ msg.text }}</div>
        <div class="msg-time">{{ new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</div>
      </div>
    </div>

    <!-- 快捷回复 -->
    <div class="quick-replies" v-if="messages.length <= 3">
      <button v-for="qr in quickReplies" :key="qr" class="quick-btn" @click="input = qr; send()">
        {{ qr }}
      </button>
    </div>

    <!-- 输入区 -->
    <div class="chat-input-area">
      <input
        v-model="input" class="chat-input"
        placeholder="和 LUNA 说点什么..."
        @keyup.enter="send"
      />
      <button class="send-btn" @click="send" :disabled="!input.trim()">发送</button>
    </div>
  </div>
</template>

<style scoped>
.chat-page { flex: 1; display: flex; flex-direction: column; background: #0f0f23; }

.chat-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; background: rgba(26,26,46,0.95); border-bottom: 1px solid rgba(255,255,255,0.06);
}
.chat-luna-info { display: flex; align-items: center; gap: 10px; }
.luna-avatar { font-size: 28px; }
.luna-name { font-size: 16px; color: #e8b86d; font-weight: 600; }
.luna-mood { font-size: 11px; color: #6a6a7e; }
.level-badge { padding: 2px 10px; background: rgba(232,184,109,0.15); color: #e8b86d; border-radius: 10px; font-size: 11px; }

.chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.msg-row { max-width: 80%; display: flex; flex-direction: column; }
.msg-row.luna { align-self: flex-start; }
.msg-row.user { align-self: flex-end; }
.msg-bubble {
  padding: 10px 16px; border-radius: 16px; font-size: 14px; line-height: 1.5; word-break: break-word;
}
.msg-row.luna .msg-bubble { background: rgba(26,33,62,0.95); color: #f0e6d3; border-bottom-left-radius: 4px; }
.msg-row.user .msg-bubble { background: rgba(232,184,109,0.15); color: #f0e6d3; border-bottom-right-radius: 4px; }
.msg-time { font-size: 10px; color: #6a6a7e; margin-top: 4px; padding: 0 4px; }
.msg-row.user .msg-time { text-align: right; }

.quick-replies { display: flex; flex-wrap: wrap; gap: 8px; padding: 8px 16px; }
.quick-btn {
  padding: 6px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px; color: #a0a0b8; font-size: 12px; cursor: pointer; transition: all 0.15s;
}
.quick-btn:hover { background: rgba(232,184,109,0.1); border-color: rgba(232,184,109,0.2); color: #e8b86d; }

.chat-input-area { display: flex; gap: 8px; padding: 12px 16px; background: rgba(26,26,46,0.95); border-top: 1px solid rgba(255,255,255,0.06); }
.chat-input { flex: 1; padding: 10px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; color: #f0e6d3; font-size: 14px; outline: none; }
.chat-input::placeholder { color: #6a6a7e; }
.chat-input:focus { border-color: rgba(232,184,109,0.3); }
.send-btn { padding: 10px 20px; background: #e8b86d; border: none; border-radius: 20px; color: #0f0f23; font-size: 14px; font-weight: 600; cursor: pointer; }
.send-btn:disabled { opacity: 0.3; cursor: not-allowed; }
</style>
