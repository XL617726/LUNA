/** Story Schema — 剧情/彩蛋 */
export interface IStory {
  _id: string
  id: string             // 'first_meet' | 'first_song' | ...
  chapter: number
  title: string
  description: string
  trigger: string        // 'firstLaunch' | 'firstUpload' | 'consecutivePlays' | 'birthday' | 'nightTime'
  unlockCondition: Record<string, any>
  dialogues: string[]
  reward?: {
    type: string         // 'song' | 'voice' | 'action' | 'scene'
    id: string
  }
  createdAt: Date
}

export const StorySchema = {
  collection: 'stories',
  indexes: [{ key: { id: 1 }, unique: true }],
}
