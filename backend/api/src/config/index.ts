/**
 * LUNA Backend — 配置中心
 */
export const config = {
  server: {
    port: parseInt(process.env.PORT || '3001'),
    env: process.env.NODE_ENV || 'development',
  },

  database: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/luna',
    name: 'luna',
    poolSize: 10,
  },

  cos: {
    secretId: process.env.COS_SECRET_ID || '',
    secretKey: process.env.COS_SECRET_KEY || '',
    bucket: process.env.COS_BUCKET || 'luna-assets-1234567890',
    region: process.env.COS_REGION || 'ap-guangzhou',
    baseUrl: process.env.COS_BASE_URL || 'https://luna-assets.cos.ap-guangzhou.myqcloud.com',
    paths: {
      characters: 'characters/',
      sprites: 'sprites/',
      music: 'music/',
      backgrounds: 'backgrounds/',
      effects: 'effects/',
    },
  },

  cloudbase: {
    envId: process.env.TCB_ENV_ID || '',
    secretId: process.env.TCB_SECRET_ID || '',
    secretKey: process.env.TCB_SECRET_KEY || '',
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET || 'luna-dev-secret-change-in-production',
    tokenExpiry: '7d',
  },

  ai: {
    apiKey: process.env.AI_API_KEY || '',
    model: process.env.AI_MODEL || 'claude-sonnet-5',
    maxTokens: 256,
  },
} as const

export type Config = typeof config
