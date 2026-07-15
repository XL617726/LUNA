import { describe, it, expect, beforeEach } from 'vitest'
import { AnimationStateMachine, AnimationState } from '../../packages/animation-engine/src/AnimationStateMachine'

describe('AnimationStateMachine', () => {
  let sm: AnimationStateMachine

  beforeEach(() => { sm = new AnimationStateMachine() })

  it('should start in idle', () => {
    expect(sm.currentState).toBe(AnimationState.IDLE)
  })

  it('should allow idle → sing', () => {
    expect(sm.transition(AnimationState.SING, 'test')).toBe(true)
    expect(sm.currentState).toBe(AnimationState.SING)
  })

  it('should reject idle → dance (skip sing)', () => {
    expect(sm.transition(AnimationState.DANCE, 'test')).toBe(false)
    expect(sm.currentState).toBe(AnimationState.IDLE)
  })

  it('should complete full cycle: idle→sing→dance→happy→bow→idle', () => {
    expect(sm.transition(AnimationState.SING, 'start')).toBe(true)
    expect(sm.transition(AnimationState.DANCE, 'beat')).toBe(true)
    expect(sm.transition(AnimationState.HAPPY, 'climax')).toBe(true)
    expect(sm.transition(AnimationState.BOW, 'end')).toBe(true)
    expect(sm.transition(AnimationState.IDLE, 'timeout')).toBe(true)
  })

  it('should fire callbacks on transition', () => {
    let fired = false
    sm.onTransition(() => { fired = true })
    sm.transition(AnimationState.SING, 'test')
    expect(fired).toBe(true)
  })

  it('should fire enter/exit callbacks', () => {
    let entered = false, exited = false
    sm.onEnter(AnimationState.SING, () => { entered = true })
    sm.onExit(AnimationState.IDLE, () => { exited = true })
    sm.transition(AnimationState.SING, 'test')
    expect(entered).toBe(true)
    expect(exited).toBe(true)
  })
})
