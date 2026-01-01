import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DemoState {
  isDemoMode: boolean
  enableDemoMode: () => void
  disableDemoMode: () => void
  toggleDemoMode: () => void
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      isDemoMode: false,

      enableDemoMode: () => {
        set({ isDemoMode: true })
      },

      disableDemoMode: () => {
        set({ isDemoMode: false })
      },

      toggleDemoMode: () => {
        set({ isDemoMode: !get().isDemoMode })
      }
    }),
    {
      name: 'gravity-demo-mode'
    }
  )
)
