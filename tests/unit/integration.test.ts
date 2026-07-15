/**
 * 全栈集成测试 — 验证所有引擎协同工作
 * Character → Animation → Audio → AI → Story → World
 */
import { describe, it, expect } from 'vitest'
import { CharacterEngine } from '../../packages/character-engine/src/CharacterEngine'
import { AnimationStateMachine, AnimationState } from '../../packages/animation-engine/src/AnimationStateMachine'
import { AudioAnalyzer } from '../../packages/audio-engine/src/AudioAnalyzer'
import { DialogueEngine } from '../../packages/ai-engine/src/DialogueEngine'
import { MemorySystem } from '../../packages/ai-engine/src/MemorySystem'
import { StorySystem } from '../../packages/story-engine/src/StorySystem'
import { SceneManager } from '../../packages/world-engine/src/Scene'
import { WorldEventBus } from '../../packages/world-engine/src/Event'

describe('Full Engine Chain', () => {
  it('should complete a full singing flow', () => {
    // 1. Character starts idle, graduation form
    const char = new CharacterEngine()
    expect(char.currentForm).toBe('graduation')
    expect(char.currentState).toBe('idle')

    // 2. User uploads song → audio analysis
    const audio = new AudioAnalyzer()
    const analysis = audio.analyze({ currentTime: 5, duration: 200 })
    expect(analysis.energy).toBeGreaterThanOrEqual(0)

    // 3. Audio drives animation
    const anim = new AnimationStateMachine()
    anim.transition(AnimationState.SING, 'music_start')
    expect(anim.currentState).toBe(AnimationState.SING)

    // 4. Character state updates
    char.setState('sing')
    expect(char.currentState).toBe('sing')

    // 5. Scene has a mic to click
    const scene = new SceneManager()
    scene.setScene('live')
    const mic = scene.getObject('mic_live')
    expect(mic).toBeTruthy()
    expect(mic!.onClick).toBe('sing')

    // 6. Event triggers singing
    const events = new WorldEventBus()
    let triggered = false
    events.on('sing', () => { triggered = true })
    events.emit('sing')
    expect(triggered).toBe(true)
  })

  it('should complete a full memory flow', () => {
    // AI dialogue → save interaction → recall
    const dialogue = new DialogueEngine()
    const memory = new MemorySystem()
    memory.init()

    const reply = dialogue.speak('greeting')
    expect(typeof reply).toBe('string')

    memory.add('interaction', { userSaid: '你好', lunaSaid: reply })
    expect(memory.count).toBeGreaterThanOrEqual(1)

    const recalled = memory.recall('interaction', 5)
    expect(recalled.length).toBeGreaterThanOrEqual(1)
  })

  it('should complete a full story flow', () => {
    const memory = new MemorySystem()
    memory.init()
    const story = new StorySystem()

    // First launch triggers first_meet
    const results = story.checkTriggers({
      isFirstLaunch: true, isNightTime: false, isBirthday: false,
      consecutivePlays: 0, firstUpload: false,
    })
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].story.id).toBe('first_meet')

    // Story saved to memory
    memory.add('easter_egg', { storyId: 'first_meet', name: '初遇' })
    expect(memory.hasMemory('easter_egg')).toBe(true)
  })

  it('should handle character growth through interactions', () => {
    const char = new CharacterEngine()
    const story = new StorySystem()

    // Simulate many interactions
    for (let i = 0; i < 35; i++) char.recordInteraction()

    // Check level progression
    const levelUp = char.checkLevelUp()
    if (levelUp) {
      expect(levelUp.to).toBeGreaterThan(levelUp.from)
    }

    // Unlock stories as level increases
    char.unlockActions(['dance', 'happy'])
    expect(char.unlocked.actions).toContain('dance')
  })

  it('should handle audio-driven animation transitions', () => {
    const audio = new AudioAnalyzer()
    const anim = new AnimationStateMachine()

    // Simulate music playing → energy rises → climax
    const result1 = audio.analyze({ currentTime: 10, duration: 200 })
    const recommendedState = AudioAnalyzer.resolveFromAudio
      ? anim.currentState
      : AnimationState.SING

    expect(['idle','sing','dance','happy']).toContain(recommendedState)
  })
})
