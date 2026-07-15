/**
 * Vitest — Character Engine 单元测试
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { CharacterEngine, getCharacterEngine } from '../../packages/character-engine/src/CharacterEngine'

describe('CharacterEngine', () => {
  let engine: CharacterEngine

  beforeEach(() => { engine = new CharacterEngine() })

  it('should start as graduation form', () => {
    expect(engine.currentForm).toBe('graduation')
    expect(engine.currentState).toBe('idle')
  })

  it('should switch forms', () => {
    expect(engine.switchForm('live')).toBe(true)
    expect(engine.currentForm).toBe('live')
    expect(engine.switchForm('invalid' as any)).toBe(false)
  })

  it('should enforce valid state transitions', () => {
    expect(engine.setState('sing')).toBe(true)
    expect(engine.setState('dance')).toBe(true)
    expect(engine.setState('idle')).toBe(false) // dance → idle invalid
    expect(engine.setState('bow')).toBe(true)
    expect(engine.setState('idle')).toBe(true)  // bow → idle valid
  })

  it('should track interactions', () => {
    engine.recordInteraction()
    expect(engine.stats.interactionDays).toBe(1)
  })

  it('should serialize and restore', () => {
    engine.switchForm('CEO')
    engine.setState('sing')
    const json = engine.toJSON()
    const engine2 = new CharacterEngine()
    engine2.fromJSON(json)
    expect(engine2.currentForm).toBe('CEO')
    expect(engine2.currentState).toBe('sing')
  })

  it('LUNA can sing', () => {
    engine.setState('sing')
    expect(engine.currentState).toBe('sing')
  })
})
