/**
 * LUNA API — Route Definitions
 *
 * RESTful API 路由表
 * 框架无关设计 — 可对接 Express / Koa / CloudBase 云函数
 */

import type { IUser } from '../../../database/schemas/user'
import type { ISong } from '../../../database/schemas/song'
import type { IMemory } from '../../../database/schemas/memory'
import type { ICharacter } from '../../../database/schemas/character'
import type { IStory } from '../../../database/schemas/story'
import type { IGrowth } from '../../../database/schemas/growth'

// ==================== Route Handler 类型 ====================
type Handler = (req: any) => Promise<{ status: number; body: any }>

// ==================== User Routes ====================
export const userRoutes: Record<string, Record<string, Handler>> = {
  'GET /user/profile': {
    handler: async (req) => ({
      status: 200,
      body: { id: req.user?.userId, nickname: '朋友', level: 1, currentCharacter: 'graduation' } as Partial<IUser>,
    }),
  },
  'POST /user/login': {
    handler: async (req) => ({
      status: 200,
      body: { token: 'jwt-token-placeholder', user: { id: 'dev-user-001', nickname: '朋友' } },
    }),
  },
  'PATCH /user/profile': {
    handler: async (req) => ({
      status: 200,
      body: { success: true, updated: req.body },
    }),
  },
}

// ==================== Music Routes ====================
export const musicRoutes: Record<string, Record<string, Handler>> = {
  'GET /songs': {
    handler: async (req) => ({
      status: 200,
      body: { songs: [], total: 0, page: parseInt(req.query?.page) || 1 },
    }),
  },
  'POST /songs/upload': {
    handler: async (req) => ({
      status: 201,
      body: { id: `song_${Date.now()}`, url: '', message: 'Upload endpoint ready' },
    }),
  },
  'DELETE /songs/:id': {
    handler: async (req) => ({
      status: 200,
      body: { success: true, deleted: req.params?.id },
    }),
  },
  'GET /songs/history': {
    handler: async (req) => ({
      status: 200,
      body: { history: [], totalPlays: 0 },
    }),
  },
}

// ==================== Character Routes ====================
export const characterRoutes: Record<string, Record<string, Handler>> = {
  'GET /characters': {
    handler: async (_req) => ({
      status: 200,
      body: {
        characters: [{
          id: 'LUNA-001', name: 'LUNA',
          forms: [
            { id: 'graduation', name: '毕业生', theme: '那个夏天', scene: 'school', unlockLevel: 1 },
            { id: 'live', name: '女主播', theme: '第一次站上舞台', scene: 'live', unlockLevel: 2 },
            { id: 'CEO', name: 'CEO', theme: '未来的自己', scene: 'office', unlockLevel: 3 },
          ],
        }],
      },
    }),
  },
  'POST /characters/switch': {
    handler: async (req) => ({
      status: 200,
      body: { currentForm: req.body?.form || 'graduation', previousForm: 'graduation' },
    }),
  },
  'GET /characters/current': {
    handler: async (_req) => ({
      status: 200,
      body: { form: 'graduation', animation: 'idle', level: 1 },
    }),
  },
}

// ==================== Memory Routes ====================
export const memoryRoutes: Record<string, Record<string, Handler>> = {
  'GET /memories': {
    handler: async (req) => ({
      status: 200,
      body: { memories: [], total: 0 },
    }),
  },
  'POST /memories': {
    handler: async (req) => ({
      status: 201,
      body: { id: `mem_${Date.now()}`, ...req.body, createdAt: new Date().toISOString() },
    }),
  },
  'PATCH /memories/:id': {
    handler: async (req) => ({
      status: 200,
      body: { success: true, updated: req.params?.id },
    }),
  },
}

// ==================== AI Routes ====================
export const aiRoutes: Record<string, Record<string, Handler>> = {
  'POST /ai/chat': {
    handler: async (req) => ({
      status: 200,
      body: {
        reply: '我在呢 ✨ 今天想听什么歌？',
        mood: 'gentle',
        dialogueId: `dlg_${Date.now()}`,
      },
    }),
  },
  'POST /ai/dialogue': {
    handler: async (req) => ({
      status: 200,
      body: {
        scene: req.body?.scene || 'greeting',
        dialogue: '你好呀～',
        suggestions: ['播放音乐', '切换角色', '查看回忆'],
      },
    }),
  },
  'GET /ai/story': {
    handler: async (_req) => ({
      status: 200,
      body: {
        stories: [
          { id: 'first_meet', name: '初遇', unlocked: true },
          { id: 'first_song', name: '第一首歌', unlocked: false },
        ],
      },
    }),
  },
}

// ==================== Growth Routes ====================
export const growthRoutes: Record<string, Record<string, Handler>> = {
  'GET /growth/:userId': {
    handler: async (req) => ({
      status: 200,
      body: {
        userId: req.params?.userId,
        level: 1,
        exp: { music: 0, memory: 0, friendship: 0, total: 0 },
        unlocked: { actions: ['idle', 'sing'], voices: [], scenes: ['school'], stories: [] },
      } as Partial<IGrowth>,
    }),
  },
}

// ==================== 路由注册表 ====================
export const ALL_ROUTES = {
  ...userRoutes,
  ...musicRoutes,
  ...characterRoutes,
  ...memoryRoutes,
  ...aiRoutes,
  ...growthRoutes,
} as const

export type RouteKey = keyof typeof ALL_ROUTES
