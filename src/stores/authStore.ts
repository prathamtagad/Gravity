import { create } from 'zustand'
import { User as FirebaseUser } from 'firebase/auth'
import { onAuthChange } from '@services/firebase/authService'

interface AuthState {
  user: FirebaseUser | null
  loading: boolean
  setUser: (user: FirebaseUser | null) => void
  setLoading: (loading: boolean) => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => {
  let unsubscribe: (() => void) | null = null

  return {
    user: null,
    loading: true,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),
    initializeAuth: () => {
      if (!unsubscribe) {
        unsubscribe = onAuthChange((user) => {
          set({ user, loading: false })
        })
      }
    },
  }
})
