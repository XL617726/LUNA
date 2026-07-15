import { describe, it, expect } from 'vitest'
import { AudioAnalyzer } from '../../packages/audio-engine/src/AudioAnalyzer'
import { FileValidator } from '../../packages/audio-engine/src/FileValidator'

describe('AudioAnalyzer', () => {
  it('should initialize and return default result', () => {
    const analyzer = new AudioAnalyzer()
    const result = analyzer.getResult()
    expect(result.bpm).toBe(0)
    expect(result.energy).toBe(0)
    expect(result.beat).toBe(false)
  })

  it('should analyze audio data', () => {
    const analyzer = new AudioAnalyzer()
    const result = analyzer.analyze({ currentTime: 10, duration: 180 })
    expect(typeof result.energy).toBe('number')
    expect(result.energy).toBeGreaterThanOrEqual(0)
    expect(result.energy).toBeLessThanOrEqual(1)
  })

  it('should recommend animation based on BPM', () => {
    const analyzer = new AudioAnalyzer()
    analyzer.analyze({ currentTime: 5, duration: 180 })
    const anim = analyzer.getRecommendedAnimation()
    expect(['idle','sing','dance','happy']).toContain(anim)
  })

  it('should create new instances independently', () => {
    const a1 = new AudioAnalyzer()
    const a2 = new AudioAnalyzer()
    expect(a1).not.toBe(a2)
  })
})

describe('FileValidator', () => {
  it('should validate supported formats', () => {
    const fv = new FileValidator()
    const result = fv.validate({ name: 'song.mp3', size: 1000000, path: '/test/song.mp3' })
    expect(result.valid).toBe(true)
  })

  it('should reject unsupported formats', () => {
    const fv = new FileValidator()
    const result = fv.validate({ name: 'video.mp4', size: 1000000, path: '/test/video.mp4' })
    expect(result.valid).toBe(false)
  })

  it('should reject oversized files', () => {
    const fv = new FileValidator({ maxSize: 1024 })
    const result = fv.validate({ name: 'song.mp3', size: 99999999, path: '/test/song.mp3' })
    expect(result.valid).toBe(false)
  })
})
