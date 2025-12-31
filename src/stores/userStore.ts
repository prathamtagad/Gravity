import { create } from 'zustand'
import type { UserProfile, OrbitStatus } from '@/types/user'
import { getUserProfile, updateUserProfile, updateOrbitStatus } from '@services/firebase/dbService'
import { calculateLevelInfo } from '@services/matching/gravityEngine'

interface UserState {
  profile: UserProfile | null
  loading: boolean
  setProfile: (profile: UserProfile | null) => void
  updateProfile: (userId: string, updates: Partial<UserProfile>) => Promise<void>
  updateStatus: (userId: string, status: OrbitStatus) => Promise<void>
  loadProfile: (userId: string) => Promise<void>
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  loading: false,
  setProfile: (profile) => set({ profile }),
  updateProfile: async (userId, updates) => {
    const newMass = updates.mass ?? useUserStore.getState().profile?.mass ?? 0
    const levelInfo = calculateLevelInfo(newMass)
    const enhancedUpdates = {
      ...updates,
      level: levelInfo.level,
      rank: levelInfo.rank
    }
    
    await updateUserProfile(userId, enhancedUpdates)
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...enhancedUpdates } : null,
    }))
  },
  updateStatus: async (userId, status) => {
    await updateOrbitStatus(userId, status)
    set((state) => ({
      profile: state.profile ? { ...state.profile, orbitStatus: status } : null,
    }))
  },
  loadProfile: async (userId) => {
    set({ loading: true })
    try {
      const profile = await getUserProfile(userId)
      set({ profile, loading: false })
    } catch (error) {
      console.error('Error loading profile:', error)
      set({ loading: false })
    }
  },
}))
