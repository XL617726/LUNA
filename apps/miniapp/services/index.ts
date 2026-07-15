/**
 * LUNA Miniapp — Services Barrel
 *
 * 所有业务逻辑的统一入口。
 * 镜像 packages/ 结构，便于未来迁移到 @luna/* 包。
 *
 * 规则：
 *   stores  → import from @/services/
 *   pages   → import from @/stores/ (state) + @/services/ (logic)
 *   组件    → import from @/services/ (pure logic only, no Vue deps)
 */

// Character Engine
export { CharacterEngine, getCharacterEngine } from './character'
export { AssetResolver, getAssetResolver, FORM_ASSET_ROOTS, ANIMATION_FILE_MAP } from './character-assets'
export { SpriteLoader, getSpriteLoader } from './character-sprites'

// Animation Engine
export { AnimationStateMachine, AnimationState, getStateMachine } from './animation'
export { TransitionEffects } from './animation-transitions'
export { ParticleSystem } from './animation-particles'

// Audio Engine
export { AudioAnalyzer, getAudioAnalyzer } from './audio'
export { FileValidator, SUPPORTED_AUDIO_TYPES, SIZE_LIMITS } from './audio-validator'
export { Uploader, getUploader, UploadStatus } from './audio-uploader'

// AI Engine
export { LUNA_PERSONALITY, getLunaMood, getSpeakingParams } from './ai-personality'
export { DialogueEngine, getDialogueEngine, DIALOGUE_POOL } from './ai-dialogue'
export { MemorySystem, getMemorySystem, MemoryType } from './ai-memory'
export { GrowthSystem, getGrowthSystem, LEVELS } from './ai-growth'
export { VoiceSystem, getVoiceSystem } from './ai-voice'

// Story Engine
export { StorySystem, getStorySystem, STORIES } from './story'

// Utilities
export { getStorage, setStorage, removeStorage, getStorageInfo, clearLunaStorage, getEasterEggs, foundEasterEgg, StorageKeys } from './storage'

// Theme
export { theme, colors, spacing, fonts } from './theme'
