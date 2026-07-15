/**
 * LUNA · 星光歌姬 — 存储工具
 * 封装 uni.storage API，提供类型安全的本地持久化
 *
 * 存储键命名空间:
 *   luna_character_*  — 角色相关
 *   luna_music_*      — 音乐相关
 *   luna_memory_*     — 记忆相关
 *   luna_system_*     — 系统相关
 */

const STORAGE_PREFIX = 'luna_'

/**
 * 存储键常量
 */
export const StorageKeys = {
  // 角色
  CHARACTER_FORM: 'luna_character_form',
  CHARACTER_LEVEL: 'luna_character_level',
  CHARACTER_STATS: 'luna_character_stats',
  CHARACTER_UNLOCKED: 'luna_character_unlocked',

  // 音乐
  MUSIC_PLAYLIST: 'luna_music_playlist',
  MUSIC_PLAY_MODE: 'luna_music_play_mode',
  MUSIC_LAST_SONG: 'luna_music_last_song',
  CONSECUTIVE_PLAYS: 'luna_consecutive_plays',

  // 记忆
  FIRST_LAUNCH: 'luna_has_launched',
  FIRST_UPLOAD: 'luna_first_upload',
  BIRTHDAY: 'luna_birthday',
  SPECIAL_MESSAGES: 'luna_special_messages',

  // 系统
  SETTINGS: 'luna_settings',
  EASTER_EGGS: 'luna_easter_eggs_found',
}

/**
 * 安全读取存储
 * @param {string} key - 存储键
 * @param {*} defaultValue - 默认值
 * @returns {*}
 */
export function getStorage(key, defaultValue = null) {
  try {
    const value = uni.getStorageSync(key)
    return value !== '' && value !== undefined ? value : defaultValue
  } catch (e) {
    console.warn(`[Storage] 读取失败: ${key}`, e.message)
    return defaultValue
  }
}

/**
 * 安全写入存储
 * @param {string} key - 存储键
 * @param {*} value - 值
 * @returns {boolean}
 */
export function setStorage(key, value) {
  try {
    uni.setStorageSync(key, value)
    return true
  } catch (e) {
    console.error(`[Storage] 写入失败: ${key}`, e.message)
    return false
  }
}

/**
 * 安全移除存储
 * @param {string} key - 存储键
 * @returns {boolean}
 */
export function removeStorage(key) {
  try {
    uni.removeStorageSync(key)
    return true
  } catch (e) {
    console.warn(`[Storage] 移除失败: ${key}`, e.message)
    return false
  }
}

/**
 * 获取存储信息
 * @returns {{ keys: string[], currentSize: number, limitSize: number }}
 */
export function getStorageInfo() {
  try {
    return uni.getStorageInfoSync()
  } catch (e) {
    return { keys: [], currentSize: 0, limitSize: 10 * 1024 }
  }
}

/**
 * 清除所有 LUNA 相关存储（保留其他数据）
 */
export function clearLunaStorage() {
  try {
    const { keys } = uni.getStorageInfoSync()
    keys
      .filter(k => k.startsWith(STORAGE_PREFIX))
      .forEach(k => uni.removeStorageSync(k))
    return true
  } catch (e) {
    console.error('[Storage] 清除失败:', e.message)
    return false
  }
}

/**
 * 获取已发现的彩蛋列表
 * @returns {string[]}
 */
export function getEasterEggs() {
  return getStorage(StorageKeys.EASTER_EGGS, [])
}

/**
 * 记录发现彩蛋
 * @param {string} eggName - 彩蛋名称
 * @returns {boolean} 是否首次发现
 */
export function foundEasterEgg(eggName) {
  const eggs = getEasterEggs()
  if (eggs.includes(eggName)) return false
  eggs.push(eggName)
  setStorage(StorageKeys.EASTER_EGGS, eggs)
  return true
}
