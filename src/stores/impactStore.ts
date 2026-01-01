import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ImpactStats {
  hoursThisWeek: number
  questsCompleted: number
  currentStreak: number
  totalHoursSaved: number
  totalQuestsCompleted: number
  longestStreak: number
  studyBuddiesConnected: number
  gapsOptimized: number
  lastActiveDate: string
}

interface ImpactState {
  stats: ImpactStats
  addQuestCompleted: (durationMinutes: number) => void
  updateStreak: () => void
  addStudyBuddy: () => void
  addGapOptimized: () => void
  resetWeeklyStats: () => void
  loadDemoStats: () => void
}

const getToday = () => new Date().toISOString().split('T')[0]

const initialStats: ImpactStats = {
  hoursThisWeek: 0,
  questsCompleted: 0,
  currentStreak: 0,
  totalHoursSaved: 0,
  totalQuestsCompleted: 0,
  longestStreak: 0,
  studyBuddiesConnected: 0,
  gapsOptimized: 0,
  lastActiveDate: ''
}

export const useImpactStore = create<ImpactState>()(
  persist(
    (set, get) => ({
      stats: initialStats,

      addQuestCompleted: (durationMinutes: number) => {
        const hours = durationMinutes / 60
        set((state) => ({
          stats: {
            ...state.stats,
            hoursThisWeek: +(state.stats.hoursThisWeek + hours).toFixed(1),
            totalHoursSaved: +(state.stats.totalHoursSaved + hours).toFixed(1),
            questsCompleted: state.stats.questsCompleted + 1,
            totalQuestsCompleted: state.stats.totalQuestsCompleted + 1
          }
        }))
        get().updateStreak()
      },

      updateStreak: () => {
        const today = getToday()
        const { lastActiveDate, currentStreak, longestStreak } = get().stats
        
        if (lastActiveDate === today) return
        
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]
        
        let newStreak = currentStreak
        if (lastActiveDate === yesterdayStr) {
          newStreak = currentStreak + 1
        } else if (lastActiveDate !== today) {
          newStreak = 1
        }

        set((state) => ({
          stats: {
            ...state.stats,
            currentStreak: newStreak,
            longestStreak: Math.max(longestStreak, newStreak),
            lastActiveDate: today
          }
        }))
      },

      addStudyBuddy: () => {
        set((state) => ({
          stats: {
            ...state.stats,
            studyBuddiesConnected: state.stats.studyBuddiesConnected + 1
          }
        }))
      },

      addGapOptimized: () => {
        set((state) => ({
          stats: {
            ...state.stats,
            gapsOptimized: state.stats.gapsOptimized + 1
          }
        }))
      },

      resetWeeklyStats: () => {
        set((state) => ({
          stats: {
            ...state.stats,
            hoursThisWeek: 0,
            questsCompleted: 0
          }
        }))
      },

      loadDemoStats: () => {
        set({
          stats: {
            hoursThisWeek: 4.5,
            questsCompleted: 18,
            currentStreak: 7,
            totalHoursSaved: 42,
            totalQuestsCompleted: 127,
            longestStreak: 14,
            studyBuddiesConnected: 12,
            gapsOptimized: 89,
            lastActiveDate: getToday()
          }
        })
      }
    }),
    {
      name: 'gravity-impact-stats'
    }
  )
)
