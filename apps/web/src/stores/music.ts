import { defineStore } from 'pinia'
import { getAudioAnalyzer } from '@luna/audio-engine'
import type { Song, AudioAnalysisResult, PlayMode } from '@luna/shared-types'

const analyzer = getAudioAnalyzer()

export const useMusicStore = defineStore('music', {
  state: () => ({
    playlist: [] as Song[],
    currentSong: null as Song | null,
    currentIndex: -1,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    audioAnalysis: { bpm: 0, volume: 0, beat: false, energy: 0, isClimax: false } as AudioAnalysisResult,
    playMode: 'list' as PlayMode,
    uploadQueue: [] as any[],
  }),

  getters: {
    isEmpty: (s) => s.playlist.length === 0,
    progress: (s) => (s.duration > 0 ? s.currentTime / s.duration : 0),
    recommendedAnimation: () => analyzer.getRecommendedAnimation(),
  },

  actions: {
    play(idx: number) {
      if (idx >= 0 && idx < this.playlist.length) {
        this.currentIndex = idx
        this.currentSong = this.playlist[idx]
        this.isPlaying = true
      }
    },
    pause() { this.isPlaying = false },
    resume() { if (this.currentSong) this.isPlaying = true },
    next() {
      if (this.playlist.length) this.play((this.currentIndex + 1) % this.playlist.length)
    },
    previous() {
      if (this.playlist.length) this.play((this.currentIndex - 1 + this.playlist.length) % this.playlist.length)
    },
    updateProgress(t: number, d: number) { this.currentTime = t; this.duration = d },
    updateAnalysis(d: Partial<AudioAnalysisResult>) { this.audioAnalysis = { ...this.audioAnalysis, ...d } },
    addSong(song: Omit<Song, 'id' | 'uploadedAt'>) {
      this.playlist.push({ id: `s_${Date.now()}`, ...song, uploadedAt: new Date().toISOString() })
    },
    removeSong(id: string) {
      const i = this.playlist.findIndex(s => s.id === id)
      if (i > -1) { this.playlist.splice(i, 1); if (this.currentSong?.id === id) { this.currentSong = null; this.isPlaying = false } }
    },
  },
})
