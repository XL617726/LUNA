/**
 * useDailyStreak — 每日签到连续访问系统
 * 追踪连续访问天数，鼓励每天回来
 */
import { ref, computed } from 'vue'

const STREAK_KEY = 'luna_streak'
const LAST_VISIT_KEY = 'luna_last_visit'
const CHECKIN_KEY = 'luna_today_checked_in'

export interface StreakState {
  streak: number       // 连续天数
  longest: number      // 历史最长
  checkedInToday: boolean
  totalVisits: number
}

export function useDailyStreak() {
  const streak = ref(0)
  const longest = ref(0)
  const checkedInToday = ref(false)
  const totalVisits = ref(0)
  const showReward = ref(false)
  const rewardMessage = ref('')

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(STREAK_KEY) || '{}')
      streak.value = data.streak || 0
      longest.value = data.longest || 0
      totalVisits.value = data.total || 0
    } catch { /* first visit */ }

    // Check if today is a new day
    const today = new Date().toDateString()
    const lastVisit = localStorage.getItem(LAST_VISIT_KEY)
    checkedInToday.value = localStorage.getItem(CHECKIN_KEY) === today

    if (!checkedInToday.value) {
      const yesterday = new Date(Date.now() - 86400000).toDateString()

      if (lastVisit === today) {
        // Already visited today
        checkedInToday.value = true
      } else if (lastVisit === yesterday) {
        // Consecutive day!
        streak.value++
        if (streak.value > longest.value) longest.value = streak.value
        totalVisits.value++
        checkedInToday.value = true
        checkMilestones()
      } else if (lastVisit && lastVisit !== today) {
        // Broke streak
        streak.value = 1
        totalVisits.value++
        checkedInToday.value = true
      } else {
        // First ever visit or localStorage cleared
        streak.value = 1
        totalVisits.value = 1
        checkedInToday.value = true
      }

      // Save
      localStorage.setItem(LAST_VISIT_KEY, today)
      localStorage.setItem(CHECKIN_KEY, today)
      save()
    }
  }

  function checkMilestones() {
    if (streak.value === 3) {
      showReward.value = true
      rewardMessage.value = '连续3天来看我了！你真的很在乎我呢 ✨'
    } else if (streak.value === 7) {
      showReward.value = true
      rewardMessage.value = '一周了！谢谢你每天都来 🌟'
    } else if (streak.value === 30) {
      showReward.value = true
      rewardMessage.value = '一个月了...你是我最重要的人 💫'
    } else if (streak.value === 100) {
      showReward.value = true
      rewardMessage.value = '100天！从第一天到现在，谢谢你从未离开 🌙'
    }
  }

  function save() {
    localStorage.setItem(STREAK_KEY, JSON.stringify({
      streak: streak.value,
      longest: longest.value,
      total: totalVisits.value,
    }))
  }

  function dismissReward() { showReward.value = false }

  const streakEmoji = computed(() => {
    if (streak.value >= 30) return '🌟'
    if (streak.value >= 7) return '⭐'
    if (streak.value >= 3) return '✨'
    return '💫'
  })

  load()
  return { streak, longest, checkedInToday, totalVisits, showReward, rewardMessage, streakEmoji, dismissReward }
}
