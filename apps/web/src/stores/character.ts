/**
 * Character Store — 直接引用 @luna/character-engine
 * 证明引擎包在 Web 环境可独立工作（无 uni-app 依赖）
 */
import { defineStore } from 'pinia'
import { getCharacterEngine } from '@luna/character-engine'
import type { CharacterForm, CharacterState } from '@luna/shared-types'

const engine = getCharacterEngine()

export const useCharacterStore = defineStore('character', {
  state: () => ({
    currentForm: engine.currentForm as CharacterForm,
    animationState: engine.currentState as CharacterState,
    level: engine.level,
    levelTitle: engine.levelTitle,
    stats: { ...engine.stats },
    unlocked: { ...engine.unlocked },
  }),

  getters: {
    formInfo: () => engine.getFormInfo(),
    allForms: () => engine.getAllForms(),
  },

  actions: {
    switchForm(form: CharacterForm) {
      if (engine.switchForm(form)) {
        this.currentForm = form
        localStorage.setItem('luna_character_form', form)
        this._sync()
      }
    },
    setAnimationState(state: CharacterState) {
      if (engine.setState(state)) this.animationState = state
    },
    recordInteraction() {
      engine.recordInteraction()
      const up = engine.checkLevelUp()
      this._sync()
      return up
    },
    async restore() {
      const saved = localStorage.getItem('luna_character_state')
      if (saved) {
        try { engine.fromJSON(JSON.parse(saved)) } catch (_) {}
      }
      this._sync()
    },
    _sync() {
      this.level = engine.level
      this.levelTitle = engine.levelTitle
      this.stats = { ...engine.stats }
      this.unlocked = { ...engine.unlocked }
    },
  },
})
