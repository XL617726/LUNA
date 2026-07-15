/**
 * Melody Player 逻辑测试
 * 验证音符频率映射、旋律时长计算、歌曲选择逻辑
 */
import { describe, it, expect } from 'vitest'

// Copied from useMelodyPlayer.ts for pure logic testing
const NOTES: Record<string, number> = {
  C4:262, D4:294, E4:330, F4:349, G4:392, A4:440, B4:494,
  C5:523, D5:587, E5:659, F5:698, G5:784, A5:880, B5:988,
  R:0,
}

const MELODIES: Record<string, Array<[string, number]>> = {
  summer_wind: [
    ['E4',0.4],['G4',0.4],['A4',0.6],['G4',0.3],['E4',0.3],
    ['D4',0.5],['E4',0.4],['C4',0.8],['R',0.2],
    ['E4',0.4],['G4',0.4],['A4',0.6],['C5',0.4],['A4',0.3],
    ['G4',0.5],['E4',0.4],['D4',0.4],['C4',1.0],
  ],
  brightest_star: [
    ['G4',0.3],['G4',0.3],['A4',0.4],['G4',0.3],['E4',0.5],
    ['D4',0.3],['E4',0.3],['G4',0.6],['R',0.15],
    ['A4',0.3],['A4',0.3],['C5',0.4],['A4',0.3],['G4',0.5],
    ['E4',0.3],['G4',0.3],['A4',0.4],['G4',0.8],
  ],
  wind_rises: [
    ['C4',0.5],['E4',0.3],['G4',0.4],['A4',0.5],
    ['G4',0.3],['E4',0.3],['D4',0.4],['C4',0.6],['R',0.2],
    ['A4',0.4],['G4',0.3],['E4',0.4],['G4',0.3],
    ['A4',0.5],['G4',0.3],['E4',0.3],['C4',1.0],
  ],
}

function getMelody(songName: string): Array<[string, number]> {
  if (songName.includes('夏天')) return MELODIES.summer_wind
  if (songName.includes('夜空')) return MELODIES.brightest_star
  if (songName.includes('起风')) return MELODIES.wind_rises
  return MELODIES.summer_wind
}

function getTotalDuration(songName: string): number {
  return getMelody(songName).reduce((sum, [, d]) => sum + d, 0)
}

describe('Melody Note Mapping', () => {
  it('should map C4 to 262Hz (middle C)', () => {
    expect(NOTES['C4']).toBe(262)
  })
  it('should map A4 to 440Hz (concert A)', () => {
    expect(NOTES['A4']).toBe(440)
  })
  it('should map R to 0 (rest)', () => {
    expect(NOTES['R']).toBe(0)
  })
  it('should have all notes as valid frequencies or 0', () => {
    for (const [_, freq] of Object.entries(NOTES)) {
      expect(freq).toBeGreaterThanOrEqual(0)
      expect(freq).toBeLessThanOrEqual(1000)
    }
  })
})

describe('Melody Selection', () => {
  it('should select summer_wind for 夏天的风', () => {
    const m = getMelody('夏天的风')
    expect(m[0][0]).toBe('E4')
  })
  it('should select brightest_star for 夜空中最亮的星', () => {
    const m = getMelody('夜空中最亮的星')
    expect(m[0][0]).toBe('G4')
  })
  it('should select wind_rises for 起风了', () => {
    const m = getMelody('起风了')
    expect(m[0][0]).toBe('C4')
  })
  it('should default to summer_wind for unknown songs', () => {
    const m = getMelody('未知歌曲')
    expect(m).toBe(MELODIES.summer_wind)
  })
})

describe('Melody Duration', () => {
  it('should calculate total duration for summer_wind', () => {
    const dur = getTotalDuration('夏天的风')
    expect(dur).toBeGreaterThan(6)
    expect(dur).toBeLessThan(10)
  })
  it('should return positive durations for all melodies', () => {
    for (const name of ['夏天的风', '夜空中最亮的星', '起风了']) {
      expect(getTotalDuration(name)).toBeGreaterThan(0)
    }
  })
})

describe('Melody Structure', () => {
  it('each melody should have at least 12 notes', () => {
    for (const [, melody] of Object.entries(MELODIES)) {
      expect(melody.length).toBeGreaterThanOrEqual(12)
    }
  })
  it('each melody should contain at least one rest', () => {
    for (const [, melody] of Object.entries(MELODIES)) {
      expect(melody.some(([n]) => n === 'R')).toBe(true)
    }
  })
  it('notes should have valid frequencies', () => {
    for (const [, melody] of Object.entries(MELODIES)) {
      for (const [note] of melody) {
        expect(NOTES[note]).toBeDefined()
      }
    }
  })
})
