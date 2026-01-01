import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TimeSlot, DetectedGap, Timetable } from '@/types/timetable'
import { DAYS } from '@/types/timetable'
import { DEMO_TIMETABLE } from '@/services/demo/demoData'

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
  loadDemoTimetable: () => void
  importFromCSV: (csvContent: string) => { success: boolean; count: number; error?: string }
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
      },

      loadDemoTimetable: () => {
        const demoSlots: TimeSlot[] = DEMO_TIMETABLE.map((slot, index) => ({
          ...slot,
          id: `demo-class-${index}`
        }))
        set({ timetable: demoSlots })
        get().detectGaps()
      },

      importFromCSV: (csvContent: string) => {
        try {
          const lines = csvContent.split('\n')
          const newSlots: TimeSlot[] = []
          let successCount = 0

          const startIndex = lines[0].toLowerCase().includes('day') ? 1 : 0

          const validDays: TimeSlot['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

          for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i].trim()
            if (!line) continue

            const [dayStr, startTime, endTime, className] = line.split(',').map(s => s.trim())
            
            const day = validDays.find(d => d.toLowerCase() === dayStr.toLowerCase()) as TimeSlot['day']

            if (day && startTime && endTime && className) {
               newSlots.push({
                 id: `import-${Date.now()}-${i}`,
                 day,
                 startTime,
                 endTime,
                 className
               })
               successCount++
            }
          }

          if (successCount > 0) {
            set((state) => ({
              timetable: [...state.timetable, ...newSlots]
            }))
            get().detectGaps()
            return { success: true, count: successCount }
          }
          
          return { success: false, count: 0, error: 'No valid classes found in CSV' }
        } catch (e) {
          console.error('CSV Import Error:', e)
          return { success: false, count: 0, error: 'Failed to parse CSV file' }
        }
      }
    }),
    {
      name: 'gravity-timetable'
    }
  )
)
