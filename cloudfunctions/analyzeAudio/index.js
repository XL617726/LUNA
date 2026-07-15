/**
 * CloudBase 云函数 — analyzeAudio
 * 分析歌曲的 BPM / 能量 / 情绪
 * 输出: { bpm, energy, mood }
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const { musicID } = event
  if (!musicID) return { code: 400, message: 'Missing musicID' }

  try {
    // 生产环境：下载音频文件 → Web Audio API 分析
    // 当前为接口层，返回模拟分析结果
    const bpm = 80 + Math.floor(Math.random() * 60)
    const energy = 0.4 + Math.random() * 0.6
    let mood = 'calm'
    if (energy > 0.8) mood = 'energetic'
    else if (energy > 0.6) mood = 'happy'
    else if (bpm < 90) mood = 'peaceful'

    return {
      code: 200,
      data: {
        bpm: Math.round(bpm),
        energy: Math.round(energy * 100) / 100,
        mood,
        timestamp: new Date().toISOString(),
      },
    }
  } catch (e) {
    return { code: 500, message: e.message }
  }
}
