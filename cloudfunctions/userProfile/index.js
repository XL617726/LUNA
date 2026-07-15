/**
 * CloudBase 云函数 — userProfile
 * 用户档案管理（登录/初始化/等级查询）
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { action = 'get', userId, data } = event
  const wxContext = cloud.getWXContext()
  const openid = userId || wxContext.OPENID

  try {
    switch (action) {
      case 'get': {
        const user = await db.collection('users').where({ openid }).get().then(r => r.data[0])
        return { code: 200, data: user || null }
      }
      case 'create': {
        const existing = await db.collection('users').where({ openid }).get().then(r => r.data[0])
        if (existing) return { code: 200, data: existing }
        const newUser = {
          openid, nickname: data?.nickname || '朋友', avatar: data?.avatar || '',
          level: 1, exp: 0, currentCharacter: 'graduation',
          stats: { totalPlays: 0, totalSongs: 0, interactionDays: 0, lastInteraction: null },
          settings: { nightVoice: true, autoPlay: true },
          createdAt: new Date(), updatedAt: new Date(),
        }
        const result = await db.collection('users').add({ data: newUser })
        return { code: 200, data: { ...newUser, _id: result._id } }
      }
      case 'update': {
        await db.collection('users').where({ openid }).update({ data: { ...data, updatedAt: new Date() } })
        return { code: 200, message: 'Updated' }
      }
      default:
        return { code: 400, message: 'Invalid action' }
    }
  } catch (e) {
    return { code: 500, message: e.message }
  }
}
