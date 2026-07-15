/**
 * LUNA Backend API — 入口
 *
 * 架构: Node.js + MongoDB + 腾讯云 COS
 * 部署: 微信云开发 CloudBase 云函数 或 独立 Node 服务器
 *
 * API 端点: 20 个 (User 3 + Music 4 + Character 3 + Memory 3 + AI 3 + Growth 1 + Health)
 */
import { config } from './config'
import { getDb } from './services/database'
import { getStorage } from '../../storage/cos'
import { ALL_ROUTES } from './routes'
import { verifyToken } from './middleware/auth'

// ==================== 应用工厂 ====================
export interface App {
  start: () => Promise<void>
  stop: () => Promise<void>
  handle: (request: Request) => Promise<Response>
}

export function createApp(): App {
  const db = getDb()
  const storage = getStorage()
  let started = false

  async function start() {
    if (started) return
    await db.connect()
    console.log(`[Backend] LUNA API v1.0 — http://localhost:${config.server.port}`)
    console.log(`[Backend] Routes: ${Object.keys(ALL_ROUTES).length} endpoints registered`)
    started = true
  }

  async function stop() {
    await db.disconnect()
    started = false
  }

  async function handle(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const method = request.method
    const routeKey = `${method} ${url.pathname}`

    // 尝试匹配路由（支持 :id 参数）
    let handler = (ALL_ROUTES as any)[routeKey]
    let params: Record<string, string> = {}

    if (!handler) {
      // 尝试参数化路由匹配
      for (const [key, h] of Object.entries(ALL_ROUTES)) {
        const [routeMethod, routePath] = key.split(' ')
        if (routeMethod !== method) continue

        const routeParts = routePath.split('/')
        const urlParts = url.pathname.split('/')
        if (routeParts.length !== urlParts.length) continue

        let matched = true
        const p: Record<string, string> = {}
        for (let i = 0; i < routeParts.length; i++) {
          if (routeParts[i].startsWith(':')) {
            p[routeParts[i].slice(1)] = urlParts[i]
          } else if (routeParts[i] !== urlParts[i]) {
            matched = false
            break
          }
        }
        if (matched) { handler = h; params = p; break }
      }
    }

    if (!handler) {
      return new Response(JSON.stringify({ error: 'Not Found', code: 404 }), { status: 404 })
    }

    try {
      // 认证（登录接口不需要）
      const isPublic = routeKey.includes('/login')
      const token = request.headers.get('Authorization')?.replace('Bearer ', '') || ''
      const user = isPublic ? null : verifyToken(token)

      const req = {
        params,
        query: Object.fromEntries(url.searchParams),
        body: method !== 'GET' ? await request.json().catch(() => ({})) : {},
        headers: Object.fromEntries(request.headers),
        user,
      }

      const result = await handler.handler(req)
      return new Response(JSON.stringify(result.body), {
        status: result.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message || 'Internal Error', code: 500 }), { status: 500 })
    }
  }

  return { start, stop, handle }
}

// ==================== 独立运行 ====================
if (require.main === module || process.env.LUNA_STANDALONE) {
  const app = createApp()
  app.start().then(() => {
    console.log('[Backend] ✅ Ready')
    console.log('')
    console.log('  API Endpoints:')
    const routes = Object.keys(ALL_ROUTES).sort()
    const byModule: Record<string, string[]> = {}
    for (const r of routes) {
      const module = r.split('/')[1] || 'root'
      if (!byModule[module]) byModule[module] = []
      byModule[module].push(r)
    }
    for (const [mod, rs] of Object.entries(byModule)) {
      console.log(`  [${mod}]`)
      for (const r of rs) console.log(`    ${r}`)
    }
  })
}

export default createApp
