import { create } from 'zustand'
import type { UserProfile, UserLocation } from '@/types/user'
import { DEMO_USERS } from '@/services/demo/demoData'

interface MapState {
  center: { lat: number; lng: number }
  zoom: number
  users: UserProfile[]
  currentLocation: UserLocation | null
  isHeatMapMode: boolean
  setCenter: (center: { lat: number; lng: number }) => void
  setZoom: (zoom: number) => void
  setUsers: (users: UserProfile[]) => void
  setCurrentLocation: (location: UserLocation | null) => void
  setHeatMapMode: (mode: boolean) => void
  loadDemoUsers: () => void
  clearDemoUsers: () => void
}

export const useMapStore = create<MapState>((set, get) => ({
  center: { lat: 22.6811, lng: 75.8800 },
  zoom: 17,
  users: [],
  currentLocation: null,
  isHeatMapMode: false,
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setUsers: (users) => set({ users }),
  setCurrentLocation: (location) => set({ currentLocation: location }),
  setHeatMapMode: (isHeatMapMode) => set({ isHeatMapMode }),
  loadDemoUsers: () => {
    const currentUsers = get().users
    const demoUsers = DEMO_USERS as UserProfile[]
    const existingIds = new Set(currentUsers.map(u => u.id))
    const newDemoUsers = demoUsers.filter(u => !existingIds.has(u.id))
    set({ users: [...currentUsers, ...newDemoUsers] })
  },
  clearDemoUsers: () => {
    const currentUsers = get().users
    const nonDemoUsers = currentUsers.filter(u => !u.id.startsWith('demo-'))
    set({ users: nonDemoUsers })
  }
}))
