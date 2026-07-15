/**
 * useMelodyPlayer — 旋律合成器
 * 用 Web Audio API 演奏真实的音符序列
 * 让 LUNA 的"唱歌"真的能听到旋律
 */

// 音符频率映射 (C4-B4)
const NOTES: Record<string, number> = {
  C4:262, D4:294, E4:330, F4:349, G4:392, A4:440, B4:494,
  C5:523, D5:587, E5:659, F5:698, G5:784, A5:880, B5:988,
  R:0, // 休止符
}

// 预置旋律 (音符序列 + 时值)
const MELODIES: Record<string, Array<[string, number]>> = {
  // 「夏天的风」— 温柔旋律
  summer_wind: [
    ['E4',0.4],['G4',0.4],['A4',0.6],['G4',0.3],['E4',0.3],
    ['D4',0.5],['E4',0.4],['C4',0.8],
    ['R',0.2],
    ['E4',0.4],['G4',0.4],['A4',0.6],['C5',0.4],['A4',0.3],
    ['G4',0.5],['E4',0.4],['D4',0.4],['C4',1.0],
  ],
  // 「夜空中最亮的星」— 明亮旋律
  brightest_star: [
    ['G4',0.3],['G4',0.3],['A4',0.4],['G4',0.3],['E4',0.5],
    ['D4',0.3],['E4',0.3],['G4',0.6],
    ['R',0.15],
    ['A4',0.3],['A4',0.3],['C5',0.4],['A4',0.3],['G4',0.5],
    ['E4',0.3],['G4',0.3],['A4',0.4],['G4',0.8],
  ],
  // 「起风了」— 悠扬旋律
  wind_rises: [
    ['C4',0.5],['E4',0.3],['G4',0.4],['A4',0.5],
    ['G4',0.3],['E4',0.3],['D4',0.4],['C4',0.6],
    ['R',0.2],
    ['A4',0.4],['G4',0.3],['E4',0.4],['G4',0.3],
    ['A4',0.5],['G4',0.3],['E4',0.3],['C4',1.0],
  ],
}

export function useMelodyPlayer() {
  let audioCtx: AudioContext | null = null
  let playing = false
  let stopRequested = false

  function getCtx(): AudioContext {
    if (!audioCtx) audioCtx = new AudioContext()
    return audioCtx
  }

  /** 演奏一个音符 */
  function playNote(freq: number, startTime: number, duration: number, gainNode: GainNode) {
    if (freq === 0) return // 休止符
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const noteGain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.value = freq

    // 音符包络
    const now = ctx.currentTime + startTime
    noteGain.gain.setValueAtTime(0, now)
    noteGain.gain.linearRampToValueAtTime(0.25, now + 0.02)
    noteGain.gain.setValueAtTime(0.25, now + duration * 0.7)
    noteGain.gain.linearRampToValueAtTime(0, now + duration)

    osc.connect(noteGain)
    noteGain.connect(gainNode)
    osc.start(now)
    osc.stop(now + duration + 0.01)
  }

  /** 演奏完整旋律 */
  async function playMelody(songName: string): Promise<void> {
    stop()
    playing = true
    stopRequested = false

    const ctx = getCtx()
    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.6
    masterGain.connect(ctx.destination)

    // 选择旋律
    const melodyKey = songName.includes('夏天') ? 'summer_wind'
      : songName.includes('夜空') ? 'brightest_star'
      : songName.includes('起风') ? 'wind_rises'
      : 'summer_wind'

    const melody = MELODIES[melodyKey] || MELODIES.summer_wind

    // 添加和声层
    const harmonyGain = ctx.createGain()
    harmonyGain.gain.value = 0.12
    harmonyGain.connect(ctx.destination)

    let time = 0
    for (const [note, duration] of melody) {
      if (stopRequested) break
      const freq = NOTES[note] || 0
      playNote(freq, time, duration * 1.2, masterGain)
      // 低八度和声
      if (freq > 0) playNote(freq / 2, time, duration * 1.2, harmonyGain)
      time += duration
    }

    // 等待演奏完成
    const totalDuration = time * 1000 + 500
    return new Promise(resolve => {
      setTimeout(() => {
        playing = false
        masterGain.disconnect()
        harmonyGain.disconnect()
        resolve()
      }, totalDuration)
    })
  }

  function stop() {
    stopRequested = true
    playing = false
  }

  function getTotalDuration(songName: string): number {
    const melodyKey = songName.includes('夏天') ? 'summer_wind'
      : songName.includes('夜空') ? 'brightest_star'
      : 'wind_rises'
    const melody = MELODIES[melodyKey] || MELODIES.summer_wind
    return melody.reduce((sum, [, d]) => sum + d, 0)
  }

  return { playing, playMelody, stop, getTotalDuration }
}
