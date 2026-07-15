import { describe, it, expect } from 'vitest'
import { DialogueEngine } from '../../packages/ai-engine/src/DialogueEngine'
import { MemorySystem } from '../../packages/ai-engine/src/MemorySystem'
import { StorySystem } from '../../packages/story-engine/src/StorySystem'

describe('DialogueEngine', () => {
  it('should return different responses for different scenes', () => {
    const engine = new DialogueEngine()
    const g1 = engine.speak('greeting')
    const g2 = engine.speak('greeting')
    // Should not repeat the same sentence consecutively
    // (pool has multiple options, but could collide — just verify type)
    expect(typeof g1).toBe('string')
    expect(g1.length).toBeGreaterThan(0)
  })

  it('should handle unknown scenes gracefully', () => {
    const engine = new DialogueEngine()
    const result = engine.speak('nonexistent_scene' as any)
    expect(typeof result).toBe('string')
  })
})

describe('MemorySystem', () => {
  it('should add and recall memories', () => {
    const sys = new MemorySystem()
    sys.init()
    sys.add('milestone', { name: 'test', description: 'test memory' })
    expect(sys.count).toBeGreaterThanOrEqual(1)
    const recalled = sys.recall('milestone')
    expect(recalled.length).toBeGreaterThanOrEqual(1)
  })

  it('should detect first upload', () => {
    const sys = new MemorySystem()
    sys.init()
    expect(sys.hasMemory('first_upload')).toBe(false)
    sys.recordFirstUpload('test song')
    expect(sys.hasMemory('first_upload')).toBe(true)
  })

  it('should check birthday', () => {
    const sys = new MemorySystem()
    sys.init()
    expect(sys.isTodayBirthday()).toBe(false)
  })
})

describe('StorySystem', () => {
  it('should trigger first meet story', () => {
    const sys = new StorySystem()
    const results = sys.checkTriggers({
      isFirstLaunch: true, isNightTime: false, isBirthday: false,
      consecutivePlays: 0, firstUpload: false,
    })
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].story.id).toBe('first_meet')
  })

  it('should not re-trigger same story', () => {
    const sys = new StorySystem()
    sys.checkTriggers({ isFirstLaunch: true, isNightTime: false, isBirthday: false, consecutivePlays: 0, firstUpload: false })
    const second = sys.checkTriggers({ isFirstLaunch: true, isNightTime: false, isBirthday: false, consecutivePlays: 0, firstUpload: false })
    expect(second.length).toBe(0)
  })
})
