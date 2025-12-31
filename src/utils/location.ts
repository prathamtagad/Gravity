import type { UserLocation } from '@/types/user'

/**
 * Get user's current location using browser geolocation API
 */
export const getCurrentLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now(),
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 10000,
      }
    )
  })
}

/**
 * Watch user's location and call callback on updates
 */
export const watchLocation = (
  callback: (location: UserLocation) => void,
  errorCallback?: (error: GeolocationPositionError) => void
): number => {
  if (!navigator.geolocation) {
    if (errorCallback) {
      errorCallback({
        code: 0,
        message: 'Geolocation is not supported',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      } as GeolocationPositionError)
    }
    return -1
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: Date.now(),
      })
    },
    errorCallback,
    {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 10000,
    }
  )
}

