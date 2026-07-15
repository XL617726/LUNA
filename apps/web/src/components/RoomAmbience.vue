<script setup lang="ts">
/**
 * RoomAmbience — 房间氛围动画
 * 云朵漂移、小鸟飞过、尘埃粒子，让房间感觉"活着"
 */
import { onMounted, onUnmounted } from 'vue'

let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let running = true
let clouds: Array<{ x: number; y: number; w: number; h: number; speed: number; alpha: number }> = []

onMounted(() => {
  canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:1'
  document.body.prepend(canvas)
  ctx = canvas.getContext('2d')!

  clouds = [
    { x: -100, y: 60, w: 80, h: 24, speed: 0.15, alpha: 0.08 },
    { x: 300, y: 100, w: 60, h: 18, speed: 0.1, alpha: 0.06 },
    { x: 600, y: 40, w: 100, h: 28, speed: 0.12, alpha: 0.07 },
  ]

  resize()
  window.addEventListener('resize', resize)
  loop()
})

onUnmounted(() => {
  running = false
  canvas?.remove()
})

function resize() {
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function drawCloud(c: typeof clouds[0]) {
  if (!ctx) return
  ctx.fillStyle = `rgba(255,255,255,${c.alpha})`
  ctx.beginPath()
  const cx = c.x, cy = c.y, r = c.h / 2
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.arc(cx + c.w * 0.3, cy - r * 0.4, r * 0.8, 0, Math.PI * 2)
  ctx.arc(cx + c.w * 0.6, cy, r * 0.9, 0, Math.PI * 2)
  ctx.fill()
}

function loop() {
  if (!running || !ctx || !canvas) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const c of clouds) {
    c.x += c.speed
    if (c.x > canvas.width + c.w) c.x = -c.w * 2
    drawCloud(c)
  }

  // 偶尔的尘埃粒子
  if (Math.random() < 0.05) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    ctx.fillStyle = `rgba(255,215,0,${0.03 + Math.random() * 0.05})`
    ctx.beginPath()
    ctx.arc(x, y, 1, 0, Math.PI * 2)
    ctx.fill()
  }

  requestAnimationFrame(loop)
}
</script>

<template><div /></template>
