/**
 * useSoundEffects — 音效系统
 * 房间环境音 + UI 交互音效，全部用 Web Audio API 合成
 * 不需要任何音频文件
 */
let audioCtx: AudioContext | null = null
let ambientGain: GainNode | null = null
let ambientOsc: OscillatorNode | null = null
let ambientPlaying = false

function ctx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

/** 播放一个短促的音效 */
function playTone(freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.08) {
  try {
    const c = ctx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = type; osc.frequency.value = freq
    gain.gain.setValueAtTime(vol, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
    osc.connect(gain); gain.connect(c.destination)
    osc.start(); osc.stop(c.currentTime + duration + 0.01)
  } catch (_) {}
}

/** 播放两个音符的和声音效 (更悦耳) */
function playChime(freq1: number, freq2: number, duration = 0.3, vol = 0.06) {
  playTone(freq1, duration, 'sine', vol)
  playTone(freq2, duration, 'sine', vol * 0.7)
}

// ===== UI 音效 =====
export function useSoundEffects() {
  function click()   { playTone(880, 0.08, 'sine', 0.05) }
  function hover()   { playTone(660, 0.05, 'sine', 0.03) }
  function success() { playChime(523, 784, 0.4, 0.07) }  // C5+E5 和弦
  function notify()  { playChime(659, 987, 0.3, 0.06) }  // 清脆提示
  function open()    { playChime(784, 1047, 0.6, 0.08) } // 打开礼物

  return { click, hover, success, notify, open }
}

// ===== 房间环境音 =====
export function useAmbientSound() {
  function start() {
    if (ambientPlaying) return
    try {
      const c = ctx()
      // 非常低频的温暖底噪
      const osc = c.createOscillator()
      osc.type = 'sine'; osc.frequency.value = 55 // A1 低音
      const gain = c.createGain()
      gain.gain.value = 0.015 // 几乎听不到，但能感受到"存在"

      // 轻微频率漂移
      const lfo = c.createOscillator()
      lfo.type = 'sine'; lfo.frequency.value = 0.1
      const lfoGain = c.createGain()
      lfoGain.gain.value = 2
      lfo.connect(lfoGain); lfoGain.connect(osc.frequency)

      osc.connect(gain); gain.connect(c.destination)
      osc.start(); lfo.start()
      ambientOsc = osc; ambientGain = gain
      ambientPlaying = true
    } catch (_) {}
  }

  function stop() {
    if (ambientGain) {
      ambientGain.gain.linearRampToValueAtTime(0, ctx().currentTime + 1)
      setTimeout(() => {
        ambientOsc?.stop(); ambientOsc = null
        ambientGain = null; ambientPlaying = false
      }, 1100)
    }
  }

  function setVolume(v: number) {
    if (ambientGain) ambientGain.gain.value = Math.max(0, Math.min(0.03, v))
  }

  return { start, stop, setVolume, get playing() { return ambientPlaying } }
}
