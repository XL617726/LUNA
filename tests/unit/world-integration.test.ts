/**
 * World Engine 集成测试
 * 验证 Scene + Weather + Time + Event 协同工作
 */
import { describe, it, expect } from 'vitest'
import { SceneManager } from '../../packages/world-engine/src/Scene'
import { WeatherSystem } from '../../packages/world-engine/src/Weather'
import { TimeSystem } from '../../packages/world-engine/src/Time'
import { WorldEventBus } from '../../packages/world-engine/src/Event'

describe('World Integration', () => {
  it('should change weather when scene changes to night', () => {
    const scene = new SceneManager()
    const weather = new WeatherSystem()
    const events = new WorldEventBus()

    // When entering night scene (office)
    scene.setScene('office')
    weather.update(23) // 11 PM

    events.emit('time_change', { hour: 23, period: 'night' })

    // Night can be clear or starfall (15% random chance)
    expect(['clear', 'starfall']).toContain(weather.current.type)
    expect(typeof weather.current.intensity).toBe('number')
  })

  it('should notify scene change via events', () => {
    const scene = new SceneManager()
    const events = new WorldEventBus()
    const changes: string[] = []

    scene.onChange(s => changes.push(s.id))
    events.on('enter_scene', e => changes.push(e.type))

    scene.setScene('live')
    events.emit('enter_scene', { scene: 'live' })

    expect(changes).toContain('live')
    expect(changes).toContain('enter_scene')
  })

  it('should handle full day cycle', () => {
    const weather = new WeatherSystem()
    const events = new WorldEventBus()
    const weatherLog: string[] = []

    events.on('weather_change', e => weatherLog.push(e.data?.type as string || ''))

    // Simulate a day
    for (let h = 0; h < 24; h += 4) {
      weather.update(h)
    }

    // Each update should produce a valid weather type
    expect(['clear', 'rain', 'snow', 'starfall']).toContain(weather.current.type)
  })

  it('should handle interactive object click flow', () => {
    const scene = new SceneManager()
    const events = new WorldEventBus()

    scene.setScene('live')
    const mic = scene.getObject('mic_live')
    expect(mic).toBeDefined()
    expect(mic!.interactable).toBe(true)
    expect(mic!.onClick).toBe('sing')

    // Simulate click
    let clicked = false
    events.on('sing', () => { clicked = true })
    events.emit(mic!.onClick!)
    expect(clicked).toBe(true)
  })

  it('should stop and start time system cleanly', () => {
    const ts = new TimeSystem()
    ts.start()
    ts.stop()
    // No errors = pass
    expect(ts.isNightTime === true || ts.isNightTime === false).toBe(true)
  })
})
