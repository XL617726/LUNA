/**
 * @luna/character-engine — 角色引擎
 *
 * 负责 LUNA 的身份管理、形态切换、精灵加载。
 * 这是所有客户端的核心依赖——微信小程序、Web、桌面版都共享同一个角色定义。
 *
 * @example
 * ```ts
 * import { getCharacterEngine } from '@luna/character-engine'
 * const luna = getCharacterEngine()
 * luna.switchForm('live')        // 切换到女主播形态
 * luna.setState('sing')          // 切换到唱歌动画
 * console.log(luna.currentForm)   // 'live'
 * ```
 *
 * @packageDocumentation
 */
export { CharacterEngine, getCharacterEngine } from './CharacterEngine'
export { AssetResolver, getAssetResolver, FORM_ASSET_ROOTS, ANIMATION_FILE_MAP, DEFAULT_SPRITE_CONFIG } from './AssetResolver'
export { SpriteLoader, getSpriteLoader } from './SpriteLoader'

// Re-export shared types for convenience
export type {
  CharacterProfile, CharacterForm, CharacterState,
  CharacterOutfit, CharacterStats, CharacterUnlocks,
} from '@luna/shared-types'
