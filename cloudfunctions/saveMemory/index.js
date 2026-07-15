/**
 * CloudBase 云函数 — saveMemory
 * 保存用户回忆（里程碑/首次上传/互动记录）
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { userId, type, title, content, importance = 1 } = event
  if (!userId || !type) return { code: 400, message: 'Missing userId or type' }

  try {
    const memory = {
      userId, type, title: title || type,
      content: content || '', importance,
      createdAt: new Date(),
    }
    const result = await db.collection('memories').add({ data: memory })

    // 检查里程碑
    const count = await db.collection('memories').where({ userId }).count()
    let milestone = null
    if (count.total === 1) milestone = 'first_memory'
    else if (count.total === 10) milestone = 'memory_collector'
    else if (count.total === 50) milestone = 'memory_keeper'

    return {
      code: 200,
      data: { memoryId: result._id, memoryCount: count.total, milestone },
    }
  } catch (e) {
    return { code: 500, message: e.message }
  }
}
