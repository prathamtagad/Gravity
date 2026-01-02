import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  isDarkMode: boolean
  toggleTheme: () => void
  setTheme: (isDark: boolean) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleTheme: () => set((state) => {
        const newMode = !state.isDarkMode
        if (newMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        return { isDarkMode: newMode }
      }),
      setTheme: (isDark) => set(() => {
        if (isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        return { isDarkMode: isDark }
      })
    }),
    {
      name: 'gravity-theme-storage',
      onRehydrateStorage: () => (state) => {
          if (state?.isDarkMode) {
              document.documentElement.classList.add('dark')
          } else {
              document.documentElement.classList.remove('dark')
          }
      }
    }
  )
)
