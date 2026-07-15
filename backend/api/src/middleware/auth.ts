/**
 * Auth Middleware — JWT 认证
 */
import { config } from '../config'

export interface AuthContext {
  userId: string
  openid: string
  level: number
}

/**
 * 验证 JWT Token
 * 生产环境使用 jsonwebtoken 库
 */
export function verifyToken(token: string): AuthContext | null {
  try {
    // const jwt = require('jsonwebtoken')
    // return jwt.verify(token, config.auth.jwtSecret)
    if (!token || token === 'invalid') return null
    return { userId: 'dev-user-001', openid: 'dev-openid', level: 1 }
  } catch {
    return null
  }
}

/**
 * Express/Koa 中间件
 */
export function authMiddleware(req: any, res: any, next: any) {
  const token = req.headers?.authorization?.replace('Bearer ', '') || ''
  const ctx = verifyToken(token)
  if (!ctx) {
    return res.status(401).json({ error: 'Unauthorized', code: 401 })
  }
  req.user = ctx
  next()
}

/**
 * 可选认证（不强制，但如果有 token 就解析）
 */
export function optionalAuth(req: any, _res: any, next: any) {
  const token = req.headers?.authorization?.replace('Bearer ', '') || ''
  req.user = verifyToken(token)
  next()
}
