/**
 * Composables 单元测试 — 前端逻辑层
 */
import { describe, it, expect, beforeEach } from 'vitest'

// Mock localStorage
const store: Record<string, string> = {}
beforeEach(() => {
  for (const k of Object.keys(store)) delete store[k]
})

// Simulate the daily streak logic (from useDailyStreak.ts)
function computeStreak() {
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  const lastVisit = store['luna_last_visit']
  const data = JSON.parse(store['luna_streak'] || '{"streak":0,"longest":0,"total":0}')
  const checkedInToday = store['luna_today_checked_in'] === today

  if (checkedInToday) return data

  if (lastVisit === yesterday) {
    data.streak++
    if (data.streak > data.longest) data.longest = data.streak
    data.total++
  } else if (lastVisit && lastVisit !== today) {
    data.streak = 1; data.total++
  } else {
    data.streak = 1; data.total = 1
  }

  store['luna_last_visit'] = today
  store['luna_today_checked_in'] = today
  store['luna_streak'] = JSON.stringify(data)
  return data
}

function getMilestone(day: number): string | null {
  if (day === 3) return '3天'
  if (day === 7) return '7天'
  if (day === 30) return '30天'
  if (day === 100) return '100天'
  return null
}

describe('Daily Streak Logic', () => {
  it('should start at day 1 on first visit', () => {
    const result = computeStreak()
    expect(result.streak).toBe(1)
    expect(result.total).toBe(1)
  })

  it('should not double-count same day', () => {
    computeStreak()
    const result = computeStreak()
    expect(result.streak).toBe(1)
  })

  it('should increment on consecutive days', () => {
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    store['luna_last_visit'] = yesterday
    const result = computeStreak()
    expect(result.streak).toBe(2)
  })

  it('should reset streak on missed day', () => {
    const twoDaysAgo = new Date(Date.now() - 172800000).toDateString()
    store['luna_last_visit'] = twoDaysAgo
    store['luna_streak'] = JSON.stringify({ streak: 5, longest: 5, total: 10 })
    const result = computeStreak()
    expect(result.streak).toBe(1)
  })

  it('should track longest streak', () => {
    store['luna_streak'] = JSON.stringify({ streak: 5, longest: 5, total: 10 })
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    store['luna_last_visit'] = yesterday
    const result = computeStreak()
    expect(result.longest).toBe(6)
  })
})

describe('Milestone Detection', () => {
  it('should detect day 3 milestone', () => {
    expect(getMilestone(3)).toBe('3天')
  })
  it('should detect day 7 milestone', () => {
    expect(getMilestone(7)).toBe('7天')
  })
  it('should detect day 30 milestone', () => {
    expect(getMilestone(30)).toBe('30天')
  })
  it('should detect day 100 milestone', () => {
    expect(getMilestone(100)).toBe('100天')
  })
  it('should return null for non-milestone days', () => {
    expect(getMilestone(5)).toBeNull()
  })
})

// Welcome-back greeting logic
function getWelcomeGreeting(hour: number, daysSinceFirst: number, nickname: string): string {
  const prefix = nickname ? `${nickname}，` : ''
  if (hour >= 22 || hour < 6) return `这么晚了还来看我...谢谢你 ${nickname}`.trim()
  if (hour < 10) return `${prefix}早上好呀～今天想听什么歌？☀️`
  if (daysSinceFirst > 0) return `${prefix}你回来啦～我们已经相伴 ${daysSinceFirst} 天了 ✨`
  return `${prefix}你来啦～今天想做什么？`
}

describe('Welcome Greeting', () => {
  it('should greet differently at night', () => {
    const g = getWelcomeGreeting(23, 5, 'L shuo')
    expect(g).toContain('这么晚了')
    expect(g).toContain('L shuo')
  })
  it('should greet in the morning', () => {
    expect(getWelcomeGreeting(8, 3, 'L shuo')).toContain('早上好')
  })
  it('should show day count for returning users', () => {
    expect(getWelcomeGreeting(14, 10, 'L shuo')).toContain('10 天')
  })
})
