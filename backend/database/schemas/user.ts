/**
 * User Schema — 用户档案
 */
export interface IUser {
  _id: string
  openid: string           // 微信 openid
  nickname: string
  avatar: string
  level: number            // 1-4
  exp: number
  currentCharacter: string // 'graduation' | 'live' | 'CEO'
  stats: {
    totalPlays: number
    totalSongs: number
    interactionDays: number
    lastInteraction: Date | null
  }
  settings: {
    nightVoice: boolean
    autoPlay: boolean
  }
  createdAt: Date
  updatedAt: Date
}

export const UserSchema = {
  collection: 'users',
  indexes: [
    { key: { openid: 1 }, unique: true },
    { key: { level: 1 } },
  ],
  defaults: {
    nickname: '朋友',
    avatar: '',
    level: 1,
    exp: 0,
    currentCharacter: 'graduation',
    stats: {
      totalPlays: 0,
      totalSongs: 0,
      interactionDays: 0,
      lastInteraction: null,
    },
    settings: {
      nightVoice: true,
      autoPlay: true,
    },
  },
}

// Mongoose-compatible model factory
export function UserModel(mongoose: any) {
  const schema = new mongoose.Schema({
    openid: { type: String, required: true, unique: true },
    nickname: { type: String, default: '朋友' },
    avatar: { type: String, default: '' },
    level: { type: Number, default: 1, min: 1, max: 4 },
    exp: { type: Number, default: 0 },
    currentCharacter: { type: String, default: 'graduation', enum: ['graduation', 'live', 'CEO'] },
    stats: {
      totalPlays: { type: Number, default: 0 },
      totalSongs: { type: Number, default: 0 },
      interactionDays: { type: Number, default: 0 },
      lastInteraction: { type: Date, default: null },
    },
    settings: {
      nightVoice: { type: Boolean, default: true },
      autoPlay: { type: Boolean, default: true },
    },
  }, { timestamps: true })

  return mongoose.model('User', schema)
}
