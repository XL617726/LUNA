import { describe, it, expect, beforeEach } from 'vitest'
import { StorySystem } from '../../packages/story-engine/src/StorySystem'

describe('StorySystem Edge Cases', () => {
  let sys: StorySystem
  beforeEach(() => { sys = new StorySystem() })

  it('should handle empty context', () => {
    expect(Array.isArray(sys.checkTriggers({}))).toBe(true)
  })

  it('should not retrigger same story', () => {
    sys.checkTriggers({ isFirstLaunch: true, isNightTime: false, isBirthday: false, consecutivePlays: 0, firstUpload: false })
    expect(sys.checkTriggers({ isFirstLaunch: true, isNightTime: false, isBirthday: false, consecutivePlays: 0, firstUpload: false }).length).toBe(0)
  })

  it('should trigger night visit', () => {
    const r = sys.checkTriggers({ isFirstLaunch: false, isNightTime: true, isBirthday: false, consecutivePlays: 0, firstUpload: false })
    expect(r[0].story.id).toBe('night_visit')
  })

  it('should trigger consecutive plays at 10', () => {
    const r = sys.checkTriggers({ isFirstLaunch: false, isNightTime: false, isBirthday: false, consecutivePlays: 10, firstUpload: false })
    expect(r[0].story.id).toBe('ten_songs')
  })

  it('should not trigger below threshold', () => {
    const r = sys.checkTriggers({ isFirstLaunch: false, isNightTime: false, isBirthday: false, consecutivePlays: 5, firstUpload: false })
    expect(r.some(x => x.story.id === 'ten_songs')).toBe(false)
  })

  it('should manual trigger any story', () => {
    expect(sys.triggerStory('hidden_star')!.story.id).toBe('hidden_star')
  })

  it('should mark repeated trigger', () => {
    sys.triggerStory('hidden_star')
    expect(sys.triggerStory('hidden_star')!.isRepeat).toBe(true)
  })

  it('should return null for invalid id', () => {
    expect(sys.triggerStory('nonexistent')).toBeNull()
  })

  it('should list all with unlock status', () => {
    sys.getAllStories().forEach(s => expect(typeof s.unlocked).toBe('boolean'))
  })

  it('should list unlocked after trigger', () => {
    sys.checkTriggers({ isFirstLaunch: true, isNightTime: false, isBirthday: false, consecutivePlays: 0, firstUpload: false })
    expect(sys.getUnlockedStories()[0].id).toBe('first_meet')
  })
})
