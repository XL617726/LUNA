/**
 * Playwright E2E — LUNA 核心流程测试
 *
 * 模拟完整用户流程：
 *   打开 LUNA → 看到角色 → 点击唱歌 → 切换形态 → 查看回忆
 */
import { test, expect } from '@playwright/test'

test.describe('LUNA Web App', () => {
  test('should load homepage and show LUNA', async ({ page }) => {
    await page.goto('http://localhost:3000')
    // 页面标题
    await expect(page).toHaveTitle(/LUNA/)
    // 角色渲染 Canvas
    const canvas = page.locator('canvas').first()
    await expect(canvas).toBeVisible()
  })

  test('should show first-meet dialogue', async ({ page }) => {
    await page.goto('http://localhost:3000')
    // 首次启动应显示问候语
    const dialogue = page.locator('.dialogue-bubble')
    await expect(dialogue).toBeVisible({ timeout: 5000 })
  })

  test('should navigate to character page', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.click('text=换装')
    await expect(page.locator('text=角色衣柜')).toBeVisible()
  })

  test('should navigate to music page', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.click('text=歌曲')
    await expect(page.locator('text=音乐中心')).toBeVisible()
    // Demo 歌曲应存在
    await expect(page.locator('text=夏天的风')).toBeVisible()
  })

  test('should play a demo song', async ({ page }) => {
    await page.goto('http://localhost:3000/music')
    await page.click('.song-row:first-child')
    // 播放器应出现
    await expect(page.locator('.player-bar')).toBeVisible({ timeout: 3000 })
  })

  test('should switch character forms', async ({ page }) => {
    await page.goto('http://localhost:3000/character')
    await page.click('text=女主播')
    // 切换后应高亮
    await expect(page.locator('.card.active')).toBeVisible()
  })

  test('should show easter egg on star click', async ({ page }) => {
    await page.goto('http://localhost:3000')
    // 监听 dialog
    page.on('dialog', dialog => dialog.accept())
    await page.click('.easter-star')
  })
})
