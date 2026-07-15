/**
 * Music Store — 音乐状态 (Pinia)
 *
 * 引擎层: @/services/audio (AudioAnalyzer)
 * 存储层: 本文件 — Vue 响应式 + 持久化
 */
import { defineStore } from 'pinia'
import { getAudioAnalyzer } from '@/services/audio'
import type { Song, AudioAnalysisResult, PlayMode } from '@/services/audio'

const analyzer = getAudioAnalyzer()

export const useMusicStore = defineStore('music', {
  state: () => ({
    playlist: [] as Song[],
    currentSong: null as Song | null,
    currentIndex: -1,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    audioAnalysis: {
      bpm: 0, volume: 0, beat: false, energy: 0, isClimax: false,
    } as AudioAnalysisResult,
    playMode: 'list' as PlayMode,
    uploadQueue: [] as any[],
    hiddenSongUnlocked: false,
  }),

  getters: {
    nowPlaying: (state) => state.currentSong,
    isEmpty: (state) => state.playlist.length === 0,
    progress: (state) => state.duration > 0 ? state.currentTime / state.duration : 0,
    recommendedAnimation(): string {
      return analyzer.getRecommendedAnimation()
    },
  },

  actions: {
    play(index: number) {
      if (index >= 0 && index < this.playlist.length) {
        this.currentIndex = index
        this.currentSong = this.playlist[index]
        this.isPlaying = true
      }
    },
    pause() { this.isPlaying = false },
    resume() { if (this.currentSong) this.isPlaying = true },
    next() {
      if (this.playlist.length === 0) return
      this.play((this.currentIndex + 1) % this.playlist.length)
    },
    previous() {
      if (this.playlist.length === 0) return
      this.play((this.currentIndex - 1 + this.playlist.length) % this.playlist.length)
    },
    updateProgress(time: number, dur: number) { this.currentTime = time; this.duration = dur },
    updateAudioAnalysis(data: Partial<AudioAnalysisResult>) {
      this.audioAnalysis = { ...this.audioAnalysis, ...data }
    },
    addSong(song: Omit<Song, 'id' | 'uploadedAt'>) {
      const s: Song = { id: `song_${Date.now()}`, ...song, uploadedAt: new Date().toISOString() }
      this.playlist.push(s)
      return s
    },
    removeSong(id: string) {
      const idx = this.playlist.findIndex(s => s.id === id)
      if (idx > -1) {
        this.playlist.splice(idx, 1)
        if (this.currentSong?.id === id) { this.currentSong = null; this.isPlaying = false }
      }
    },
    setPlaylist(songs: Song[]) { this.playlist = songs },
    clearUploadQueue() { this.uploadQueue = [] },
  },
})
