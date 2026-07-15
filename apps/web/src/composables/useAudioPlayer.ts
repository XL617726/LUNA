/**
 * useAudioPlayer — Web Audio API 播放器
 * 支持真实音频文件 + 合成音调（demo 模式）
 */
import { ref } from 'vue'
import { getAudioAnalyzer } from '@luna/audio-engine'
import type { Song, AudioAnalysisResult } from '@luna/shared-types'

export function useAudioPlayer() {
  const playing = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const analysis = ref<AudioAnalysisResult>({ bpm: 0, volume: 0, beat: false, energy: 0, isClimax: false })

  let audioCtx: AudioContext | null = null
  let sourceNode: AudioBufferSourceNode | OscillatorNode | null = null
  let gainNode: GainNode | null = null
  let analyserNode: AnalyserNode | null = null
  let startTime = 0
  let analysisTimer: number | null = null

  const analyzer = getAudioAnalyzer()

  function getCtx(): AudioContext {
    if (!audioCtx) audioCtx = new AudioContext()
    return audioCtx
  }

  /** 播放真实音频文件 */
  async function playFile(fileUrl: string, song?: Song) {
    stop()
    const ctx = getCtx()
    try {
      const resp = await fetch(fileUrl)
      const buffer = await ctx.decodeAudioData(await resp.arrayBuffer())
      playBuffer(buffer, song)
    } catch {
      // 文件不可用，fallback 到合成音调
      playTone(song)
    }
  }

  /** 合成音调播放（demo / 降级方案）*/
  function playTone(song?: Song) {
    stop()
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const analyser = ctx.createAnalyser()

    analyser.fftSize = 256
    osc.type = 'triangle'
    // 根据 BPM 调整音调
    const freq = song?.bpm ? 220 + (song.bpm - 60) * 2 : 330
    osc.frequency.value = freq

    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 3)

    osc.connect(gain)
    gain.connect(analyser)
    analyser.connect(ctx.destination)

    osc.start()
    sourceNode = osc
    gainNode = gain
    analyserNode = analyser
    startTime = ctx.currentTime
    duration.value = 3
    playing.value = true

    osc.onended = () => { playing.value = false; stopAnalysis() }
    startAnalysis(song)
  }

  function playBuffer(buffer: AudioBuffer, song?: Song) {
    const ctx = getCtx()
    const source = ctx.createBufferSource()
    const gain = ctx.createGain()
    const analyser = ctx.createAnalyser()

    analyser.fftSize = 256
    source.buffer = buffer
    gain.gain.value = 0.7

    source.connect(gain)
    gain.connect(analyser)
    analyser.connect(ctx.destination)

    source.start()
    sourceNode = source
    gainNode = gain
    analyserNode = analyser
    startTime = ctx.currentTime
    duration.value = buffer.duration
    playing.value = true

    source.onended = () => { playing.value = false; stopAnalysis() }
    startAnalysis(song)
  }

  function pause() {
    if (gainNode) gainNode.gain.value = 0
    playing.value = false
    stopAnalysis()
  }

  function resume() {
    if (gainNode) gainNode.gain.value = 0.3
    playing.value = true
  }

  function stop() {
    try { sourceNode?.stop() } catch (_) {}
    sourceNode = null; gainNode = null; analyserNode = null
    playing.value = false; currentTime.value = 0
    stopAnalysis()
  }

  function startAnalysis(song?: Song) {
    stopAnalysis()
    analysisTimer = window.setInterval(() => {
      if (!playing.value) return
      const elapsed = (getCtx().currentTime - startTime)
      currentTime.value = elapsed

      // 读取分析器数据
      if (analyserNode) {
        const data = new Uint8Array(analyserNode.frequencyBinCount)
        analyserNode.getByteFrequencyData(data)
        const avg = data.reduce((a, b) => a + b, 0) / data.length / 255
        const result = analyzer.analyze({
          currentTime: elapsed,
          duration: duration.value || song?.duration || 180,
        })
        analysis.value = { ...result, volume: Math.max(result.volume, avg), energy: avg }
      }
    }, 200)
  }

  function stopAnalysis() {
    if (analysisTimer) { clearInterval(analysisTimer); analysisTimer = null }
  }

  return { playing, currentTime, duration, analysis, playFile, playTone, pause, resume, stop }
}
