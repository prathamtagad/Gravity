import type { UserProfile } from '@/types/user'

export interface HeatZone {
  id: string
  name: string
  latitude: number
  longitude: number
  radius: number
  type: 'quiet' | 'social' | 'balanced'
}

export interface ZoneStatus extends HeatZone {
  density: number
  vibeScore: number
  activeUsers: number
}

export const getZoneStatus = (users: UserProfile[]): ZoneStatus[] => {
  const zones: ZoneStatus[] = []
  const processedUsers = new Set<string>()
  const ZONE_RADIUS = 0.001

  users.forEach(user => {
    if (!user.location || processedUsers.has(user.id)) return

    const cluster = users.filter(u => {
      if (!u.location || processedUsers.has(u.id)) return false
        
      const latDiff = Math.abs(u.location!.latitude - user.location!.latitude)
      const lngDiff = Math.abs(u.location!.longitude - user.location!.longitude)
      return latDiff < ZONE_RADIUS && lngDiff < ZONE_RADIUS
    })

    if (cluster.length >= 2) {
        cluster.forEach(u => processedUsers.add(u.id))

        const avgLat = cluster.reduce((sum, u) => sum + u.location!.latitude, 0) / cluster.length
        const avgLng = cluster.reduce((sum, u) => sum + u.location!.longitude, 0) / cluster.length

        let totalVibe = 0
        cluster.forEach(u => {
            if (u.orbitStatus === 'Event Horizon') totalVibe -= 1
            else if (u.orbitStatus === 'High Gravity') totalVibe += 0.5
            else if (u.orbitStatus === 'In Orbit') totalVibe += 1
        })
        const vibeScore = totalVibe / cluster.length
        const density = Math.min(cluster.length / 5, 1)

        let zoneName = "Active Sector"
        if (vibeScore < -0.3) zoneName = "Deep Focus Zone"
        else if (vibeScore > 0.3) zoneName = "Social Hub"
        else zoneName = "Study Cluster"

        zones.push({
            id: `dynamic-zone-${avgLat.toFixed(4)}-${avgLng.toFixed(4)}`,
            name: zoneName,
            latitude: avgLat,
            longitude: avgLng,
            radius: 120 + (cluster.length * 10),
            type: vibeScore < -0.3 ? 'quiet' : vibeScore > 0.3 ? 'social' : 'balanced',
            density,
            vibeScore,
            activeUsers: cluster.length
        })
    }
  })

  return zones
}
