/**
 * Edge Cases — 边界测试
 * 验证引擎在极端输入下的稳定性
 */
import { describe, it, expect } from 'vitest'
import { CharacterEngine } from '../../packages/character-engine/src/CharacterEngine'
import { MemorySystem } from '../../packages/ai-engine/src/MemorySystem'
import { AnimationStateMachine, AnimationState } from '../../packages/animation-engine/src/AnimationStateMachine'

describe('CharacterEngine Edge Cases', () => {
  const engine = new CharacterEngine()

  it('should reject invalid form switch', () => {
    expect(engine.switchForm('invalid' as any)).toBe(false)
    expect(engine.currentForm).toBe('graduation')
  })

  it('should reject empty string form', () => {
    expect(engine.switchForm('' as any)).toBe(false)
  })

  it('should handle toJSON/fromJSON roundtrip after modifications', () => {
    engine.switchForm('CEO'); engine.setState('sing')
    engine.recordPlay(); engine.recordPlay(); engine.recordPlay()
    const json = engine.toJSON()
    const e2 = new CharacterEngine()
    e2.fromJSON(json)
    expect(e2.currentForm).toBe('CEO')
    expect(e2.currentState).toBe('sing')
    expect(e2.stats.totalPlays).toBe(3)
  })

  it('should handle fromJSON with empty object', () => {
    const e2 = new CharacterEngine()
    e2.fromJSON({})
    expect(e2.currentForm).toBe('graduation') // defaults preserved
  })

  it('should handle fromJSON with null', () => {
    const e2 = new CharacterEngine()
    e2.fromJSON(null as any)
    expect(e2.currentForm).toBe('graduation')
  })
})

describe('MemorySystem Edge Cases', () => {
  const mem = new MemorySystem()
  mem.init()

  it('should handle recall of empty type', () => {
    const results = mem.recall('nonexistent_type' as any, 5)
    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBe(0)
  })

  it('should handle rapid adds', () => {
    for (let i = 0; i < 20; i++) {
      mem.add('interaction', { index: i })
    }
    expect(mem.count).toBeGreaterThanOrEqual(20)
  })

  it('should respect recall limit', () => {
    const results = mem.recall(null, 3)
    expect(results.length).toBeLessThanOrEqual(3)
  })

  it('should not crash on hasMemory with empty string', () => {
    expect(mem.hasMemory('' as any)).toBe(false)
  })
})

describe('AnimationStateMachine Edge Cases', () => {
  const sm = new AnimationStateMachine()

  it('should reject transition to same state', () => {
    expect(sm.currentState).toBe(AnimationState.IDLE)
    sm.transition(AnimationState.IDLE, 'same')
    expect(sm.currentState).toBe(AnimationState.IDLE)
  })

  it('should handle forceSetState', () => {
    sm.forceSetState(AnimationState.DANCE, 'force')
    expect(sm.currentState).toBe(AnimationState.DANCE)
  })

  it('should reject rapid invalid transitions', () => {
    for (let i = 0; i < 10; i++) {
      sm.transition(AnimationState.IDLE, 'rapid')
    }
    expect(sm.currentState).toBe(AnimationState.DANCE) // unchanged
  })

  it('should track state duration', () => {
    const sm2 = new AnimationStateMachine()
    sm2.transition(AnimationState.SING, 'start')
    const duration = sm2.getStateDuration()
    expect(duration).toBeGreaterThanOrEqual(0)
  })
})
