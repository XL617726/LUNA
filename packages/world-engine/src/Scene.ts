/**
 * SceneManager — 场景管理器
 * 管理 LUNA 的三个世界场景：校园 / 直播间 / 办公室
 */
import type { Scene, SceneObject } from './types'

const SCENES: Record<string, Scene> = {
  school: {
    id: 'school', name: '校园', lighting: 'day',
    background: 'linear-gradient(180deg, #87ceeb44, #1a3a5c88, #0f0f23)',
    objects: [
      { id: 'window_school', type: 'window', position: { x: 0.8, y: 0.1 }, interactable: true },
      { id: 'plant', type: 'plant', position: { x: 0.1, y: 0.7 }, interactable: true },
      { id: 'desk_books', type: 'desk', position: { x: 0.75, y: 0.8 }, interactable: true },
    ],
  },
  live: {
    id: 'live', name: '直播间', lighting: 'night',
    background: 'linear-gradient(180deg, #2a1a3a, #4a1a3a, #0f0f23)',
    objects: [
      { id: 'mic_live', type: 'mic', position: { x: 0.2, y: 0.15 }, interactable: true, onClick: 'sing' },
      { id: 'ringlight', type: 'speaker', position: { x: 0.8, y: 0.12 }, interactable: false },
      { id: 'monitor', type: 'desk', position: { x: 0.15, y: 0.75 }, interactable: true },
    ],
  },
  office: {
    id: 'office', name: '办公室', lighting: 'night',
    background: 'linear-gradient(180deg, #1a1a3a, #1a2a4a, #0f0f23)',
    objects: [
      { id: 'window_city', type: 'window', position: { x: 0.8, y: 0.08 }, interactable: true },
      { id: 'trophy', type: 'trophy', position: { x: 0.7, y: 0.75 }, interactable: true, onClick: 'memory' },
      { id: 'desk_docs', type: 'desk', position: { x: 0.2, y: 0.8 }, interactable: true },
    ],
  },
}

export class SceneManager {
  private _current: Scene = SCENES.school
  private _onChange: Array<(scene: Scene) => void> = []

  get current(): Scene { return this._current }

  setScene(id: string): boolean {
    const scene = SCENES[id]
    if (!scene) return false
    this._current = scene
    this._onChange.forEach(fn => fn(scene))
    return true
  }

  getObject(id: string): SceneObject | undefined {
    return this._current.objects.find(o => o.id === id)
  }

  getInteractables(): SceneObject[] {
    return this._current.objects.filter(o => o.interactable)
  }

  onChange(fn: (scene: Scene) => void) { this._onChange.push(fn) }

  getAllScenes(): Scene[] { return Object.values(SCENES) }
}
