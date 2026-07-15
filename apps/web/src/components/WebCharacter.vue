<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { getCharacterEngine, getSpriteLoader, getAssetResolver } from '@luna/character-engine'
import type { CharacterForm, CharacterState } from '@luna/shared-types'

const props = defineProps<{ form: CharacterForm; animation: CharacterState; size?: number }>()
const emit = defineEmits<{ ready: [] }>()
const canvasRef = ref<HTMLCanvasElement>()
const loading = ref(true)
const isPlaceholder = ref(false)

let animTimer: number | null = null
let currentFrame = 0
let sprite: any = null
let loaded = false

const engine = getCharacterEngine()
const loader = getSpriteLoader()
const resolver = getAssetResolver()

async function loadSprite() {
  loading.value = true
  if (animTimer) { clearInterval(animTimer); animTimer = null }

  try {
    const resolved = resolver.resolve(props.form, props.animation)
    sprite = await loader.load(resolved)
    isPlaceholder.value = resolved.isPlaceholder
  } catch {
    isPlaceholder.value = true
    sprite = { config: { frames: 8, fps: 8 } }
  }

  loading.value = false
  if (!loaded) { loaded = true; emit('ready') }
  startAnimLoop()
}

function startAnimLoop() {
  const fps = sprite?.config?.fps || 8
  const frames = sprite?.config?.frames || 8
  currentFrame = 0

  animTimer = window.setInterval(() => {
    if (!canvasRef.value) return
    const ctx = canvasRef.value.getContext('2d')!
    const size = props.size || 300
    const dpr = window.devicePixelRatio || 1

    canvasRef.value.width = size * dpr
    canvasRef.value.height = size * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, size, size)
    ctx.imageSmoothingEnabled = false

    if (sprite?.image) {
      const frameSrc = loader.getFrameSource(sprite, currentFrame)
      ctx.drawImage(sprite.image, frameSrc.sx, frameSrc.sy, frameSrc.sw, frameSrc.sh, 0, 0, size, size)
    } else {
      drawPixelCharacter(ctx, size, props.animation, props.form, currentFrame, frames)
    }

    currentFrame = (currentFrame + 1) % frames
  }, 1000 / fps)
}

function drawPixelCharacter(
  ctx: CanvasRenderingContext2D, size: number,
  anim: string, form: string, frame: number, totalFrames: number
) {
  const G = Math.floor(size / 16) // grid cell size
  const P = (x: number, y: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x * G, y * G, G, G) }
  const adjustColor = (hex: string, amt: number): string => {
    const num = parseInt(hex.replace('#',''), 16)
    const r = Math.max(0, Math.min(255, (num >> 16) + amt))
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0xFF) + amt))
    const b = Math.max(0, Math.min(255, (num & 0xFF) + amt))
    return `#${((r<<16)|(g<<8)|b).toString(16).padStart(6,'0')}`
  }

  // Color scheme per form
  const outfits: Record<string, string> = { graduation: '#4a6fa5', live: '#e04070', CEO: '#2a2a4e' }
  const accent: Record<string, string> = { graduation: '#ffd700', live: '#ff69b4', CEO: '#c9a04e' }
  const outfit = outfits[form] || '#4a6fa5'
  const ac = accent[form] || '#ffd700'

  // Subtle idle breathing
  const breathe = Math.sin(frame / totalFrames * Math.PI * 2) * 0.5

  // Hair
  for (let x = 2; x <= 12; x++) for (let y = 0; y <= 3; y++) if (x >= 3 && x <= 11) P(x, y, '#3a2a1a')
  // Hair sides with highlight strands
  for (let y = 2; y <= 5; y++) { P(2, y, '#3a2a1a'); P(12, y, '#3a2a1a') }
  // Hair highlight strands
  P(3, 1, '#5a4a3a'); P(4, 8, '#5a4a3a'); P(10, 1, '#5a4a3a'); P(11, 8, '#5a4a3a')

  // Face
  for (let x = 4; x <= 10; x++) for (let y = 3; y <= 7; y++) P(x, y, '#ffd5b8')
  // Eyes with highlights
  if (anim !== 'bow') {
    // Iris
    P(5, 5, '#3a2010'); P(9, 5, '#3a2010')
    // Pupil
    P(5, 5, '#111'); P(9, 5, '#111')
    // Eye white
    P(4, 5, '#fff'); P(8, 5, '#fff'); P(5, 4, '#fff'); P(9, 4, '#fff')
    // Sparkle highlight
    if (anim === 'happy') { P(5, 4, '#ffd700'); P(9, 4, '#ffd700') } // golden sparkle
  } else {
    // Closed eyes for bow
    for (let x = 5; x <= 6; x++) P(x, 5, '#222')
    for (let x = 9; x <= 10; x++) P(x, 5, '#222')
  }

  // Blush
  if (anim !== 'bow') {
    ctx.fillStyle = 'rgba(255,150,150,0.3)'
    ctx.fillRect(3 * G, 6 * G, G * 2, G)
    ctx.fillRect(11 * G, 6 * G, G * 2, G)
  }

  // Mouth
  if (anim === 'happy') {
    P(6, 7, '#e04070'); P(7, 7, '#e04070'); P(8, 7, '#e04070')
  } else if (anim === 'sing') {
    P(6, 7 + Math.round(breathe), '#222')
    P(7, 7 + Math.round(breathe), '#222')
    P(8, 7 + Math.round(breathe), '#222')
  } else {
    P(7, 7, '#cc8866')
  }

  // Body with shading
  for (let x = 4; x <= 10; x++) for (let y = 8; y <= 12; y++) P(x, y, outfit)
  // Clothing shadow (darker bottom)
  for (let x = 4; x <= 10; x++) for (let y = 11; y <= 12; y++) P(x, y, adjustColor(outfit, -20))
  // Collar + button details
  P(6, 8, ac); P(7, 8, ac); P(8, 8, ac)
  // Button line
  P(7, 9, ac); P(7, 10, ac)

  // Arms with animation
  if (anim === 'sing' || anim === 'dance') {
    const armY = 8 + Math.round(Math.sin(frame / 3) * 1.5)
    P(3, armY, '#ffd5b8'); P(3, armY + 1, '#ffd5b8')
    P(11, armY, '#ffd5b8'); P(11, armY + 1, '#ffd5b8')
    // Mic in right hand for sing
    if (anim === 'sing') { P(2, armY, '#666'); P(2, armY - 1, '#888') }
  } else if (anim === 'happy') {
    P(2, 7, '#ffd5b8'); P(2, 6, '#ffd5b8') // raised arms
    P(12, 7, '#ffd5b8'); P(12, 6, '#ffd5b8')
  } else if (anim === 'bow') {
    P(3, 9, '#ffd5b8'); P(11, 9, '#ffd5b8') // hands together
  } else {
    // Idle arms at sides
    P(3, 9, '#ffd5b8'); P(3, 10, '#ffd5b8')
    P(11, 9, '#ffd5b8'); P(11, 10, '#ffd5b8')
  }

  // Legs
  for (let x = 5; x <= 9; x++) for (let y = 13; y <= 15; y++) P(x, y, '#333')

  // Form-specific accessories
  if (form === 'graduation') {
    // Graduation cap
    for (let x = 3; x <= 11; x++) P(x, 0, '#222')
    P(4, -1, '#222'); P(10, -1, '#222')
    P(9, -1, ac); // tassel
  } else if (form === 'live') {
    // Headphones
    P(2, 2, '#444'); P(3, 2, '#444'); P(11, 2, '#444'); P(12, 2, '#444')
  } else if (form === 'CEO') {
    // Glasses
    P(5, 5, 'transparent'); P(9, 5, 'transparent')
    ctx.fillStyle = '#888'; ctx.fillRect(4 * G, 5 * G, G * 2, G); ctx.fillRect(8 * G, 5 * G, G * 2, G)
    // Tie
    for (let x = 6; x <= 8; x++) P(x, 8, '#c03030')
    P(7, 9, '#c03030'); P(7, 10, '#c03030')
  }

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.15)'
  ctx.fillRect(4 * G, 15 * G, 8 * G, G * 0.5)
}

watch(() => [props.form, props.animation], () => loadSprite())
onMounted(() => loadSprite())
onUnmounted(() => { if (animTimer) clearInterval(animTimer) })
</script>

<template>
  <div class="web-character" :style="{ width: (size || 300) + 'px', height: (size || 300) + 'px' }">
    <canvas ref="canvasRef" class="char-canvas" />
    <div v-if="loading" class="loading-overlay">✦</div>
  </div>
</template>

<style scoped>
.web-character { position: relative; display: flex; align-items: center; justify-content: center; }
.char-canvas { width: 100%; height: 100%; image-rendering: pixelated; image-rendering: crisp-edges; }
.loading-overlay {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  background: rgba(15,15,35,0.5); color: #e8b86d; font-size: 28px;
  animation: twinkle 1.2s ease-in-out infinite;
}
@keyframes twinkle { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
</style>
