/**
 * CloudBase 云函数 — aiChat
 * LUNA AI 对话处理
 * 读取人格配置 + 记忆上下文 → 生成回复 → 保存对话记录
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// LUNA 人格配置
const PERSONALITY = {
  name: 'LUNA', traits: { warmth: 0.9, energy: 0.7, nostalgia: 0.8, dream: 0.85 },
  speakingStyle: 'short_warm_sentences',
}

// 场景对话库（精简版）
const REPLIES = {
  greeting: ['你来啦～', '今天想听什么歌？', '我在练习新歌哦 ✨'],
  music: ['这首歌送给你 🎵', '节奏来了！', '闭上眼睛，听我唱...'],
  tired: ['那今天休息一下吧', '听一首安静的歌？🌙', '辛苦了，我在呢'],
  memory: ['你还记得那天吗？', '这些回忆是我们共同的宝藏 💎'],
  love: ['谢谢你 💗', '你也是我最重要的人', '有你在真好'],
  default: ['我在呢 ✨', '嗯？', '想做什么？'],
}

exports.main = async (event) => {
  const { userId, message, context: userContext = {} } = event
  if (!message) return { code: 400, message: 'Empty message' }

  try {
    // 读取用户记忆
    const memories = await db.collection('memories')
      .where({ userId })
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get()
      .then(r => r.data)

    // 场景检测
    const scene = detectScene(message)
    const replies = REPLIES[scene] || REPLIES.default
    const reply = replies[Math.floor(Math.random() * replies.length)]

    // 保存对话记录
    await db.collection('conversations').add({
      data: {
        userId, userMessage: message, lunaReply: reply,
        scene, mood: 'gentle',
        createdAt: new Date(),
      },
    })

    return {
      code: 200,
      data: { reply, scene, mood: 'gentle', memoryCount: memories.length },
    }
  } catch (e) {
    return { code: 500, message: e.message }
  }
}

function detectScene(text) {
  const t = text.toLowerCase()
  if (t.includes('累') || t.includes('困') || t.includes('辛苦')) return 'tired'
  if (t.includes('歌') || t.includes('唱') || t.includes('听')) return 'music'
  if (t.includes('回忆') || t.includes('记得') || t.includes('以前')) return 'memory'
  if (t.includes('谢谢') || t.includes('爱你') || t.includes('喜欢')) return 'love'
  return 'greeting'
}
