/**
 * CloudBase 云函数 — uploadMusic
 * 上传歌曲到云存储，记录元数据到数据库
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { fileID, songName, userId } = event
  if (!fileID || !songName) return { code: 400, message: 'Missing fileID or songName' }

  try {
    // 获取文件临时链接
    const { fileList } = await cloud.getTempFileURL({ fileList: [fileID] })
    const url = fileList[0]?.tempFileURL || fileID

    // 写入歌曲记录
    const song = {
      userId, name: songName,
      url: fileID, // 云文件 ID，使用时再换取临时链接
      duration: 0, bpm: 0, energy: 0, animationMode: 'sing',
      playCount: 0, isHidden: false,
      uploadedAt: new Date(),
      createdAt: new Date(),
    }
    const result = await db.collection('songs').add({ data: song })

    return { code: 200, message: 'Upload success', songId: result._id, url }
  } catch (e) {
    return { code: 500, message: e.message }
  }
}
