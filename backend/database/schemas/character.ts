/** Character Schema — 角色定义 */
export interface ICharacter {
  _id: string
  id: string           // 'LUNA-001'
  name: string
  style: 'pixel' | 'live2d'
  forms: Array<{
    id: string         // 'graduation' | 'live' | 'CEO'
    name: string
    theme: string
    scene: string
    elements: string[]
    sprites: Record<string, string>  // animation → COS URL
    unlockLevel: number
  }>
  voices: Array<{ key: string; url: string }>
  createdAt: Date
}

export const CharacterSchema = {
  collection: 'characters',
  indexes: [{ key: { id: 1 }, unique: true }],
}
