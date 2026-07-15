/** 深色星空主题变量 — 所有平台共享 */

export const colors = {
  bgPrimary: '#0f0f23',
  bgSecondary: '#1a1a2e',
  bgCard: '#16213e',
  accent: '#e8b86d',
  accentLight: '#f5d89a',
  accentDark: '#c9a04e',
  star: '#ffd700',
  lunaPink: '#ffb6c1',
  graduation: '#4a6fa5',
  live: '#e04070',
  ceo: '#c9a04e',
  textPrimary: '#f0e6d3',
  textSecondary: '#a0a0b8',
  textMuted: '#6a6a7e',
  success: '#7ecb76',
  warning: '#f0c060',
  error: '#e06060',
} as const

export const spacing = {
  xs: 8, sm: 16, md: 24, lg: 32, xl: 48,
} as const

export const fonts = {
  pixel: "'Courier New', monospace",
  body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
} as const

export const theme = { colors, spacing, fonts }
