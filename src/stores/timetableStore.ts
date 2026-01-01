import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TimeSlot, DetectedGap, Timetable } from '@/types/timetable'
import { DAYS } from '@/types/timetable'

interface TimetableState {
  timetable: Timetable
  detectedGaps: DetectedGap[]
  currentGap: DetectedGap | null
  addClassSlot: (slot: Omit<TimeSlot, 'id'>) => void
  removeClassSlot: (id: string) => void
  updateClassSlot: (id: string, updates: Partial<TimeSlot>) => void
  detectGaps: () => void
  getCurrentGap: () => DetectedGap | null
  clearTimetable: () => void
}

const timeToMinutes = (time: string): number => {
  const [hours, mins] = time.split(':').map(Number)
  return hours * 60 + mins
}

const detectGapsForDay = (daySlots: TimeSlot[], day: TimeSlot['day']): DetectedGap[] => {
  if (daySlots.length === 0) return []

  const sortedSlots = [...daySlots].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  )

  const gaps: DetectedGap[] = []

  for (let i = 0; i < sortedSlots.length - 1; i++) {
    const currentEnd = timeToMinutes(sortedSlots[i].endTime)
    const nextStart = timeToMinutes(sortedSlots[i + 1].startTime)
    const gapDuration = nextStart - currentEnd

    if (gapDuration >= 15) {
      gaps.push({
        id: `gap-${day}-${i}`,
        day,
        startTime: sortedSlots[i].endTime,
        endTime: sortedSlots[i + 1].startTime,
        durationMinutes: gapDuration
      })
    }
  }

  return gaps
}

export const useTimetableStore = create<TimetableState>()(
  persist(
    (set, get) => ({
      timetable: [],
      detectedGaps: [],
      currentGap: null,

      addClassSlot: (slot) => {
        const newSlot: TimeSlot = {
          ...slot,
          id: `class-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
        }
        set((state) => ({
          timetable: [...state.timetable, newSlot]
        }))
        get().detectGaps()
      },

      removeClassSlot: (id) => {
        set((state) => ({
          timetable: state.timetable.filter((slot) => slot.id !== id)
        }))
        get().detectGaps()
      },

      updateClassSlot: (id, updates) => {
        set((state) => ({
          timetable: state.timetable.map((slot) =>
            slot.id === id ? { ...slot, ...updates } : slot
          )
        }))
        get().detectGaps()
      },

      detectGaps: () => {
        const { timetable } = get()
        const allGaps: DetectedGap[] = []

        DAYS.forEach((day) => {
          const daySlots = timetable.filter((slot) => slot.day === day)
          const dayGaps = detectGapsForDay(daySlots, day)
          allGaps.push(...dayGaps)
        })

        set({ detectedGaps: allGaps })
      },

      getCurrentGap: () => {
        const { detectedGaps } = get()
        const now = new Date()
        const currentDay = DAYS[now.getDay() === 0 ? 5 : now.getDay() - 1]
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
        const currentMinutes = timeToMinutes(currentTime)

        const currentGap = detectedGaps.find((gap) => {
          if (gap.day !== currentDay) return false
          const gapStart = timeToMinutes(gap.startTime)
          const gapEnd = timeToMinutes(gap.endTime)
          return currentMinutes >= gapStart && currentMinutes < gapEnd
        })

        if (currentGap) {
          set({ currentGap })
        }
        return currentGap || null
      },

      clearTimetable: () => {
        set({ timetable: [], detectedGaps: [], currentGap: null })
      }
    }),
    {
      name: 'gravity-timetable'
    }
  )
)
