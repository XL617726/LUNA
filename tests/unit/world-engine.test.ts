import { describe, it, expect } from 'vitest'
import { SceneManager } from '../../packages/world-engine/src/Scene'
import { WeatherSystem } from '../../packages/world-engine/src/Weather'
import { TimeSystem } from '../../packages/world-engine/src/Time'
import { WorldEventBus } from '../../packages/world-engine/src/Event'

describe('SceneManager', () => {
  it('should start with school scene', () => {
    const sm = new SceneManager()
    expect(sm.current.id).toBe('school')
  })

  it('should switch scenes', () => {
    const sm = new SceneManager()
    expect(sm.setScene('live')).toBe(true)
    expect(sm.current.id).toBe('live')
    expect(sm.setScene('invalid')).toBe(false)
  })

  it('should find interactable objects', () => {
    const sm = new SceneManager()
    sm.setScene('live')
    const objs = sm.getInteractables()
    expect(objs.length).toBeGreaterThan(0)
    expect(objs.some(o => o.type === 'mic')).toBe(true)
  })

  it('should fire onChange callback', () => {
    const sm = new SceneManager()
    let changed = false
    sm.onChange(() => { changed = true })
    sm.setScene('office')
    expect(changed).toBe(true)
  })
})

describe('WeatherSystem', () => {
  it('should default to clear', () => {
    const ws = new WeatherSystem()
    expect(ws.current.type).toBe('clear')
  })

  it('should return particle config for non-clear weather', () => {
    const ws = new WeatherSystem()
    ws.set('rain', 0.5)
    const cfg = ws.getParticleConfig()
    expect(cfg).not.toBeNull()
    expect(cfg!.color).toBe('#87ceeb')
  })
})

describe('TimeSystem', () => {
  it('should compute current period', () => {
    const ts = new TimeSystem()
    expect(['dawn','morning','afternoon','evening','night']).toContain(ts.period)
  })

  it('should report night time correctly', () => {
    const ts = new TimeSystem()
    expect(typeof ts.isNightTime).toBe('boolean')
  })

  it('should start and stop without error', () => {
    const ts = new TimeSystem()
    ts.start()
    ts.stop()
  })
})

describe('WorldEventBus', () => {
  it('should emit and receive events', () => {
    const bus = new WorldEventBus()
    let received: any = null
    bus.on('test', (e) => { received = e })
    bus.emit('test', { key: 'value' })
    expect(received).not.toBeNull()
    expect(received.data.key).toBe('value')
  })

  it('should return unsubscribe function', () => {
    const bus = new WorldEventBus()
    let count = 0
    const unsub = bus.on('test', () => { count++ })
    bus.emit('test')
    expect(count).toBe(1)
    unsub()
    bus.emit('test')
    expect(count).toBe(1) // not incremented
  })

  it('should support "all" listener', () => {
    const bus = new WorldEventBus()
    let allEvents: string[] = []
    bus.on('all', (e) => { allEvents.push(e.type) })
    bus.emit('foo')
    bus.emit('bar')
    expect(allEvents).toContain('foo')
    expect(allEvents).toContain('bar')
  })
})

describe('Weather Edge Cases', () => {
  it('should return null particles for clear weather', () => {
    const ws = new WeatherSystem()
    expect(ws.getParticleConfig()).toBeNull()
  })

  it('should allow manual weather override', () => {
    const ws = new WeatherSystem()
    ws.set('starfall', 0.8)
    expect(ws.current.type).toBe('starfall')
    expect(ws.current.intensity).toBe(0.8)
    expect(ws.current.particles).toBe(true)
  })

  it('should handle zero intensity', () => {
    const ws = new WeatherSystem()
    ws.set('snow', 0)
    expect(ws.current.particles).toBe(false)
  })

  it('should return correct particle counts per weather type', () => {
    const ws = new WeatherSystem()
    ws.set('rain', 0.5)
    expect(ws.getParticleConfig()?.count).toBe(60)
    ws.set('snow', 0.5)
    expect(ws.getParticleConfig()?.count).toBe(40)
    ws.set('starfall', 0.5)
    expect(ws.getParticleConfig()?.count).toBe(30)
  })

  it('should not crash on rapid weather changes', () => {
    const ws = new WeatherSystem()
    for (let i = 0; i < 100; i++) {
      ws.set('rain', Math.random())
      ws.set('clear', 0)
    }
    expect(ws.current.type).toBe('clear')
  })
})
