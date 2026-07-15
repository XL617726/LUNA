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
  const G = Math.floor(size / 16)
  const P = (x: number, y: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x * G, y * G, G, G) }
  const breathe = Math.sin(frame / totalFrames * Math.PI * 2) * 0.5

  // === 通用特征（三个形态共用） ===
  const hairColor = '#5c3d2e'      // 棕色头发
  const hairLight = '#7a5a4a'      // 发丝高光
  const skinColor = '#ffd5b8'      // 肤色
  const eyeDark = '#3a2010'        // 虹膜

  // 头发（棕色中长发+齐刘海）
  for (let x = 2; x <= 12; x++) for (let y = 0; y <= 3; y++) if (x >= 3 && x <= 11) P(x, y, hairColor)
  for (let y = 2; y <= 5; y++) { P(2, y, hairColor); P(12, y, hairColor) }
  P(3, 1, hairLight); P(10, 1, hairLight)

  // 脸部
  for (let x = 4; x <= 10; x++) for (let y = 3; y <= 7; y++) P(x, y, skinColor)

  // 黑框眼镜（女主播和CEO共用）
  if (form === 'live' || form === 'CEO') {
    ctx.fillStyle = '#222'; ctx.fillRect(4 * G, 5 * G, G * 2, G); ctx.fillRect(8 * G, 5 * G, G * 2, G)
    P(4, 5, '#fff'); P(5, 5, '#3a2010'); P(8, 5, '#fff'); P(9, 5, '#3a2010') // 眼睛在镜片后
  } else {
    // 眼睛
    P(5, 5, eyeDark); P(9, 5, eyeDark); P(4, 5, '#fff'); P(8, 5, '#fff')
  }

  // 腮红
  ctx.fillStyle = 'rgba(255,150,150,0.25)'; ctx.fillRect(3 * G, 6 * G, G * 2, G); ctx.fillRect(11 * G, 6 * G, G * 2, G)

  // 嘴
  if (anim === 'happy') { P(6, 7, '#e04070'); P(8, 7, '#e04070') }
  else if (anim === 'sing') { P(7, 7 + Math.round(breathe), '#cc6644') }
  else { P(7, 7, '#cc8866') }

  // === 按形态区分 ===
  if (form === 'graduation') drawGraduation()
  else if (form === 'live') drawLive()
  else if (form === 'CEO') drawCEO()

  // 阴影
  ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(4 * G, 15 * G, 8 * G, G * 0.5)

  // ===== 🎓 毕业生 =====
  function drawGraduation() {
    // 学士帽
    for (let x = 3; x <= 11; x++) P(x, 0, '#1a1a1a')
    P(9, -1, '#ffd700') // 金色帽穗

    // 黑袍身体
    for (let x = 4; x <= 10; x++) for (let y = 8; y <= 13; y++) P(x, y, '#2a2a2a')
    // 白衬衫领口
    P(5, 8, '#fff'); P(6, 8, '#fff'); P(8, 8, '#fff'); P(9, 8, '#fff')
    // 紫色领结
    P(6, 8, '#8b5cf6'); P(7, 8, '#8b5cf6'); P(8, 8, '#8b5cf6'); P(7, 9, '#7c3aed')

    // 右手高举毕业证书
    const armUpY = 6 + Math.round(Math.sin(frame / 4) * 1)
    P(11, armUpY, skinColor); P(11, armUpY + 1, skinColor); P(12, armUpY - 3, skinColor)
    // 毕业证书卷轴（红色绸带）
    P(12, armUpY - 4, '#cc3333'); P(12, armUpY - 5, '#cc3333'); P(13, armUpY - 4, '#aa2222')

    // 左手捧花束
    P(3, 9, skinColor)
    // 花束（向日葵+粉花+绿叶）
    ctx.fillStyle = '#ffd700'; ctx.fillRect(1 * G, 7 * G, G * 1.5, G * 1.5)   // 向日葵
    ctx.fillStyle = '#ff69b4'; ctx.fillRect(1 * G, 8 * G, G, G)               // 粉色花
    ctx.fillStyle = '#4a8'; ctx.fillRect(2 * G, 8 * G, G, G)                  // 绿叶
    ctx.fillStyle = '#f5deb3'; ctx.fillRect(1 * G, 9 * G, G * 3, G)           // 米色花束包装

    // 腿 + 白袜 + 黑鞋
    for (let x = 5; x <= 9; x++) P(x, 14, '#333')
    for (let x = 5; x <= 9; x++) P(x, 15, '#fff')  // 白袜
  }

  // ===== 🎤 女主播 =====
  function drawLive() {
    // 白色衬衫（荷叶领）
    for (let x = 4; x <= 10; x++) for (let y = 8; y <= 12; y++) P(x, y, '#f5f5f5')
    // 荷叶领褶皱
    P(5, 8, '#e8e8e8'); P(9, 8, '#e8e8e8')
    // 粉色领口装饰
    P(6, 8, '#ffb6c1'); P(7, 8, '#ffb6c1'); P(8, 8, '#ffb6c1')

    // 粉色电竞椅
    for (let x = 3; x <= 11; x++) for (let y = 11; y <= 13; y++) if (x < 4 || x > 10 || y > 12) P(x, y, '#ff8fa3')
    P(3, 10, '#ff8fa3'); P(11, 10, '#ff8fa3')

    // 桌上麦克风
    ctx.fillStyle = '#333'; ctx.fillRect(10 * G, 7 * G, G, G * 3)
    ctx.fillStyle = '#666'; ctx.fillRect(9 * G, 6 * G, G * 2, G * 2) // 防喷罩

    // 粉色马克杯
    P(4, 11, '#ffb6c1'); P(4, 12, '#ffb6c1')
    // 杯身爱心
    P(4, 11, '#ff4081')

    // 笔记本电脑
    ctx.fillStyle = '#444'; ctx.fillRect(8 * G, 11 * G, G * 3, G * 2)

    // 霓虹灯 "LIVE"
    ctx.fillStyle = '#ff4081'
    ctx.fillRect(2 * G, 0 * G, G * 3, G * 0.5)
    ctx.fillRect(2 * G, 0 * G, G * 0.5, G * 2)

    // 右手打招呼
    const waveY = 8 + Math.round(Math.sin(frame / 3) * 2)
    P(12, waveY, skinColor); P(12, waveY - 1, skinColor)
  }

  // ===== 💼 CEO =====
  function drawCEO() {
    // 深灰西装
    for (let x = 4; x <= 10; x++) for (let y = 8; y <= 13; y++) P(x, y, '#3a3a4a')
    // 白衬衫（敞开领口）
    P(5, 8, '#fff'); P(6, 8, '#fff'); P(8, 8, '#fff'); P(9, 8, '#fff')
    // 西装翻领
    P(5, 8, '#2a2a3a'); P(9, 8, '#2a2a3a')

    // 黑色皮椅
    for (let x = 3; x <= 11; x++) for (let y = 12; y <= 14; y++) P(x, y, '#1a1a1a')

    // 木质办公桌
    ctx.fillStyle = '#5c3a1e'; ctx.fillRect(1 * G, 11 * G, G * 4, G * 2)

    // 金色CEO名牌
    ctx.fillStyle = '#c9a04e'; ctx.fillRect(4 * G, 10 * G, G * 2, G)

    // 绿色台灯（亮着暖黄光）
    ctx.fillStyle = '#2d5a27'; ctx.fillRect(10 * G, 7 * G, G, G * 3)
    ctx.fillStyle = '#ffd700'; ctx.fillRect(10 * G, 6 * G, G, G) // 灯光

    // 奖杯
    ctx.fillStyle = '#ffd700'; ctx.fillRect(1 * G, 6 * G, G * 2, G * 2)

    // 双手交叠桌面
    for (let x = 5; x <= 9; x++) P(x, 10, skinColor)
    P(5, 9, skinColor); P(9, 9, skinColor)

    // 窗外白天城市
    ctx.fillStyle = '#87ceeb'; ctx.fillRect(10 * G, 1 * G, G * 4, G * 1.5)  // 蓝天
    ctx.fillStyle = '#aaa'; ctx.fillRect(10 * G, 2 * G, G * 2, G * 3)        // 高楼
    ctx.fillStyle = '#ccc'; ctx.fillRect(12 * G, 1 * G, G, G * 4)
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
