import type { UserProfile } from '@/types/user'

export interface HeatZone {
  id: string
  name: string
  latitude: number
  longitude: number
  radius: number // in meters
  type: 'quiet' | 'social' | 'balanced'
}

export interface ZoneStatus extends HeatZone {
  density: number // 0 to 1
  vibeScore: number // -1 (Very Quiet) to 1 (Very Social)
  activeUsers: number
}

// Mock campus zones around the default SF center (or wherever the user is)
// Generate dynamic heat zones based on user clusters
export const getZoneStatus = (users: UserProfile[]): ZoneStatus[] => {
  const zones: ZoneStatus[] = []
  const processedUsers = new Set<string>()
  const ZONE_RADIUS = 0.001 // Approx 100m lat/lng delta

  users.forEach(user => {
    if (!user.location || processedUsers.has(user.id)) return

    // Find all users close to this user to form a cluster
    const cluster = users.filter(u => {
      if (!u.location || processedUsers.has(u.id)) return false
        
      const latDiff = Math.abs(u.location!.latitude - user.location!.latitude)
      const lngDiff = Math.abs(u.location!.longitude - user.location!.longitude)
      return latDiff < ZONE_RADIUS && lngDiff < ZONE_RADIUS
    })

    if (cluster.length >= 2) { // Only form a zone if 2+ people
        cluster.forEach(u => processedUsers.add(u.id))

        // Calculate Average Center
        const avgLat = cluster.reduce((sum, u) => sum + u.location!.latitude, 0) / cluster.length
        const avgLng = cluster.reduce((sum, u) => sum + u.location!.longitude, 0) / cluster.length

        // Calculate Vibe & Stats
        let totalVibe = 0
        cluster.forEach(u => {
            if (u.orbitStatus === 'Event Horizon') totalVibe -= 1
            else if (u.orbitStatus === 'High Gravity') totalVibe += 0.5
            else if (u.orbitStatus === 'In Orbit') totalVibe += 1
        })
        const vibeScore = totalVibe / cluster.length
        const density = Math.min(cluster.length / 5, 1) // Cap at 5 users for max density visualization

        // Determine Zone Name dynamically
        let zoneName = "Active Sector"
        if (vibeScore < -0.3) zoneName = "Deep Focus Zone"
        else if (vibeScore > 0.3) zoneName = "Social Hub"
        else zoneName = "Study Cluster"

        zones.push({
            id: `dynamic-zone-${avgLat.toFixed(4)}-${avgLng.toFixed(4)}`,
            name: zoneName,
            latitude: avgLat,
            longitude: avgLng,
            radius: 120 + (cluster.length * 10), // Grow slightly with more people
            type: vibeScore < -0.3 ? 'quiet' : vibeScore > 0.3 ? 'social' : 'balanced',
            density,
            vibeScore,
            activeUsers: cluster.length
        })
    }
  })

  return zones
}
