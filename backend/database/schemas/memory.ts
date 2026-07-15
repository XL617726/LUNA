/** Memory Schema — 回忆 */
export interface IMemory {
  _id: string
  userId: string
  title: string
  content: string
  type: 'first_upload' | 'favorite_song' | 'milestone' | 'special_message' | 'easter_egg'
  images: string[]       // COS URLs
  audio?: string         // COS URL
  metadata: Record<string, any>
  createdAt: Date
}

export const MemorySchema = {
  collection: 'memories',
  indexes: [
    { key: { userId: 1, type: 1 } },
    { key: { createdAt: -1 } },
  ],
}
