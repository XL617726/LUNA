<script setup lang="ts">
import { useCharacterStore } from '@/stores/character'
import { getDialogueEngine } from '@luna/ai-engine'

const store = useCharacterStore()
const dialogue = getDialogueEngine()

function handleSwitch(form: 'graduation' | 'live' | 'CEO') {
  if (form === store.currentForm) return
  store.switchForm(form)
  alert(dialogue.speak(`switch_${form}`))
}
</script>

<template>
  <div class="page">
    <h2>👗 角色衣柜</h2>
    <p class="sub">选择 LUNA 的形态</p>

    <div class="preview">
      <div class="preview-icon">{{ { graduation: '🎓', live: '🎤', CEO: '💼' }[store.currentForm] }}</div>
      <div class="preview-name">{{ store.formInfo.name }}</div>
      <div class="preview-theme">《{{ store.formInfo.theme }}》</div>
    </div>

    <div class="cards">
      <div
        v-for="f in store.allForms" :key="f.id"
        class="card" :class="{ active: store.currentForm === f.id }"
        @click="handleSwitch(f.id)"
      >
        <div class="card-header">
          <span class="card-icon">{{ { graduation: '🎓', live: '🎤', CEO: '💼' }[f.id] }}</span>
          <span class="card-name">{{ f.name }}</span>
          <span v-if="store.currentForm === f.id" class="badge">✦ 当前</span>
        </div>
        <div class="card-elements">
          <span v-for="e in f.elements" :key="e" class="tag">{{ e }}</span>
        </div>
      </div>
    </div>

    <div class="unlocked">
      <span class="label">已解锁动作:</span>
      <span v-for="a in store.unlocked.actions" :key="a" class="tag green">{{ a }}</span>
    </div>
  </div>
</template>

<style scoped>
.page { flex: 1; padding: 24px; overflow-y: auto; }
h2 { color: #e8b86d; } .sub { color: #6a6a7e; font-size: 13px; }
.preview { text-align: center; padding: 32px; background: #16213e; border-radius: 12px; margin: 16px 0; }
.preview-icon { font-size: 64px; } .preview-name { font-size: 20px; color: #e8b86d; } .preview-theme { font-size: 13px; color: #6a6a7e; }
.cards { display: flex; flex-direction: column; gap: 12px; }
.card { padding: 16px; background: #16213e; border: 2px solid transparent; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
.card.active { border-color: #e8b86d; }
.card:hover { background: #1a2a4e; }
.card-header { display: flex; align-items: center; gap: 12px; }
.card-icon { font-size: 28px; } .card-name { font-size: 16px; }
.badge { padding: 2px 10px; background: #e8b86d; color: #0f0f23; border-radius: 10px; font-size: 11px; margin-left: auto; }
.card-elements { display: flex; gap: 8px; margin-top: 10px; }
.tag { padding: 2px 10px; background: rgba(255,255,255,0.06); border-radius: 4px; font-size: 11px; color: #a0a0b8; }
.tag.green { background: rgba(126,203,118,0.1); border: 1px solid rgba(126,203,118,0.3); }
.unlocked { margin-top: 20px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.label { font-size: 12px; color: #6a6a7e; }
</style>
