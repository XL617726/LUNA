<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { getCharacterEngine, getSpriteLoader, getAssetResolver } from '@luna/character-engine'
import type { CharacterForm, CharacterState } from '@luna/shared-types'

const props = defineProps<{ form: CharacterForm; animation: CharacterState; size?: number }>()
const emit = defineEmits<{ ready: [] }>()
const canvasRef = ref<HTMLCanvasElement>()
const loading = ref(true)

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
  } catch { sprite = { config: { frames: 8, fps: 8 } } }
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
    render(ctx, size, props.animation, props.form, currentFrame, frames)
    currentFrame = (currentFrame + 1) % frames
  }, 1000 / fps)
}

// ===== 64×64 Pixel Character Renderer =====
function render(ctx: CanvasRenderingContext2D, size: number, anim: string, form: string, frame: number, totalFrames: number) {
  const G = size / 128
  const R = (x: number, y: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x * G, y * G, w * G, h * G) }
  const br = Math.sin(frame / totalFrames * Math.PI * 2)
  const S = '#ffdbbc'; const S2 = '#f0c4a0'; const H = '#5c3826'; const H2 = '#7a4f38'; const H3 = '#91684a'
  const E = '#1a0a05'; const E2 = '#4a3020'

  // Hair
  R(20,0,80,16,H); R(24,0,72,8,H2); R(28,2,56,2,H3)
  R(16,12,12,16,H); R(96,12,12,16,H); R(24,16,72,4,H2)
  // Face
  R(32,16,56,32,S); R(36,12,48,4,'#ffe8d0')
  // Eyes
  if(form==='live'||form==='CEO'){R(36,22,16,8,'#2a2a2a');R(72,22,16,8,'#2a2a2a');R(52,24,20,2,'#2a2a2a')}
  R(40,26,12,4,'#fff');R(76,26,12,4,'#fff');R(42,26,8,4,E2);R(78,26,8,4,E2);R(44,26,4,4,E);R(80,26,4,4,E)
  R(44,24,2,2,'#fff');R(80,24,2,2,'#fff')
  // Brows + Blush
  R(40,20,12,2,H);R(76,20,12,2,H);R(28,32,12,4,'rgba(255,150,150,0.3)');R(88,32,12,4,'rgba(255,150,150,0.3)')
  // Mouth
  if(anim==='happy'){R(56,36,16,4,'#e06070')}else if(anim==='sing'){R(56,36,16,Math.round(4+br*4),'#c05050')}else{R(56,36,12,4,'#d09080')}
  // Neck
  R(48,48,28,8,S);R(44,56,36,4,S2)

  // Form-specific
  if(form==='graduation'){
    R(24,0,72,6,'#1a1a1a');R(14,-2,32,2,'#222');R(42,-2,2,4,'#ffd700')
    R(32,56,56,40,'#2a2a2a');R(36,56,48,8,'#333');R(32,88,56,8,'#1e1e1e')
    R(52,56,20,6,'#f0f0f0');R(56,60,12,8,'#8b5cf6');R(60,64,4,4,'#7c3aed')
    const ay=32+Math.round(Math.sin(frame/4)*2);R(46,ay,4,8,S)
    R(50,ay-10,2,10,'#cc3333');R(52,ay-8,4,6,'#f5e8d0');R(52,ay-2,4,2,'#cc3333')
    R(12,60,8,16,S);R(0,52,8,8,'#ffd700');R(4,60,8,8,'#ff69b4');R(8,56,4,8,'#4a8');R(0,68,16,8,'#f5deb3');R(4,68,4,4,'#ffb6c1')
    R(36,96,16,16,'#333');R(68,96,16,16,'#333');R(36,112,16,8,'#fafafa');R(68,112,16,8,'#fafafa');R(36,120,16,4,'#1a1a1a');R(68,120,16,4,'#1a1a1a')
  } else if(form==='live'){
    R(32,56,56,28,'#f5f5f5');R(36,56,48,8,'#fafafa');R(40,56,12,6,'#ffe0e5');R(72,56,12,6,'#ffe0e5');R(44,64,36,4,'#eee')
    R(20,80,16,20,'#ff8fa3');R(88,80,16,20,'#ff8fa3');R(24,96,76,8,'#ff7093')
    R(68,68,40,4,'#8b6914');R(68,72,4,12,'#8b6914');R(96,52,8,20,'#333');R(92,48,12,8,'#666')
    R(76,80,8,12,'#ffb6c1');R(78,86,4,4,'#ff4081');R(92,76,20,12,'#444')
    R(16,8,32,8,'#ff4081');R(20,8,4,16,'#ff4081')
    const wy=56+Math.round(Math.sin(frame/3)*3);R(48,wy,4,6,S)
  } else {
    R(32,56,56,36,'#3a3a4a');R(36,56,48,8,'#444');R(32,84,56,8,'#282838')
    R(52,56,20,16,'#f5f5f5');R(52,56,20,4,'#fff');R(52,56,4,12,'#2a2a3a');R(72,56,4,12,'#2a2a3a')
    R(20,84,16,16,'#1a1a1a');R(88,84,16,16,'#1a1a1a');R(24,96,76,6,'#151515')
    R(52,76,60,6,'#5c3a1e');R(56,80,56,2,'#4a2a10');R(64,68,20,4,'#c9a04e');R(68,68,12,2,'#e8b86d')
    R(100,44,8,28,'#2d5a27');R(96,40,12,8,'#3a6a33');R(100,36,4,4,'#ffd700')
    R(52,40,8,12,'#ffd700');R(56,36,2,4,'#fff');R(76,84,8,8,'#d4c5b0');R(88,80,16,12,'#3a3a3a');R(60,72,20,8,S)
  }
  R(32,124,60,4,'rgba(0,0,0,0.1)')
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
.loading-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(15,15,35,0.5); color: #e8b86d; font-size: 28px; animation: twinkle 1.2s ease-in-out infinite; }
@keyframes twinkle { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
</style>
