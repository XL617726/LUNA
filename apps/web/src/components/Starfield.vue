<script setup lang="ts">
/** 星光粒子背景 — Web 版 */
import { onMounted, onUnmounted } from 'vue'

let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let running = true
let stars: Array<{ x: number; y: number; r: number; alpha: number; speed: number; twinkle: number }> = []

function init() {
  canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0'
  document.body.prepend(canvas)
  ctx = canvas.getContext('2d')!
  resize()
  window.addEventListener('resize', resize)
  stars = Array.from({ length: 50 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 0.5 + Math.random() * 2,
    alpha: 0.2 + Math.random() * 0.6,
    speed: 0.1 + Math.random() * 0.3,
    twinkle: Math.random() * Math.PI * 2,
  }))
  loop()
}

function resize() {
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function loop() {
  if (!running || !ctx || !canvas) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const s of stars) {
    s.y -= s.speed
    s.twinkle += 0.02
    if (s.y < -5) { s.y = canvas.height + 5; s.x = Math.random() * canvas.width }
    const alpha = s.alpha * (0.5 + 0.5 * Math.sin(s.twinkle))
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,215,0,${alpha})`
    ctx.shadowColor = '#ffd700'
    ctx.shadowBlur = s.r * 4
    ctx.fill()
    ctx.shadowBlur = 0
  }
  requestAnimationFrame(loop)
}

onMounted(() => init())
onUnmounted(() => { running = false; canvas?.remove() })
</script>

<template><div /></template>
