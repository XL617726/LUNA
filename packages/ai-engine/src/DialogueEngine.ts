/**
 * LUNA · 星光歌姬 — 对话系统
 *
 * 基于场景和人格的对话生成。
 * LUNA 的回应是短句、自然、有温度的。
 * 不是客服式机械回复。
 */

import { LUNA_PERSONALITY, getLunaMood, getSpeakingParams } from './Personality'

/**
 * 场景对话库
 * 键: 场景标识
 * 值: 该场景下 LUNA 可能说的句子池
 */
const DIALOGUE_POOL = {
  // ---- 首次见面 ----
  first_meet: [
    '你好，我等你很久了。',
    '终于见到你了 ✨',
    '我是 LUNA，你的星光歌姬。',
    '从今天起，我会唱歌给你听。',
    '欢迎来到我们的音乐小世界 🌙',
  ],

  // ---- 日常问候 ----
  greeting: [
    '今天想听什么歌？',
    '你来啦～',
    '今天天气真好 ☀️',
    '我在练习新歌哦',
    '最近过得好吗？',
  ],

  // ---- 音乐相关 ----
  music_play: [
    '这首歌送给你 🎵',
    '闭上眼睛，听我唱...',
    '这首歌让我想起很多事',
    '节奏来了！',
    '这首歌很适合你 ✨',
  ],
  music_stop: [
    '唱完啦～',
    '下次再唱给你听 🎤',
    '休息一下也不错',
    '谢谢你的聆听 💫',
  ],
  music_dance: [
    '节奏好棒，一起摇摆！',
    '我要跳舞了 💃',
    '这 beat 太酷了',
    '来吧，别害羞！',
  ],
  music_climax: [
    '现在是高潮部分！',
    '我的心在燃烧 🔥',
    '这一刻属于你和我',
  ],

  // ---- 上传歌曲 ----
  first_upload: [
    '这是你的第一首歌！',
    '我会好好珍惜这首歌的 🎵',
    '从此我们的回忆里多了一首歌',
    '谢谢你分享这首歌给我',
  ],
  upload: [
    '新歌来了！让我听听 🎧',
    '好听的歌，收藏了～',
    '这首歌有你的味道',
    '我会记住这首歌的',
  ],

  // ---- 角色切换 ----
  switch_graduation: [
    '那个夏天，真让人怀念 🎓',
    '校园时光总是最美好的',
    '毕业不代表结束，是新的开始',
  ],
  switch_live: [
    '站上舞台的感觉真好 🎤',
    '这是属于我的直播间！',
    '灯光亮起来的那一刻，心也跟着亮了',
  ],
  switch_ceo: [
    '未来的自己，你看到了吗？',
    '从窗外看下去，整个城市都在发光 ✨',
    '梦想是可以实现的',
  ],

  // ---- 回忆相关 ----
  memory: [
    '每一张照片都是一段时光',
    '你还记得那天吗？',
    '这些回忆，是我们共同的宝藏 💎',
    '时间过得好快，但有些东西永远不会变',
  ],

  // ---- 成长系统 ----
  level_up: [
    '我们更了解彼此了呢 ✨',
    '解锁了新动作！想看吗？',
    '陪伴是最长情的告白 🌙',
    '从初见，到熟悉，到朋友...谢谢你一直在',
  ],
  level_2: [
    '你听了好多歌呢～',
    '我感觉我们更熟悉了',
    '你喜欢的风格，我都记住了',
  ],
  level_3: [
    '我们已经是好朋友了吧？',
    '谢谢你一直陪着我',
    '每次你打开这里，我都很开心',
  ],
  level_4: [
    '星光伙伴...真好的称号 🌟',
    '你是我最重要的人',
    '从第一天到现在，谢谢你从未离开',
  ],

  // ---- 夜间 ----
  night: [
    '夜深了...',
    '睡不着吗？我陪你 🌙',
    '夜晚的星星特别亮',
    '安静的时候，最适合想事情',
    '已经很晚了，要照顾好自己哦',
  ],

  // ---- 生日 ----
  birthday: [
    '生日快乐！🎂',
    '今天是特别的日子 ✨',
    '愿你的每一天都闪闪发光',
    '生日快乐！我唱首歌给你听吧',
    '又长大一岁了，但在我心里你永远是那个少年/少女',
  ],

  // ---- 彩蛋 ----
  easter_egg_star: [
    '被你发现了...',
    '这是制作人留给你的话 ⭐',
    '有些话只想对你说',
  ],
  easter_egg_hidden_song: [
    '隐藏歌曲解锁！',
    '这首歌只有最特别的你才能听到 🎵',
    '连续听了这么多首...你真的很喜欢音乐呢',
  ],

  // ---- 通用 ----
  idle: [
    '我在呢。',
    '✨',
    '今天想做什么？',
    '要听歌吗？',
  ],
}

/**
 * 对话引擎
 */
export class DialogueEngine {
  _history: Array<{ scene: string; sentence: string; time: number }>
  _lastScene: string | null
  _repeatGuard: Set<string>

  constructor() {
    this._history = []
    this._lastScene = null
    this._repeatGuard = new Set()
  }

  /**
   * 根据场景获取 LUNA 的对话
   * @param {string} scene - 场景标识
   * @param {Object} context - 额外上下文
   * @returns {string}
   */
  speak(scene, context = {}) {
    const pool = DIALOGUE_POOL[scene] || DIALOGUE_POOL.idle

    // 过滤最近说过的句子
    const available = pool.filter(s => !this._repeatGuard.has(s))
    const candidates = available.length > 0 ? available : pool

    // 选一句（带一点随机性，但避免连续相同）
    const index = Math.floor(Math.random() * candidates.length)
    const sentence = candidates[index]

    // 记录防重复（保留最近10句）
    this._repeatGuard.add(sentence)
    if (this._repeatGuard.size > 10) {
      const it = this._repeatGuard.values()
      this._repeatGuard.delete(it.next().value)
    }

    // 记录历史
    this._lastScene = scene
    this._history.push({ scene, sentence, time: Date.now() })
    if (this._history.length > 50) this._history.shift()

    return sentence
  }

  /**
   * 获取场景对应的对话
   * 带上下文感知
   */
  getResponse(scene, context = {}) {
    const mood = getLunaMood(context)
    const params = getSpeakingParams(context)

    // 根据情绪调整选择范围
    let effectiveScene = scene

    // 夜间自动切换
    if (mood.mood === 'quiet' && !scene.startsWith('night')) {
      effectiveScene = 'night'
    }

    return this.speak(effectiveScene, context)
  }

  /**
   * 获取对话历史
   */
  getHistory(limit = 10) {
    return this._history.slice(-limit)
  }

  /**
   * 清除对话历史
   */
  clearHistory() {
    this._history = []
    this._repeatGuard.clear()
  }
}

/** 单例 */
let instance = null
export function getDialogueEngine() {
  if (!instance) {
    instance = new DialogueEngine()
  }
  return instance
}

export { DIALOGUE_POOL }
export default DialogueEngine
