import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  base: '/LUNA/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@luna/shared-types': resolve(__dirname, '../../packages/shared-types/src'),
      '@luna/character-engine': resolve(__dirname, '../../packages/character-engine/src'),
      '@luna/animation-engine': resolve(__dirname, '../../packages/animation-engine/src'),
      '@luna/audio-engine': resolve(__dirname, '../../packages/audio-engine/src'),
      '@luna/ai-engine': resolve(__dirname, '../../packages/ai-engine/src'),
      '@luna/story-engine': resolve(__dirname, '../../packages/story-engine/src'),
      '@luna/ui-system': resolve(__dirname, '../../packages/ui-system/src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
