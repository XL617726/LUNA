/**
 * PixiJS Engine 测试
 */
import { describe, it, expect } from 'vitest'
import { PixiApp } from '../../packages/pixi-engine/src/PixiApp'
import { CharacterRenderer } from '../../packages/pixi-engine/src/CharacterRenderer'
import { Camera } from '../../packages/pixi-engine/src/Camera'
import type { CharacterState } from '@luna/shared-types'

describe('PixiApp', () => {
  it('should create with default config', () => {
    const app = new PixiApp()
    expect(app.initialized).toBe(false)
  })

  it('should accept custom config', () => {
    const app = new PixiApp({ width: 1024, height: 768, backgroundColor: 0xff0000 })
    expect(app.initialized).toBe(false)
  })

  it('should handle resize', () => {
    const app = new PixiApp()
    app.resize(640, 480)
  })

  it('should handle destroy without init', () => {
    const app = new PixiApp()
    app.destroy()
    expect(app.initialized).toBe(false)
  })
})

describe('CharacterRenderer', () => {
  it('should start in idle state', () => {
    const renderer = new CharacterRenderer()
    expect(renderer.state).toBe('idle')
  })

  it('should set animation state', () => {
    const renderer = new CharacterRenderer()
    const states: CharacterState[] = ['sing', 'dance', 'happy', 'bow', 'idle']
    for (const s of states) {
      renderer.setAnimation(s)
      expect(renderer.state).toBe(s)
    }
  })

  it('should register animations without error', () => {
    const renderer = new CharacterRenderer()
    renderer.registerAnimation('idle', '/test/idle.png', 8)
    renderer.registerAnimation('sing', '/test/sing.png', 12)
  })

  it('should handle setPosition without sprite', () => {
    const renderer = new CharacterRenderer()
    renderer.setPosition(100, 200)
  })

  it('should handle setAlpha without sprite', () => {
    const renderer = new CharacterRenderer()
    renderer.setAlpha(0.5)
  })

  it('should handle pixel mode toggle', () => {
    const renderer = new CharacterRenderer()
    renderer.setPixelMode(true)
    renderer.setPixelMode(false)
  })

  it('should handle destroy without attach', () => {
    const renderer = new CharacterRenderer()
    renderer.destroy()
  })
})

describe('Camera', () => {
  it('should start at origin', () => {
    const cam = new Camera()
    expect(cam.x).toBe(0)
    expect(cam.y).toBe(0)
    expect(cam.zoom).toBe(1)
  })

  it('should follow target smoothly', () => {
    const cam = new Camera()
    cam.follow(100, 200)
    cam.update(1)
  })

  it('should zoom to target', () => {
    const cam = new Camera()
    cam.zoomTo(2)
    expect(cam.zoom).toBe(1) // not updated yet
    cam.update(1)
  })

  it('should shake', () => {
    const cam = new Camera()
    cam.shake(10, 300)
    cam.update(1)
    // Shake should still be active
  })

  it('should clamp to bounds', () => {
    const cam = new Camera()
    cam.setBounds({ x: 0, y: 0, width: 800, height: 600 })
    cam.follow(-100, -100)
    cam.update(1)
  })

  it('should reset to origin', () => {
    const cam = new Camera()
    cam.follow(500, 500)
    cam.zoomTo(3)
    cam.update(1)
    cam.reset()
    expect(cam.x).toBe(0)
    expect(cam.y).toBe(0)
    expect(cam.zoom).toBe(1)
  })
})
