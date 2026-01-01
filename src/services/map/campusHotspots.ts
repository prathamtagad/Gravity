export interface CampusHotspot {
  id: string
  name: string
  type: 'library' | 'lab' | 'canteen' | 'garden' | 'study_room' | 'common_area'
  latitude: number
  longitude: number
  icon: string
  description: string
  bestFor: string[]
  capacity?: 'low' | 'medium' | 'high'
}

// IET DAVV Campus, Indore, India
// Base coordinates: 22.6811°N, 75.8800°E
const IET_DAVV_LAT = 22.6811
const IET_DAVV_LNG = 75.8800

export const CAMPUS_HOTSPOTS: CampusHotspot[] = [
  {
    id: 'hs-1',
    name: 'IET Central Library',
    type: 'library',
    latitude: IET_DAVV_LAT + 0.0008,
    longitude: IET_DAVV_LNG - 0.0005,
    icon: '📚',
    description: 'Main IET library with quiet study zones and AC',
    bestFor: ['Deep Focus', 'Research', 'Exam Prep'],
    capacity: 'high'
  },
  {
    id: 'hs-2',
    name: 'CS Lab Block',
    type: 'lab',
    latitude: IET_DAVV_LAT - 0.0003,
    longitude: IET_DAVV_LNG + 0.0008,
    icon: '💻',
    description: 'Computer Science labs with high-speed internet',
    bestFor: ['Coding', 'Project Work', 'Online Classes'],
    capacity: 'medium'
  },
  {
    id: 'hs-3',
    name: 'IET Canteen',
    type: 'canteen',
    latitude: IET_DAVV_LAT - 0.0010,
    longitude: IET_DAVV_LNG - 0.0003,
    icon: '☕',
    description: 'Campus canteen with chai and snacks',
    bestFor: ['Breaks', 'Group Discussions', 'Quick Bites'],
    capacity: 'high'
  },
  {
    id: 'hs-4',
    name: 'Campus Garden',
    type: 'garden',
    latitude: IET_DAVV_LAT + 0.0012,
    longitude: IET_DAVV_LNG + 0.0006,
    icon: '🌳',
    description: 'Peaceful green area near the main building',
    bestFor: ['Reading', 'Fresh Air', 'Light Study'],
    capacity: 'low'
  },
  {
    id: 'hs-5',
    name: 'Seminar Hall Area',
    type: 'study_room',
    latitude: IET_DAVV_LAT + 0.0002,
    longitude: IET_DAVV_LNG - 0.0010,
    icon: '📝',
    description: 'Quiet corridors near seminar halls',
    bestFor: ['Group Projects', 'Presentations', 'Tutoring'],
    capacity: 'medium'
  },
  {
    id: 'hs-6',
    name: 'Main Building Lobby',
    type: 'common_area',
    latitude: IET_DAVV_LAT,
    longitude: IET_DAVV_LNG,
    icon: '🎯',
    description: 'Central hub with seating and charging points',
    bestFor: ['Networking', 'Quick Calls', 'Waiting'],
    capacity: 'medium'
  }
]

export const getCampusHotspots = (userLat: number, userLng: number): CampusHotspot[] => {
  const distanceFromCampus = Math.sqrt(
    Math.pow(userLat - IET_DAVV_LAT, 2) + 
    Math.pow(userLng - IET_DAVV_LNG, 2)
  )
  
  // If user is within ~5km of campus, show actual hotspot locations
  // Otherwise, position hotspots around the user's location
  if (distanceFromCampus < 0.05) {
    return CAMPUS_HOTSPOTS
  }
  
  // Dynamic positioning around user
  return CAMPUS_HOTSPOTS.map((hotspot, index) => ({
    ...hotspot,
    latitude: userLat + (Math.sin(index * 60 * Math.PI / 180) * 0.002),
    longitude: userLng + (Math.cos(index * 60 * Math.PI / 180) * 0.002)
  }))
}

export const getHotspotIcon = (type: CampusHotspot['type']): string => {
  const icons: Record<CampusHotspot['type'], string> = {
    library: '📚',
    lab: '💻',
    canteen: '☕',
    garden: '🌳',
    study_room: '📝',
    common_area: '🎯'
  }
  return icons[type]
}

// Campus center for reference
export const IET_DAVV_CENTER = {
  latitude: IET_DAVV_LAT,
  longitude: IET_DAVV_LNG,
  name: 'IET DAVV, Indore'
}

