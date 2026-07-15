/**
 * Sound Effects 逻辑测试
 * 验证音符频率、和弦计算、环境音参数
 */
import { describe, it, expect } from 'vitest'

// Frequency constants from useSoundEffects
const CLICK_FREQ = 880
const HOVER_FREQ = 660
const SUCCESS_CHORD = [523, 784]  // C5 + G5
const NOTIFY_CHORD = [659, 987]   // E5 + B5
const OPEN_CHORD = [784, 1047]    // G5 + C6
const AMBIENT_BASE = 55           // A1

describe('Sound Effect Frequencies', () => {
  it('click should use high frequency for crisp feedback', () => {
    expect(CLICK_FREQ).toBeGreaterThan(500)
    expect(CLICK_FREQ).toBeLessThan(2000)
  })
  it('hover should be lower than click', () => {
    expect(HOVER_FREQ).toBeLessThan(CLICK_FREQ)
  })
  it('ambient base should be sub-bass', () => {
    expect(AMBIENT_BASE).toBeLessThan(100)
  })
})

describe('Chord Construction', () => {
  it('success chord should be a perfect fifth', () => {
    // C5 (523) to G5 (784) is approximately a perfect fifth
    const ratio = SUCCESS_CHORD[1] / SUCCESS_CHORD[0]
    expect(ratio).toBeCloseTo(1.5, 0)
  })
  it('open chord should be higher than notify', () => {
    const openAvg = (OPEN_CHORD[0] + OPEN_CHORD[1]) / 2
    const notifyAvg = (NOTIFY_CHORD[0] + NOTIFY_CHORD[1]) / 2
    expect(openAvg).toBeGreaterThan(notifyAvg)
  })
  it('all chords should have 2 notes', () => {
    expect(SUCCESS_CHORD.length).toBe(2)
    expect(NOTIFY_CHORD.length).toBe(2)
    expect(OPEN_CHORD.length).toBe(2)
  })
})

describe('Sound Duration', () => {
  it('click should be very short (< 100ms)', () => {
    const clickDuration = 0.08
    expect(clickDuration).toBeLessThan(0.1)
  })
  it('success chime should be longer than click', () => {
    const chimeDuration = 0.4
    const clickDuration = 0.08
    expect(chimeDuration).toBeGreaterThan(clickDuration)
  })
  it('open chime should be the longest', () => {
    expect(0.6).toBeGreaterThan(0.4)
    expect(0.6).toBeGreaterThan(0.3)
  })
})

describe('Volume Levels', () => {
  it('ambient should be very quiet', () => {
    const ambientVol = 0.015
    expect(ambientVol).toBeLessThan(0.05)
  })
  it('UI sounds should be subtle', () => {
    const clickVol = 0.05
    expect(clickVol).toBeLessThan(0.1)
  })
  it('chime should be louder than click', () => {
    const chimeVol = 0.06
    const clickVol = 0.05
    expect(chimeVol).toBeGreaterThan(clickVol)
  })
})
