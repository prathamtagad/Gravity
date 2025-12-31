import type { UserProfile, UserLocation } from '@/types/user'

export const calculateDistance = (
  loc1: UserLocation,
  loc2: UserLocation
): number => {
  const R = 6371e3
  const φ1 = (loc1.latitude * Math.PI) / 180
  const φ2 = (loc2.latitude * Math.PI) / 180
  const Δφ = ((loc2.latitude - loc1.latitude) * Math.PI) / 180
  const Δλ = ((loc2.longitude - loc1.longitude) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

export const isWithinCollisionRange = (
  user1: UserProfile,
  user2: UserProfile
): boolean => {
  if (!user1.location || !user2.location) return false
  const distance = calculateDistance(user1.location, user2.location)
  return distance <= 100
}

export const hasMatchingStatus = (
  user1: UserProfile,
  user2: UserProfile
): boolean => {
  return (
    user1.orbitStatus !== undefined &&
    user2.orbitStatus !== undefined &&
    user1.orbitStatus === user2.orbitStatus
  )
}

export const detectCollisions = (
  currentUser: UserProfile,
  allUsers: UserProfile[]
): UserProfile[] => {
  return allUsers.filter((user) => {
    if (user.id === currentUser.id) return false
    return (
      isWithinCollisionRange(currentUser, user) &&
      hasMatchingStatus(currentUser, user)
    )
  })
}
