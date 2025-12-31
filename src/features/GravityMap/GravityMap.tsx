import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet'
import { Icon, DivIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useAuthStore } from '@stores/authStore'
import { useUserStore } from '@stores/userStore'
import { useMapStore } from '@stores/mapStore'
import { useChatStore } from '@stores/chatStore'
import { updateUserLocation } from '@services/firebase/dbService'
import { useUserLocations } from '@hooks/useUserLocations'
import OrbitStatus from '@features/OrbitStatus/OrbitStatus'
import BlackHoleTimer from '@features/BlackHole/BlackHoleTimer'
import { calculateGravityPull } from '@services/matching/gravityEngine'
import { getZoneStatus } from '@services/map/heatZoneService'
import LiveActivityTicker from '@components/Map/LiveActivityTicker'
import type { UserProfile, UserLocation } from '@/types/user'

// Simple clustering function (groups markers within 50m)
const clusterMarkers = (users: UserProfile[], zoom: number) => {
  if (zoom > 15) {
    return users.map((user) => ({ type: 'user' as const, user, cluster: null }))
  }

  const clusters: Array<{ lat: number; lng: number; users: UserProfile[] }> = []
  const processed = new Set<string>()

  users.forEach((user) => {
    if (!user.location || processed.has(user.id)) return

    const nearbyUsers = users.filter((other) => {
      if (!other.location || processed.has(other.id) || other.id === user.id) {
        return false
      }
      if (!user.location || !other.location) return false 
      const latDiff = Math.abs(user.location.latitude - other.location.latitude)
      const lngDiff = Math.abs(user.location.longitude - other.location.longitude)
      return latDiff < 0.0005 && lngDiff < 0.0005 // ~50m
    })

    if (nearbyUsers.length > 0) {
      clusters.push({
        lat: user.location.latitude,
        lng: user.location.longitude,
        users: [user, ...nearbyUsers],
      })
      processed.add(user.id)
      nearbyUsers.forEach((u) => processed.add(u.id))
    } else {
      clusters.push({
        lat: user.location.latitude,
        lng: user.location.longitude,
        users: [user],
      })
      processed.add(user.id)
    }
  })

  return clusters.map((cluster) => ({
    type: cluster.users.length > 1 ? ('cluster' as const) : ('user' as const),
    user: cluster.users[0],
    cluster: cluster.users.length > 1 ? cluster : null,
  }))
}

const MapController: React.FC<{
  center: { lat: number; lng: number }
  zoom: number
  onCenterChange: (center: { lat: number; lng: number }) => void
  onZoomChange: (zoom: number) => void
}> = ({ center, zoom, onCenterChange, onZoomChange }) => {
  const map = useMap()

  useEffect(() => {
    const currentCenter = map.getCenter()
    const currentZoom = map.getZoom()
    const isCenterDifferent = 
      Math.abs(currentCenter.lat - center.lat) > 0.00001 ||
      Math.abs(currentCenter.lng - center.lng) > 0.00001
      
    if (isCenterDifferent || currentZoom !== zoom) {
      map.setView([center.lat, center.lng], zoom)
    }
  }, [map, center.lat, center.lng, zoom])

  useMapEvents({
    moveend: () => {
      const newCenter = map.getCenter()
      const isDifferent = 
        Math.abs(newCenter.lat - center.lat) > 0.00001 ||
        Math.abs(newCenter.lng - center.lng) > 0.00001
      
      if (isDifferent) {
        onCenterChange({ lat: newCenter.lat, lng: newCenter.lng })
      }
    },
    zoomend: () => {
      const newZoom = map.getZoom()
      if (newZoom !== zoom) {
        onZoomChange(newZoom)
      }
    },
  })

  return null
}

const GravityMap: React.FC = () => {
  const { user } = useAuthStore()
  const { profile } = useUserStore()
  const { 
    center, zoom, users, setCenter, setZoom, setCurrentLocation,
    isHeatMapMode, setHeatMapMode 
  } = useMapStore()
  const { openChat } = useChatStore() 
  const navigate = useNavigate() 
  const [locationError, setLocationError] = useState<string | null>(null)

  useUserLocations()

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now(),
        }

        setCurrentLocation(location)
        setCenter({ lat: location.latitude, lng: location.longitude })

        if (user && profile) {
          updateUserLocation(user.uid, location).catch((error) => {
            console.error('Error updating location:', error)
          })
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        setLocationError('Unable to get your location')
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [user, profile, setCenter, setCurrentLocation])

  const clusteredMarkers = clusterMarkers(users, zoom)

  const currentUserIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#000000" stroke="#ffffff" stroke-width="3"/>
      </svg>
    `),
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })

  const createUserIcon = (photoURL?: string, displayName?: string) => {
    const initial = displayName?.charAt(0).toUpperCase() || '?'
    return new DivIcon({
      html: `
        <div style="position: relative;">
          ${photoURL ? `<img src="${photoURL}" style="width: 48px; height: 48px; border-radius: 20px; border: 3px solid white; box-shadow: 0 10px 25px rgba(0,0,0,0.1); object-fit: cover;" />` : 
          `<div style="width: 48px; height: 48px; border-radius: 20px; background: #fafafa; color: #000; display: flex; align-items: center; justify-content: center; font-weight: 800; border: 3px solid white; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">${initial}</div>`}
        </div>`,
      iconSize: [48, 48],
      iconAnchor: [24, 48],
      className: 'aura-marker',
    })
  }

  const createClusterIcon = (count: number) => {
    return new DivIcon({
      html: `<div style="
        width: 60px;
        height: 60px;
        border-radius: 24px;
        background: white;
        color: black;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 18px;
        border: 4px solid #f5f5f5;
        box-shadow: 0 15px 35px rgba(0,0,0,0.1);
      ">${count}</div>`,
      iconSize: [60, 60],
      iconAnchor: [30, 60],
      className: 'aura-cluster',
    })
  }

  return (
    <div className="relative w-full h-[calc(100vh-120px)] lg:h-[calc(100vh-80px)] bg-neutral-50 font-sans">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={true}
        zoomAnimation={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <MapController
          center={center}
          zoom={zoom}
          onCenterChange={setCenter}
          onZoomChange={setZoom}
        />

        {profile?.location && (
          <Marker
            position={[profile.location.latitude, profile.location.longitude]}
            icon={currentUserIcon}
          >
            <Popup>
              <div className="p-3 text-center">
                <p className="font-bold text-neutral-900">You</p>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Current Coordinate</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Campus Ghost - Heat Zones */}
        {isHeatMapMode && getZoneStatus(users).map((zone) => {
          // Calculate color based on vibe: Red (1) -> Blue (-1)
          // 0 vibe (balanced) -> Purple/Neutral
          const redValue = Math.max(0, zone.vibeScore) * 255
          const blueValue = Math.max(0, -zone.vibeScore) * 255
          const color = `rgb(${redValue}, 100, ${blueValue})`
          
          return (
            <Circle
              key={zone.id}
              center={[zone.latitude, zone.longitude]}
              pathOptions={{
                fillColor: color,
                fillOpacity: zone.density * 0.4 + 0.1,
                color: color,
                weight: 1,
                className: 'aura-heat-zone'
              }}
              radius={zone.radius}
            >
              <Popup>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-neutral-900 text-lg">{zone.name}</h3>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-neutral-400">
                      <span>Density</span>
                      <span className="text-neutral-900">{Math.round(zone.density * 100)}%</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-neutral-900 h-full transition-all duration-1000" style={{ width: `${zone.density * 100}%` }} />
                    </div>
                    <p className="text-xs font-medium text-neutral-500 mt-2">
                      Vibe: {zone.vibeScore > 0.3 ? '🔥 Busy & Social' : zone.vibeScore < -0.3 ? '❄️ Focused & Quiet' : '🏢 Normal Activity'}
                    </p>
                  </div>
                </div>
              </Popup>
            </Circle>
          )
        })}

        {!isHeatMapMode && clusteredMarkers.map((item, index) => {
          if (!item.user.location || item.user.id === profile?.id) return null

          if (item.type === 'cluster' && item.cluster) {
            return (
              <Marker
                key={`cluster-${index}`}
                position={[item.cluster.lat, item.cluster.lng]}
                icon={createClusterIcon(item.cluster.users.length)}
              >
                <Popup>
                  <div className="p-4 w-64">
                    <h3 className="font-bold text-neutral-900 border-b border-neutral-100 pb-3 mb-3 text-lg">
                      {item.cluster.users.length} Entities Nearby
                    </h3>
                    <div className="space-y-3">
                      {item.cluster.users.slice(0, 5).map((u) => (
                        <div key={u.id} className="flex items-center gap-3">
                          <img src={u.photoURL || '/default-avatar.png'} className="w-8 h-8 rounded-lg object-cover" />
                          <span className="font-bold text-sm text-neutral-800">{u.displayName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          }

          const match = profile ? calculateGravityPull(profile, item.user) : null

          return (
            <Marker
              key={item.user.id}
              position={[item.user.location.latitude, item.user.location.longitude]}
              icon={createUserIcon(item.user.photoURL, item.user.displayName)}
            >
              <Popup className="aura-popup">
                <div className="w-[280px] p-2 flex flex-col items-center text-center">
                  
                  {match && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-neutral-900 text-white text-[9px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                         {match.score}% SYNC
                      </div>
                    </div>
                  )}

                  <div className="relative mb-6 mt-4">
                    <img 
                      src={item.user.photoURL || '/default-avatar.png'} 
                      alt={item.user.displayName}
                      className="w-20 h-20 rounded-[28px] border-4 border-white shadow-xl object-cover"
                    />
                    {item.user.orbitStatus && (
                         <div className="absolute -bottom-2 -right-2 bg-white rounded-xl p-2 shadow-lg border border-neutral-50 text-xl">
                            🪐
                         </div>
                    )}
                  </div>

                  <h3 
                    className="font-bold text-xl text-neutral-900 tracking-tight leading-none mb-2 cursor-pointer hover:underline"
                    onClick={() => navigate(`/profile/${item.user.id}`)}
                  >
                    {item.user.displayName}
                  </h3>
                  
                  <div className="px-5 py-1.5 bg-neutral-50 text-neutral-400 rounded-full text-[10px] font-bold mb-6 tracking-widest uppercase border border-neutral-100">
                    {item.user.rank || 'Voyager'}
                  </div>

                  {match && match.icebreaker && (
                    <div className="w-full mt-2 mb-6 px-4 py-4 bg-neutral-900 rounded-2xl text-left border border-neutral-800 shadow-inner group">
                       <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block mb-2">Orbital Handoff</span>
                       <p className="text-[13px] font-medium text-white leading-relaxed italic">
                         {match.icebreaker.startsWith('Ask') ? match.icebreaker : `"${match.icebreaker}"`}
                       </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 w-full">
                    <button 
                      className="py-3 bg-neutral-50 hover:bg-neutral-100 text-neutral-900 text-[10px] font-bold rounded-2xl transition-all uppercase tracking-widest"
                      onClick={() => navigate(`/profile/${item.user.id}`)}
                    >
                      Profile
                    </button>
                    <button 
                      className="py-3 bg-neutral-900 hover:bg-black text-white text-[10px] font-bold rounded-2xl transition-all uppercase tracking-widest shadow-lg active:scale-95"
                      onClick={() => {
                          if (!user || !profile) return
                          // Extract just the quote part if it's an "Ask John: ..." prompt
                          const quoteMatch = match?.icebreaker?.match(/"([^"]+)"/);
                          const cleanMessage = quoteMatch ? quoteMatch[1] : match?.icebreaker;
                          
                          openChat(item.user, profile, cleanMessage)
                          navigate('/messages')
                      }}
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Heat Map Toggle UI */}
      <div className="absolute top-24 left-6 z-[1000] flex flex-col gap-4">
        <button
          onClick={() => setHeatMapMode(!isHeatMapMode)}
          className={`
            group flex items-center gap-3 px-6 py-3.5 rounded-3xl font-bold uppercase tracking-widest text-[10px] shadow-2xl transition-all active:scale-95
            ${isHeatMapMode 
              ? 'bg-neutral-900 text-white border-neutral-800' 
              : 'bg-white text-neutral-900 border-white hover:bg-neutral-50'}
          `}
        >
          <span className="text-lg">{isHeatMapMode ? '👁️' : '👻'}</span>
          <span>{isHeatMapMode ? 'Standard Mode' : 'Campus Ghost'}</span>
          {!isHeatMapMode && (
             <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
             </span>
          )}
        </button>
      </div>

      <OrbitStatus
        onCollisionDetected={(collisionId) => {
          navigate(`/collision/${collisionId}`)
        }}
      />
      
      <LiveActivityTicker users={users} />
      
      <BlackHoleTimer />

      {locationError && (
        <div className="fixed top-24 left-6 right-6 md:left-auto md:right-8 md:w-80 bg-white border border-red-100 rounded-3xl p-5 z-[1000] shadow-xl animate-reveal-up">
          <div className="flex gap-4">
            <span className="text-xl">⚠️</span>
            <p className="text-sm text-neutral-600 font-medium leading-relaxed">{locationError}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default GravityMap
