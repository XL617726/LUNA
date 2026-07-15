/**
 * @luna/character-engine — 角色引擎
 *
 * 负责："她是谁"
 * - LUNA 角色档案管理
 * - 三种形态（graduation / live / CEO）切换
 * - 角色状态查询
 *
 * 不依赖任何特定平台的渲染。
 * 所有客户端（微信/Web/桌面）共享此引擎。
 */
export { CharacterEngine, getCharacterEngine } from './CharacterEngine'
export { AssetResolver, getAssetResolver, FORM_ASSET_ROOTS, ANIMATION_FILE_MAP, DEFAULT_SPRITE_CONFIG } from './AssetResolver'
export { SpriteLoader, getSpriteLoader } from './SpriteLoader'
export type { CharacterProfile, CharacterForm, CharacterState, CharacterOutfit, CharacterStats, CharacterUnlocks } from '@luna/shared-types'
