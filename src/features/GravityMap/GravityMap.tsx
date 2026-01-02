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
import GapNavigator from '@features/GapNavigator/GapNavigator'
import TimetableInput from '@features/Timetable/TimetableInput'
import StudyBuddy from '@features/StudyBuddy/StudyBuddy'
import CampusFilter from '@components/Map/CampusFilter'
import { getCampusHotspots } from '@services/map/campusHotspots'
import type { UserProfile, UserLocation } from '@/types/user'

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
      return latDiff < 0.0005 && lngDiff < 0.0005 
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

  const [showGapNavigator, setShowGapNavigator] = useState(false)
  const [showTimetable, setShowTimetable] = useState(false)
  const [showStudyBuddy, setShowStudyBuddy] = useState(false)
  const [showCampusFilter, setShowCampusFilter] = useState(false)
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null)
  const [showHotspots] = useState(true)

  const allHotspots = getCampusHotspots()
  const campusHotspots = selectedCampus
    ? allHotspots.filter(h => h.campus === selectedCampus)
    : allHotspots

  const createHotspotIcon = (icon: string) => {
    return new DivIcon({
      html: `<div style="
        width: 44px;
        height: 44px;
        border-radius: 16px;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        border: 3px solid #e5e5e5;
        box-shadow: 0 10px 25px rgba(0,0,0,0.08);
      ">${icon}</div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 44],
      className: 'campus-hotspot-marker',
    })
  }

  // ... (previous useEffects)

  return (
    <div className="relative w-full h-[calc(100vh-120px)] lg:h-[calc(100vh-80px)] bg-neutral-50 dark:bg-neutral-900 font-sans transition-colors duration-300">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={true}
        zoomAnimation={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          className="dark:invert dark:grayscale dark:contrast-125 dark:brightness-90 transition-all duration-300"
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

        {isHeatMapMode && getZoneStatus(users).map((zone) => {
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

        {showHotspots && campusHotspots.map((hotspot) => (
          <Marker
            key={hotspot.id}
            position={[hotspot.latitude, hotspot.longitude]}
            icon={createHotspotIcon(hotspot.icon)}
          >
            <Popup>
              <div className="p-4 w-56">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{hotspot.icon}</span>
                  <h3 className="font-bold text-neutral-900 text-lg leading-tight">{hotspot.name}</h3>
                </div>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-2">{hotspot.campus}</p>
                <p className="text-sm text-neutral-500 mb-4">{hotspot.description}</p>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Best For</span>
                  <div className="flex flex-wrap gap-1.5">
                    {hotspot.bestFor.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-lg">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}


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

      {/* Mobile: Beautiful FAB buttons at bottom-left */}
      <div className="absolute bottom-48 left-4 z-[1000] flex md:hidden flex-col gap-3">
        {/* AI Buddy - Featured */}
        <button
          onClick={() => setShowStudyBuddy(true)}
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center active:scale-90 transition-transform"
        >
          <span className="text-2xl">🤖</span>
        </button>

        {/* Quest Navigator */}
        <button
          onClick={() => setShowGapNavigator(true)}
          className="w-12 h-12 rounded-xl bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-lg flex items-center justify-center active:scale-90 transition-transform text-neutral-900 dark:text-white"
        >
          <span className="text-xl">⚡</span>
        </button>

        {/* Schedule */}
        <button
          onClick={() => setShowTimetable(true)}
          className="w-12 h-12 rounded-xl bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-lg flex items-center justify-center active:scale-90 transition-transform text-neutral-900 dark:text-white"
        >
          <span className="text-xl">📅</span>
        </button>

        {/* Campus Filter */}
        <div className="relative">
          <button
            onClick={() => setShowCampusFilter(!showCampusFilter)}
            className={`w-12 h-12 rounded-xl shadow-lg flex items-center justify-center active:scale-90 transition-transform ${
              selectedCampus 
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' 
                : 'bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-white/50 dark:border-white/10 text-neutral-900 dark:text-white'
            }`}
          >
            <span className="text-xl">🏫</span>
          </button>
          {showCampusFilter && (
            <div className="absolute bottom-full left-0 mb-2 w-64 z-[1001]">
              <CampusFilter
                selectedCampus={selectedCampus}
                onSelectCampus={(campus) => {
                  setSelectedCampus(campus)
                  setShowCampusFilter(false)
                }}
              />
            </div>
          )}
        </div>

        {/* Ghost Mode Toggle */}
        <button
          onClick={() => setHeatMapMode(!isHeatMapMode)}
          className={`w-12 h-12 rounded-xl shadow-lg flex items-center justify-center active:scale-90 transition-transform ${
            isHeatMapMode 
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' 
              : 'bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-white/50 dark:border-white/10 text-neutral-900 dark:text-white'
          }`}
        >
          <span className="text-xl">{isHeatMapMode ? '👁️' : '👻'}</span>
        </button>
      </div>

      {/* Desktop: Original vertical layout */}
      <div className="absolute top-24 left-6 z-[1000] hidden md:flex flex-col gap-3">
        <button
          onClick={() => setHeatMapMode(!isHeatMapMode)}
          className={`group flex items-center gap-3 px-5 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl transition-all active:scale-95 ${
            isHeatMapMode ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'bg-white dark:bg-black text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900'
          }`}
        >
          <span className="text-base">{isHeatMapMode ? '👁️' : '👻'}</span>
          <span>{isHeatMapMode ? 'Standard' : 'Ghost Mode'}</span>
        </button>

        <button
          onClick={() => setShowGapNavigator(true)}
          className="group flex items-center gap-3 px-5 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl bg-white dark:bg-black text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 active:scale-95"
        >
          <span className="text-base">⚡</span>
          <span>Gap Navigator</span>
        </button>

        <button
          onClick={() => setShowTimetable(true)}
          className="group flex items-center gap-3 px-5 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl bg-white dark:bg-black text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 active:scale-95"
        >
          <span className="text-base">📅</span>
          <span>Schedule</span>
        </button>

        <button
          onClick={() => setShowStudyBuddy(true)}
          className="group flex items-center gap-3 px-5 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 active:scale-95"
        >
          <span className="text-base">🤖</span>
          <span>AI Buddy</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowCampusFilter(!showCampusFilter)}
            className={`group flex items-center gap-3 px-5 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl active:scale-95 ${
              selectedCampus ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'bg-white dark:bg-black text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            <span className="text-base">🏫</span>
            <span>{selectedCampus ? selectedCampus.slice(0, 10) : 'Campuses'}</span>
          </button>
          {showCampusFilter && (
            <div className="absolute top-full left-0 mt-2 w-64">
              <CampusFilter
                selectedCampus={selectedCampus}
                onSelectCampus={(campus) => {
                  setSelectedCampus(campus)
                  setShowCampusFilter(false)
                }}
              />
            </div>
          )}
        </div>
      </div>

      <OrbitStatus
        onCollisionDetected={(collisionId) => {
          navigate(`/collision/${collisionId}`)
        }}
      />
      
      <LiveActivityTicker users={users} />
      
      <BlackHoleTimer />

      {showGapNavigator && <GapNavigator onClose={() => setShowGapNavigator(false)} />}

      {showTimetable && <TimetableInput onClose={() => setShowTimetable(false)} />}

      {showStudyBuddy && <StudyBuddy onClose={() => setShowStudyBuddy(false)} />}

      {locationError && (
        <div className="fixed top-24 left-6 right-6 md:left-auto md:right-8 md:w-80 bg-white dark:bg-neutral-900 border border-red-100 dark:border-red-900 rounded-3xl p-5 z-[1000] shadow-xl animate-reveal-up">
          <div className="flex gap-4">
            <span className="text-xl">⚠️</span>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 font-medium leading-relaxed">{locationError}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default GravityMap
