/**
 * useTheme — 主题切换 composable
 */
import { reactive } from 'vue'

export interface ThemeState {
  mode: 'dark' | 'light'
  accentColor: string
  pixelMode: boolean
}

const state = reactive<ThemeState>({
  mode: 'dark',
  accentColor: '#e8b86d',
  pixelMode: true,
})

export function useTheme() {
  function setMode(mode: 'dark' | 'light') {
    state.mode = mode
    document.documentElement.setAttribute('data-theme', mode)
  }

  function setAccent(color: string) {
    state.accentColor = color
    document.documentElement.style.setProperty('--luna-accent', color)
  }

  function togglePixelMode() {
    state.pixelMode = !state.pixelMode
  }

  return { state, setMode, setAccent, togglePixelMode }
}
