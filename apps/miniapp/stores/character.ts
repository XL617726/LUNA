/**
 * Character Store — 角色状态 (Pinia)
 *
 * 引擎层: @/services/character (CharacterEngine) — 纯逻辑
 * 存储层: 本文件 — Vue 响应式 + 持久化
 */
import { defineStore } from 'pinia'
import { getCharacterEngine } from '@/services/character'
import type { CharacterForm, CharacterState } from '@/services/character'

const engine = getCharacterEngine()

export const useCharacterStore = defineStore('character', {
  state: () => ({
    id: 'LUNA-001',
    name: 'LUNA',
    currentForm: engine.currentForm as CharacterForm,
    animationState: engine.currentState as CharacterState,
    level: engine.level,
    levelTitle: engine.levelTitle,
    stats: { ...engine.stats },
    unlocked: { ...engine.unlocked },
  }),

  getters: {
    formInfo(state) {
      const info = engine.getFormInfo()
      return info
    },
    allForms: () => engine.getAllForms(),
  },

  actions: {
    switchForm(form: CharacterForm) {
      if (engine.switchForm(form)) {
        this.currentForm = form
        uni.setStorageSync('luna_character_form', form)
        this._sync()
      }
    },

    setAnimationState(state: CharacterState) {
      if (engine.setState(state)) {
        this.animationState = state
      }
    },

    recordInteraction() {
      engine.recordInteraction()
      const levelUp = engine.checkLevelUp()
      this._sync()
      return levelUp
    },

    recordPlay() { engine.recordPlay(); this._sync() },
    recordSong() { engine.recordSong(); this._sync() },

    _sync() {
      this.level = engine.level
      this.levelTitle = engine.levelTitle
      this.stats = { ...engine.stats }
      this.unlocked = { ...engine.unlocked }
    },
  },
})
