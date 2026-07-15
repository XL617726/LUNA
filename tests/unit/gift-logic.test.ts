/**
 * Gift Logic 测试 — 礼物留言、昵称、Demo数据种子
 */
import { describe, it, expect, beforeEach } from 'vitest'

// Simulate localStorage
const store: Record<string, string> = {}
beforeEach(() => { for (const k of Object.keys(store)) delete store[k] })

function getNickname(): string {
  return store['luna_nickname'] || 'L shuo'
}

function getGiftMessage(): { message: string; from: string } {
  return {
    message: store['luna_gift_message'] || '愿LUNA的歌声，陪你度过每一个重要的日子。',
    from: store['luna_gift_from'] || '你的朋友',
  }
}

function isFirstVisit(): boolean {
  return !store['luna_has_launched']
}

function getDaysSinceFirst(): number {
  const first = parseInt(store['luna_first_visit'] || '0')
  if (!first) return 0
  return Math.floor((Date.now() - first) / 86400000)
}

describe('Gift Message', () => {
  it('should have default message', () => {
    const { message, from } = getGiftMessage()
    expect(message).toContain('LUNA')
    expect(from).toBe('你的朋友')
  })

  it('should allow custom message', () => {
    store['luna_gift_message'] = '专属留言'
    store['luna_gift_from'] = '小明'
    const { message, from } = getGiftMessage()
    expect(message).toBe('专属留言')
    expect(from).toBe('小明')
  })
})

describe('Nickname', () => {
  it('should default to L shuo', () => {
    expect(getNickname()).toBe('L shuo')
  })
  it('should use custom nickname', () => {
    store['luna_nickname'] = 'Alice'
    expect(getNickname()).toBe('Alice')
  })
})

describe('First Visit Detection', () => {
  it('should detect first visit', () => {
    expect(isFirstVisit()).toBe(true)
  })
  it('should detect returning visit', () => {
    store['luna_has_launched'] = '1'
    expect(isFirstVisit()).toBe(false)
  })
})

describe('Days Counter', () => {
  it('should return 0 when no first visit recorded', () => {
    expect(getDaysSinceFirst()).toBe(0)
  })
  it('should calculate days since first visit', () => {
    const threeDaysAgo = Date.now() - 86400000 * 3
    store['luna_first_visit'] = threeDaysAgo.toString()
    const days = getDaysSinceFirst()
    expect(days).toBeGreaterThanOrEqual(3)
  })
})
