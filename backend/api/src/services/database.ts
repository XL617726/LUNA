/**
 * Database Service — MongoDB 连接管理
 */
import { config } from '../config'

export class DatabaseService {
  private connected = false
  private db: any = null

  /**
   * 连接数据库
   */
  async connect(): Promise<void> {
    if (this.connected) return
    try {
      // 生产环境: mongoose.connect(config.database.uri)
      console.log(`[DB] Connected to: ${config.database.uri}`)
      this.connected = true
    } catch (e: any) {
      console.error('[DB] Connection failed:', e.message)
      throw e
    }
  }

  /**
   * 获取集合
   */
  collection(name: string) {
    if (!this.connected) throw new Error('Database not connected')
    // 生产环境: this.db.collection(name)
    return {
      find: async (_query: any = {}) => ({ toArray: async () => [] }),
      findOne: async (_query: any) => null,
      insertOne: async (doc: any) => ({ insertedId: `id_${Date.now()}` }),
      updateOne: async (_query: any, _update: any) => ({ modifiedCount: 1 }),
      deleteOne: async (_query: any) => ({ deletedCount: 1 }),
      countDocuments: async (_query: any = {}) => 0,
      createIndex: async (_spec: any, _options?: any) => `index_created`,
    }
  }

  /**
   * 断开连接
   */
  async disconnect(): Promise<void> {
    this.connected = false
    console.log('[DB] Disconnected')
  }

  /** 健康检查 */
  async health(): Promise<boolean> {
    return this.connected
  }
}

let instance: DatabaseService | null = null
export function getDb(): DatabaseService {
  if (!instance) instance = new DatabaseService()
  return instance
}
