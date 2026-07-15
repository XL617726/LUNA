/**
 * @luna/ui-system — 跨平台 UI 组件库
 *
 * 所有客户端（微信/Web/桌面）共享的像素风格 UI 组件。
 * 使用 CSS Custom Properties 实现主题切换。
 *
 * 组件清单:
 *   Base:    Button, Card, Dialog, Progress, Badge, Input, Icon, Navbar, Toast
 *   Composite: CharacterCard, MusicControls
 *   Hooks:   useTheme
 */

// === Design Tokens ===
export { theme, colors, spacing, fonts } from './theme'

// === Composables ===
export { useTheme } from './composables/useTheme'
export type { ThemeState } from './composables/useTheme'

// === Base Components ===
export { default as LunaButton } from './components/LunaButton.vue'
export { default as LunaCard } from './components/LunaCard.vue'
export { default as LunaDialog } from './components/LunaDialog.vue'
export { default as LunaProgress } from './components/LunaProgress.vue'
export { default as LunaBadge } from './components/LunaBadge.vue'
export { default as LunaInput } from './components/LunaInput.vue'
export { default as LunaIcon } from './components/LunaIcon.vue'
export { default as LunaNavbar } from './components/LunaNavbar.vue'
export { default as LunaToast } from './components/LunaToast.vue'
export type { IconName } from './components/LunaIcon.vue'

// === Composite Components ===
export { default as LunaCharacterCard } from './components/LunaCharacterCard.vue'
export { default as LunaMusicControls } from './components/LunaMusicControls.vue'
