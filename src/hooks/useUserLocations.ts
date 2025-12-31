import { useEffect } from 'react'
import { useMapStore } from '@stores/mapStore'
import { subscribeToAllUsers } from '@services/firebase/dbService'
import type { UserProfile } from '@/types/user'

export const useUserLocations = () => {
  const { setUsers } = useMapStore()

  useEffect(() => {
    const unsubscribe = subscribeToAllUsers((users: UserProfile[]) => {
      const usersWithLocations = users.filter(
        (user) => user.location && user.location.latitude && user.location.longitude
      )
      setUsers(usersWithLocations)
    })

    return () => {
      unsubscribe()
    }
  }, [setUsers])
}
