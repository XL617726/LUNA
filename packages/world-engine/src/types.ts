/** 场景定义 */
export interface Scene {
  id: string
  name: string
  background: string      // CSS gradient or image URL
  objects: SceneObject[]
  ambientSound?: string
  lighting: 'day' | 'sunset' | 'night' | 'warm'
}

/** 场景中的互动对象 */
export interface SceneObject {
  id: string
  type: 'mic' | 'window' | 'plant' | 'wardrobe' | 'desk' | 'trophy' | 'photo' | 'speaker'
  position: { x: number; y: number }
  interactable: boolean
  animation?: string
  onClick?: string        // 事件名
}

/** 天气状态 */
export interface WeatherState {
  type: 'clear' | 'rain' | 'snow' | 'starfall'
  intensity: number       // 0-1
  particles: boolean
}

/** 时间状态 */
export interface TimeState {
  hour: number            // 0-23
  minute: number
  period: 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night'
  isNightTime: boolean
}

/** 世界事件 */
export interface WorldEvent {
  id: string
  type: 'interact' | 'time_change' | 'weather_change' | 'enter_scene' | 'leave_scene' | 'special'
  target?: string
  data?: Record<string, unknown>
  timestamp: number
}
