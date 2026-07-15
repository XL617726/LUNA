/** Growth Schema — 成长记录 */
export interface IGrowth {
  _id: string
  userId: string
  level: number          // 1-4
  exp: {
    music: number
    memory: number
    friendship: number
    total: number
  }
  unlocked: {
    actions: string[]
    voices: string[]
    scenes: string[]
    stories: string[]
  }
  milestones: Array<{
    type: string
    achievedAt: Date
    description: string
  }>
  updatedAt: Date
}

export const GrowthSchema = {
  collection: 'growth',
  indexes: [
    { key: { userId: 1 }, unique: true },
    { key: { level: 1 } },
  ],
}
