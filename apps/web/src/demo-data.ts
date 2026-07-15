/**
 * Demo data — 让 LUNA 首次启动就有内容可展示
 */
// Set default nickname
if (!localStorage.getItem('luna_nickname')) localStorage.setItem('luna_nickname', 'L shuo')

import { getCharacterEngine } from '@luna/character-engine'
import { getMemorySystem, getDialogueEngine } from '@luna/ai-engine'
import { getStorySystem } from '@luna/story-engine'
import type { Song } from '@luna/shared-types'

export function seedDemoData() {
  // Skip if already seeded
  if (localStorage.getItem('luna_seeded')) return
  localStorage.setItem('luna_seeded', '1')

  const engine = getCharacterEngine()
  const memory = getMemorySystem()
  const story = getStorySystem()
  const dialogue = getDialogueEngine()

  // Record some history
  engine.recordInteraction()
  engine.recordPlay()
  engine.recordSong()

  // Add demo memories
  memory.add('milestone', { name: 'LUNA 诞生', description: '2026年夏天，LUNA 第一次睁开眼睛' })
  memory.add('first_upload', { songName: '夏天的风' })
  memory.add('interaction', { userSaid: '你好呀', lunaSaid: '你来啦～今天想听什么歌？' })
  memory.add('milestone', { name: '第一次对话', description: '你第一次和 LUNA 说话' })
  memory.add('interaction', { userSaid: '唱首歌吧', lunaSaid: '这首歌送给你 🎵' })
  memory.add('favorite_song', { songName: '夜空中最亮的星', playCount: 5 })

  // Trigger first-meet story
  story.checkTriggers({ isFirstLaunch: true, isNightTime: false, isBirthday: false, consecutivePlays: 0, firstUpload: false })

  console.log('[Demo] 🌙 Seed data loaded — welcome to LUNA!')
}

/** Demo playlist */
export const DEMO_SONGS: Song[] = [
  {
    id: 'demo_1', name: '夏天的风', artist: 'Demo', duration: 245,
    bpm: 90, animationMode: 'sing', coverUrl: '', fileUrl: '',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: 'demo_2', name: '夜空中最亮的星', artist: 'Demo', duration: 268,
    bpm: 108, animationMode: 'dance', coverUrl: '', fileUrl: '',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: 'demo_3', name: '起风了', artist: 'Demo', duration: 312,
    bpm: 75, animationMode: 'sing', coverUrl: '', fileUrl: '',
    uploadedAt: new Date().toISOString(),
  },
]
