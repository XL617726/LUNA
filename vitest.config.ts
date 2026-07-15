import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@luna/shared-types': resolve(__dirname, 'packages/shared-types/src'),
      '@luna/character-engine': resolve(__dirname, 'packages/character-engine/src'),
      '@luna/animation-engine': resolve(__dirname, 'packages/animation-engine/src'),
      '@luna/audio-engine': resolve(__dirname, 'packages/audio-engine/src'),
      '@luna/ai-engine': resolve(__dirname, 'packages/ai-engine/src'),
      '@luna/story-engine': resolve(__dirname, 'packages/story-engine/src'),
      '@luna/world-engine': resolve(__dirname, 'packages/world-engine/src'),
    },
  },
})
