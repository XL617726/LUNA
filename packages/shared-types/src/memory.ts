/** 回忆条目 */
export interface MemoryItem {
  id: string
  title: string
  content: string
  images: string[]
  audio?: string
  createdAt: string
}

/** 成长记录 */
export interface GrowthRecord {
  userId: string
  level: number
  musicExp: number
  memoryExp: number
  friendship: number
}
