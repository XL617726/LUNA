/** Song Schema — 歌曲 */
export interface ISong {
  _id: string
  userId: string
  title: string
  artist?: string
  duration: number       // seconds
  bpm: number
  energy: number         // 0-1
  animationMode: string  // 'sing' | 'dance' | 'happy'
  coverUrl: string       // COS URL
  storageUrl: string     // COS URL
  fileSize: number
  playCount: number
  isHidden: boolean      // 隐藏歌曲（彩蛋）
  uploadedAt: Date
  createdAt: Date
}

export const SongSchema = {
  collection: 'songs',
  indexes: [
    { key: { userId: 1 } },
    { key: { playCount: -1 } },
    { key: { uploadedAt: -1 } },
  ],
}
