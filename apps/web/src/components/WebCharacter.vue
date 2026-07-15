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
  const G = size / 64
  const R = (x: number, y: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x * G, y * G, w * G, h * G) }
  const br = Math.sin(frame / totalFrames * Math.PI * 2)
  const S = '#ffdbbc'; const S2 = '#f0c4a0'; const H = '#5c3826'; const H2 = '#7a4f38'; const H3 = '#91684a'
  const E = '#1a0a05'; const E2 = '#4a3020'

  // Hair
  R(10,0,40,8,H); R(12,0,36,4,H2); R(14,1,28,1,H3)
  R(8,6,6,8,H); R(48,6,6,8,H); R(12,8,36,2,H2)
  // Face
  R(16,8,28,16,S); R(18,6,24,2,'#ffe8d0')
  // Eyes
  if(form==='live'||form==='CEO'){R(18,11,8,4,'#2a2a2a');R(36,11,8,4,'#2a2a2a');R(26,12,10,1,'#2a2a2a')}
  R(20,13,6,2,'#fff');R(38,13,6,2,'#fff');R(21,13,4,2,E2);R(39,13,4,2,E2);R(22,13,2,2,E);R(40,13,2,2,E)
  R(22,12,1,1,'#fff');R(40,12,1,1,'#fff')
  // Brows + Blush
  R(20,10,6,1,H);R(38,10,6,1,H);R(14,16,6,2,'rgba(255,150,150,0.3)');R(44,16,6,2,'rgba(255,150,150,0.3)')
  // Mouth
  if(anim==='happy'){R(28,18,8,2,'#e06070')}else if(anim==='sing'){R(28,18,8,Math.round(1+br*2),'#c05050')}else{R(28,18,6,2,'#d09080')}
  // Neck
  R(24,24,14,4,S);R(22,28,18,2,S2)

  // Form-specific
  if(form==='graduation'){
    R(12,0,36,3,'#1a1a1a');R(14,-2,32,2,'#222');R(42,-2,2,4,'#ffd700')
    R(16,28,28,20,'#2a2a2a');R(18,28,24,4,'#333');R(16,44,28,4,'#1e1e1e')
    R(26,28,10,3,'#f0f0f0');R(28,30,6,4,'#8b5cf6');R(30,32,2,2,'#7c3aed')
    const ay=16+Math.round(Math.sin(frame/4)*2);R(46,ay,4,8,S)
    R(50,ay-10,2,10,'#cc3333');R(52,ay-8,4,6,'#f5e8d0');R(52,ay-2,4,2,'#cc3333')
    R(6,30,4,8,S);R(0,26,4,4,'#ffd700');R(2,30,4,4,'#ff69b4');R(4,28,2,4,'#4a8');R(0,34,8,4,'#f5deb3');R(2,34,2,2,'#ffb6c1')
    R(18,48,8,8,'#333');R(34,48,8,8,'#333');R(18,56,8,4,'#fafafa');R(34,56,8,4,'#fafafa');R(18,60,8,2,'#1a1a1a');R(34,60,8,2,'#1a1a1a')
  } else if(form==='live'){
    R(16,28,28,14,'#f5f5f5');R(18,28,24,4,'#fafafa');R(20,28,6,3,'#ffe0e5');R(36,28,6,3,'#ffe0e5');R(22,32,18,2,'#eee')
    R(10,40,8,10,'#ff8fa3');R(44,40,8,10,'#ff8fa3');R(12,48,38,4,'#ff7093')
    R(34,34,20,2,'#8b6914');R(34,36,2,6,'#8b6914');R(48,26,4,10,'#333');R(46,24,6,4,'#666')
    R(38,40,4,6,'#ffb6c1');R(39,43,2,2,'#ff4081');R(46,38,10,6,'#444')
    R(8,4,16,4,'#ff4081');R(10,4,2,8,'#ff4081')
    const wy=28+Math.round(Math.sin(frame/3)*3);R(48,wy,4,6,S)
  } else {
    R(16,28,28,18,'#3a3a4a');R(18,28,24,4,'#444');R(16,42,28,4,'#282838')
    R(26,28,10,8,'#f5f5f5');R(26,28,10,2,'#fff');R(26,28,2,6,'#2a2a3a');R(36,28,2,6,'#2a2a3a')
    R(10,42,8,8,'#1a1a1a');R(44,42,8,8,'#1a1a1a');R(12,48,38,3,'#151515')
    R(26,38,30,3,'#5c3a1e');R(28,40,28,1,'#4a2a10');R(32,34,10,2,'#c9a04e');R(34,34,6,1,'#e8b86d')
    R(50,22,4,14,'#2d5a27');R(48,20,6,4,'#3a6a33');R(50,18,2,2,'#ffd700')
    R(26,20,4,6,'#ffd700');R(28,18,1,2,'#fff');R(38,42,4,4,'#d4c5b0');R(44,40,8,6,'#3a3a3a');R(30,36,10,4,S)
  }
  R(16,62,30,2,'rgba(0,0,0,0.1)')
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
