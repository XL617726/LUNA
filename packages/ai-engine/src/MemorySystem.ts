/**
 * LUNA · 星光歌姬 — 记忆系统
 *
 * 记录用户的行为和重要时刻：
 * - 第一次上传歌曲
 * - 常听歌曲
 * - 生日
 * - 特别留言
 *
 * 记忆驱动 LUNA 的个性化回应。
 */

// Inline storage — replace with @luna/shared-utils in future Sprint
const _store: Record<string, any> = {}
function getStorage(key: string, def: any = null) { return _store[key] ?? def }
function setStorage(key: string, val: any) { _store[key] = val; return true }
const StorageKeys = { BIRTHDAY: 'luna_birthday' }

/**
 * 记忆条目类型
 */
export const MemoryType = Object.freeze({
  FIRST_UPLOAD: 'first_upload',     // 首次上传
  FAVORITE_SONG: 'favorite_song',   // 常听歌曲
  BIRTHDAY: 'birthday',             // 生日
  SPECIAL_MESSAGE: 'special_message', // 特别留言
  MILESTONE: 'milestone',           // 里程碑
  EASTER_EGG: 'easter_egg',         // 彩蛋发现
})

/**
 * 记忆系统
 */
export class MemorySystem {
  constructor() {
    this._memories = []
    this._loaded = false
  }

  /** 初始化：从本地存储加载记忆 */
  init() {
    if (this._loaded) return
    this._memories = getStorage('luna_memories', [])
    this._loaded = true
  }

  /**
   * 添加一条记忆
   * @param {string} type - MemoryType
   * @param {Object} data - 记忆数据
   */
  add(type, data = {}) {
    const memory = {
      id: `mem_${Date.now()}`,
      type,
      data,
      timestamp: new Date().toISOString(),
    }

    this._memories.push(memory)

    // 持久化
    setStorage('luna_memories', this._memories)

    console.log(`[Memory] 新记忆: ${type}`, data)
    return memory
  }

  /**
   * 查询记忆
   * @param {string} type - 按类型筛选（可选）
   * @param {number} limit - 返回数量
   */
  recall(type = null, limit = 20) {
    let results = this._memories
    if (type) {
      results = results.filter(m => m.type === type)
    }
    return results.slice(-limit)
  }

  /**
   * 检查特定类型的记忆是否存在
   */
  hasMemory(type) {
    return this._memories.some(m => m.type === type)
  }

  /**
   * 获取重要里程碑记忆
   */
  getMilestones() {
    return this._memories.filter(m =>
      m.type === MemoryType.MILESTONE ||
      m.type === MemoryType.FIRST_UPLOAD ||
      m.type === MemoryType.BIRTHDAY
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  }

  /**
   * 记录首次上传歌曲
   */
  recordFirstUpload(songName) {
    if (this.hasMemory(MemoryType.FIRST_UPLOAD)) return null
    return this.add(MemoryType.FIRST_UPLOAD, {
      songName,
      message: '第一次分享歌曲给 LUNA',
    })
  }

  /**
   * 记录常听歌曲
   * @param {string} songName
   * @param {number} playCount
   */
  recordFavorite(songName, playCount) {
    // 更新或创建常听歌曲记录
    const existing = this._memories.find(m =>
      m.type === MemoryType.FAVORITE_SONG && m.data.songName === songName
    )
    if (existing) {
      existing.data.playCount = playCount
      setStorage('luna_memories', this._memories)
      return existing
    }
    return this.add(MemoryType.FAVORITE_SONG, { songName, playCount })
  }

  /**
   * 记录生日
   * @param {string} date - MM-DD 格式
   */
  setBirthday(date) {
    setStorage(StorageKeys.BIRTHDAY, date)
    return this.add(MemoryType.BIRTHDAY, { date })
  }

  /**
   * 检查今天是否是生日
   */
  isTodayBirthday() {
    const birthday = getStorage(StorageKeys.BIRTHDAY)
    if (!birthday) return false
    const today = new Date()
    const mmdd = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    return birthday === mmdd
  }

  /**
   * 添加特别留言
   */
  addSpecialMessage(content, author = '朋友') {
    return this.add(MemoryType.SPECIAL_MESSAGE, { content, author })
  }

  /**
   * 获取所有特别留言
   */
  getSpecialMessages() {
    return this._memories
      .filter(m => m.type === MemoryType.SPECIAL_MESSAGE)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  /**
   * 获取记忆总数
   */
  get count() {
    return this._memories.length
  }
}

/** 单例 */
let instance = null
export function getMemorySystem() {
  if (!instance) {
    instance = new MemorySystem()
    instance.init()
  }
  return instance
}

export default MemorySystem
