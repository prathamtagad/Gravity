import { create } from 'zustand'
import type { UserProfile, UserLocation } from '@/types/user'

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
}

export const useMapStore = create<MapState>((set) => ({
  center: { lat: 37.7749, lng: -122.4194 }, // Default: San Francisco
  zoom: 15,
  users: [],
  currentLocation: null,
  isHeatMapMode: false,
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setUsers: (users) => set({ users }),
  setCurrentLocation: (location) => set({ currentLocation: location }),
  setHeatMapMode: (isHeatMapMode) => set({ isHeatMapMode }),
}))

