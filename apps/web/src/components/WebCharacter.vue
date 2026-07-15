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

    if (sprite?.image && !sprite.isPlaceholder) {
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
  const G = Math.floor(size / 64) // 64x64 ultra-high-res pixel grid
  const P = (x: number, y: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x * G, y * G, G, G) }
  const PR = (x: number, y: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x * G, y * G, w * G, h * G) }
  const breathe = Math.sin(frame / totalFrames * Math.PI * 2)
  const S=G // alias for single pixel unit

  // === Colors ===
  const SK='#ffdbbc',SK2='#f0c4a0',SK3='#ffe8d0' // skin tones
  const HR='#5c3826',HR2='#7a4f38',HR3='#91684a' // hair
  const EY='#1a0a05',EY2='#4a3020' // eyes
  const BL='rgba(255,150,150,0.35)' // blush

  // === Common: Hair (detailed) ===
  PR(10,0,40,8,HR)      // hair base
  PR(12,0,36,4,HR2)     // top highlight
  PR(14,1,28,1,HR3)     // shine streak
  PR(8,6,6,8,HR)        // left strands
  PR(48,6,6,8,HR)       // right strands
  PR(12,8,36,2,HR2)     // bangs
  PR(14,10,32,1,HR)     // bangs shadow

  // === Common: Face ===
  PR(16,8,28,16,SK)     // face base
  PR(18,6,24,2,SK3)     // forehead highlight
  PR(28,10,8,1,SK2)     // nose bridge
  PR(30,14,4,2,SK2)     // nose
  PR(14,22,32,2,SK)     // chin

  // === Common: Eyes ===
  if(form==='live'||form==='CEO'){
    PR(18,11,8,4,'#2a2a2a')  // left glass frame
    PR(36,11,8,4,'#2a2a2a')  // right glass frame
    PR(26,12,10,1,'#2a2a2a') // bridge
  }
  PR(20,13,6,2,'#fff')   // left eye white
  PR(38,13,6,2,'#fff')   // right eye white
  PR(21,13,4,2,EY2)      // left iris
  PR(39,13,4,2,EY2)      // right iris
  PR(22,13,2,2,EY)       // left pupil
  PR(40,13,2,2,EY)       // right pupil
  PR(22,12,1,1,'#fff')   // left sparkle
  PR(40,12,1,1,'#fff')   // right sparkle

  // === Common: Eyebrows, Blush, Mouth ===
  PR(20,10,6,1,HR); PR(38,10,6,1,HR) // brows
  PR(14,16,6,2,BL); PR(44,16,6,2,BL) // blush
  if(anim==='happy'){PR(28,18,8,2,'#e06070');PR(30,20,4,1,'#c04050')}
  else if(anim==='sing'){PR(28,18,8,Math.round(1+breathe*2),'#c05050')}
  else{PR(28,18,6,2,'#d09080')}

  // === Common: Neck ===
  PR(24,24,14,4,SK); PR(22,28,18,2,SK2)

  // === Form-specific rendering ===
  if(form==='graduation')drawGrad()
  else if(form==='live')drawLive()
  else drawCEO()

  // Ground shadow
  PR(16,62,30,2,'rgba(0,0,0,0.1)')

  // ======= 🎓 GRADUATION =======
  function drawGrad(){
    // Cap
    PR(12,0,36,3,'#1a1a1a'); PR(14,-2,32,2,'#222')
    PR(42,-2,2,4,'#ffd700') // tassel
    PR(40,-3,1,2,'#ffd700') // tassel tip
    // Gown body
    PR(16,28,28,20,'#2a2a2a')
    PR(18,28,24,4,'#333')   // shoulders
    PR(16,44,28,4,'#1e1e1e') // hem shadow
    // Shirt + bow tie
    PR(26,28,10,3,'#f0f0f0') // collar
    PR(28,30,6,4,'#8b5cf6')  // purple bow
    PR(30,32,2,2,'#7c3aed')  // bow center
    // Right arm + diploma
    const ay=16+Math.round(Math.sin(frame/4)*2)
    PR(46,ay,4,8,SK)
    PR(50,ay-10,2,10,'#cc3333')  // red ribbon
    PR(52,ay-8,4,6,'#f5e8d0')   // scroll
    PR(52,ay-2,4,2,'#cc3333')   // red seal
    // Left arm + bouquet
    PR(6,30,4,8,SK)
    PR(0,26,4,4,'#ffd700')    // sunflower
    PR(2,30,4,4,'#ff69b4')    // pink flower
    PR(4,28,2,4,'#4a8')       // leaves
    PR(0,34,8,4,'#f5deb3')    // wrapper
    PR(2,34,2,2,'#ffb6c1')    // pink bow
    // Legs + socks + shoes
    PR(18,48,8,8,'#333'); PR(34,48,8,8,'#333')
    PR(18,56,8,4,'#fafafa'); PR(34,56,8,4,'#fafafa')
    PR(18,60,8,2,'#1a1a1a'); PR(34,60,8,2,'#1a1a1a')
    // Background: campus
    PR(0,4,8,6,'#87ceeb66') // sky
    PR(52,8,6,14,'#8899aa') // bell tower
    PR(2,58,12,4,'#c4a882') // brick path
  }

  // ======= 🎤 LIVE STREAMER =======
  function drawLive(){
    // White blouse
    PR(16,28,28,14,'#f5f5f5')
    PR(18,28,24,4,'#fafafa')   // collar highlight
    PR(20,28,6,3,'#ffe0e5')    // pink accent L
    PR(36,28,6,3,'#ffe0e5')    // pink accent R
    PR(22,32,18,2,'#eee')      // frill
    // Pink gaming chair
    PR(10,40,8,10,'#ff8fa3'); PR(44,40,8,10,'#ff8fa3')
    PR(12,48,38,4,'#ff7093')   // seat
    // Desk
    PR(34,34,20,2,'#8b6914')
    PR(34,36,2,6,'#8b6914')
    // Mic on desk
    PR(48,26,4,10,'#333')     // stand
    PR(46,24,6,4,'#666')      // pop filter
    // Pink mug + laptop
    PR(38,40,4,6,'#ffb6c1'); PR(39,43,2,2,'#ff4081')
    PR(46,38,10,6,'#444')
    // Neon "LIVE" sign
    PR(8,4,16,4,'#ff4081')    // glow
    PR(10,4,2,8,'#ff4081')    // L
    // Wave hand
    const wy=28+Math.round(Math.sin(frame/3)*3)
    PR(48,wy,4,6,SK)
    // Chat bubble
    PR(2,50,22,6,'rgba(255,255,255,0.08)')
    // Night window
    PR(52,6,10,8,'#1a1a3e')
    PR(54,8,2,3,'#ffd700')    // star
    PR(52,12,12,4,'#333')     // city
  }

  // ======= 💼 CEO =======
  function drawCEO(){
    // Dark suit
    PR(16,28,28,18,'#3a3a4a')
    PR(18,28,24,4,'#444')     // shoulders
    PR(16,42,28,4,'#282838')  // hem shadow
    // White shirt (open)
    PR(26,28,10,8,'#f5f5f5')
    PR(26,28,10,2,'#fff')     // collar top
    PR(26,28,2,6,'#2a2a3a')   // left lapel
    PR(36,28,2,6,'#2a2a3a')   // right lapel
    // Leather chair
    PR(10,42,8,8,'#1a1a1a'); PR(44,42,8,8,'#1a1a1a')
    PR(12,48,38,3,'#151515')
    // Wooden desk
    PR(26,38,30,3,'#5c3a1e')
    PR(28,40,28,1,'#4a2a10')
    // CEO nameplate
    PR(32,34,10,2,'#c9a04e')
    PR(34,34,6,1,'#e8b86d')
    // Green lamp
    PR(50,22,4,14,'#2d5a27')
    PR(48,20,6,4,'#3a6a33')
    PR(50,18,2,2,'#ffd700')   // glow
    // Trophy
    PR(26,20,4,6,'#ffd700'); PR(28,18,1,2,'#fff')
    // Coffee cup
    PR(38,42,4,4,'#d4c5b0'); PR(40,44,1,1,'#8b6914')
    // Laptop
    PR(44,40,8,6,'#3a3a3a')
    // Folded hands
    PR(30,36,10,4,SK)
    // Daytime city window
    PR(52,4,10,6,'#87ceeb')
    PR(52,6,2,2,'#fff')       // cloud
    PR(54,4,4,10,'#aaa')      // building
  }
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
