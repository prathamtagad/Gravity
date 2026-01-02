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
  campus: string
}

export const CAMPUS_HOTSPOTS: CampusHotspot[] = [
  // ============ IET DAVV Campus ============
  // Center: 22.6811°N, 75.8800°E
  {
    id: 'iet-1',
    name: 'IET Central Library',
    type: 'library',
    latitude: 22.6819,
    longitude: 75.8795,
    icon: '📚',
    description: 'Main IET library with quiet study zones and AC',
    bestFor: ['Deep Focus', 'Research', 'Exam Prep'],
    capacity: 'high',
    campus: 'IET DAVV'
  },
  {
    id: 'iet-2',
    name: 'CS Lab Block',
    type: 'lab',
    latitude: 22.6808,
    longitude: 75.8808,
    icon: '💻',
    description: 'Computer Science labs with high-speed internet',
    bestFor: ['Coding', 'Project Work', 'Online Classes'],
    capacity: 'medium',
    campus: 'IET DAVV'
  },
  {
    id: 'iet-3',
    name: 'IET Canteen',
    type: 'canteen',
    latitude: 22.6801,
    longitude: 75.8797,
    icon: '☕',
    description: 'Campus canteen with chai and snacks',
    bestFor: ['Breaks', 'Group Discussions', 'Quick Bites'],
    capacity: 'high',
    campus: 'IET DAVV'
  },
  {
    id: 'iet-4',
    name: 'IET Garden',
    type: 'garden',
    latitude: 22.6823,
    longitude: 75.8806,
    icon: '🌳',
    description: 'Peaceful green area near the main building',
    bestFor: ['Reading', 'Fresh Air', 'Light Study'],
    capacity: 'low',
    campus: 'IET DAVV'
  },

  // ============ IIM Indore Campus ============
  // Center: 22.6241°N, 75.7956°E
  {
    id: 'iim-1',
    name: 'IIM Knowledge Centre',
    type: 'library',
    latitude: 22.6248,
    longitude: 75.7950,
    icon: '📚',
    description: 'State-of-the-art library with business journals',
    bestFor: ['Case Studies', 'Research', 'Silent Study'],
    capacity: 'high',
    campus: 'IIM Indore'
  },
  {
    id: 'iim-2',
    name: 'IIM Computer Lab',
    type: 'lab',
    latitude: 22.6235,
    longitude: 75.7962,
    icon: '💻',
    description: 'IT center with Bloomberg terminals',
    bestFor: ['Data Analysis', 'Online Courses', 'Projects'],
    capacity: 'medium',
    campus: 'IIM Indore'
  },
  {
    id: 'iim-3',
    name: 'IIM Food Court',
    type: 'canteen',
    latitude: 22.6238,
    longitude: 75.7945,
    icon: '☕',
    description: 'Multi-cuisine food court',
    bestFor: ['Networking', 'Team Meetings', 'Breaks'],
    capacity: 'high',
    campus: 'IIM Indore'
  },

  // ============ SGSITS Campus ============
  // Center: 22.7252°N, 75.8713°E
  {
    id: 'sgs-1',
    name: 'SGSITS Central Library',
    type: 'library',
    latitude: 22.7258,
    longitude: 75.8708,
    icon: '📚',
    description: 'Engineering library with vast collection',
    bestFor: ['Technical Reading', 'GATE Prep', 'Research'],
    capacity: 'high',
    campus: 'SGSITS'
  },
  {
    id: 'sgs-2',
    name: 'SGSITS Computer Centre',
    type: 'lab',
    latitude: 22.7248,
    longitude: 75.8718,
    icon: '💻',
    description: 'Main computer lab with latest systems',
    bestFor: ['Programming', 'Lab Work', 'Online Tests'],
    capacity: 'medium',
    campus: 'SGSITS'
  },
  {
    id: 'sgs-3',
    name: 'SGSITS Canteen',
    type: 'canteen',
    latitude: 22.7245,
    longitude: 75.8705,
    icon: '☕',
    description: 'Popular student hangout spot',
    bestFor: ['Breaks', 'Group Study', 'Discussions'],
    capacity: 'high',
    campus: 'SGSITS'
  },

  // ============ Medicaps University ============
  // Center: 22.6201°N, 75.8035°E
  {
    id: 'med-1',
    name: 'Medicaps Library',
    type: 'library',
    latitude: 22.6208,
    longitude: 75.8030,
    icon: '📚',
    description: 'Modern library with digital resources',
    bestFor: ['Exam Prep', 'Silent Study', 'Research'],
    capacity: 'high',
    campus: 'Medicaps University'
  },
  {
    id: 'med-2',
    name: 'Medicaps Innovation Lab',
    type: 'lab',
    latitude: 22.6195,
    longitude: 75.8040,
    icon: '💻',
    description: 'Tech lab with IoT and AI equipment',
    bestFor: ['Projects', 'Hackathons', 'Innovation'],
    capacity: 'medium',
    campus: 'Medicaps University'
  },
  {
    id: 'med-3',
    name: 'Medicaps Cafeteria',
    type: 'canteen',
    latitude: 22.6198,
    longitude: 75.8025,
    icon: '☕',
    description: 'Spacious cafeteria with variety of food',
    bestFor: ['Lunch Breaks', 'Team Meetings', 'Casual Study'],
    capacity: 'high',
    campus: 'Medicaps University'
  },

  // ============ Prestige Institute ============
  // Center: 22.7616°N, 75.8861°E (Scheme 54)
  {
    id: 'pres-1',
    name: 'Prestige Library',
    type: 'library',
    latitude: 22.7620,
    longitude: 75.8856,
    icon: '📚',
    description: 'Management library with case study collection',
    bestFor: ['MBA Prep', 'Case Studies', 'Research'],
    capacity: 'medium',
    campus: 'Prestige Institute'
  },
  {
    id: 'pres-2',
    name: 'Prestige Study Hall',
    type: 'study_room',
    latitude: 22.7612,
    longitude: 75.8865,
    icon: '📝',
    description: 'Dedicated study area for students',
    bestFor: ['Group Projects', 'Presentations', 'Focus Work'],
    capacity: 'medium',
    campus: 'Prestige Institute'
  },
  {
    id: 'pres-3',
    name: 'Prestige Canteen',
    type: 'canteen',
    latitude: 22.7608,
    longitude: 75.8858,
    icon: '☕',
    description: 'Campus eatery with quick bites',
    bestFor: ['Breaks', 'Networking', 'Discussions'],
    capacity: 'medium',
    campus: 'Prestige Institute'
  },

  // ============ DAVV Main Campus ============
  // Center: 22.7163°N, 75.8722°E
  {
    id: 'davv-1',
    name: 'DAVV Central Library',
    type: 'library',
    latitude: 22.7170,
    longitude: 75.8718,
    icon: '📚',
    description: 'University main library with archives',
    bestFor: ['Research', 'PhD Work', 'Competitive Exams'],
    capacity: 'high',
    campus: 'DAVV Main'
  },
  {
    id: 'davv-2',
    name: 'IIPS Building',
    type: 'study_room',
    latitude: 22.6883,
    longitude: 75.8766,
    icon: '📝',
    description: 'International Institute of Professional Studies',
    bestFor: ['Management Studies', 'Group Work', 'Seminars'],
    capacity: 'medium',
    campus: 'DAVV - IIPS'
  },
  {
    id: 'davv-3',
    name: 'DAVV Food Court',
    type: 'canteen',
    latitude: 22.7158,
    longitude: 75.8728,
    icon: '☕',
    description: 'University food court area',
    bestFor: ['Breaks', 'Socializing', 'Quick Meals'],
    capacity: 'high',
    campus: 'DAVV Main'
  },

  // ============ Shri Vaishnav Vidyapeeth Vishwavidyalaya (SVVV) ============
  // Center: 22.8246°N, 75.8496°E
  {
    id: 'svvv-1',
    name: 'SVVV Central Library',
    type: 'library',
    latitude: 22.8252,
    longitude: 75.8490,
    icon: '📚',
    description: 'Multi-disciplinary university library',
    bestFor: ['Research', 'Exam Prep', 'Silent Study'],
    capacity: 'high',
    campus: 'SVVV'
  },
  {
    id: 'svvv-2',
    name: 'SVVV Computer Lab',
    type: 'lab',
    latitude: 22.8240,
    longitude: 75.8502,
    icon: '💻',
    description: 'Modern IT infrastructure for all branches',
    bestFor: ['Coding', 'Projects', 'Online Learning'],
    capacity: 'medium',
    campus: 'SVVV'
  },
  {
    id: 'svvv-3',
    name: 'SVVV Food Court',
    type: 'canteen',
    latitude: 22.8238,
    longitude: 75.8488,
    icon: '☕',
    description: 'Large food court with variety of cuisines',
    bestFor: ['Breaks', 'Group Discussions', 'Networking'],
    capacity: 'high',
    campus: 'SVVV'
  },

  // ============ Acropolis Institute ============
  // Center: 22.8214°N, 75.9432°E
  {
    id: 'acro-1',
    name: 'Acropolis Library',
    type: 'library',
    latitude: 22.8220,
    longitude: 75.9426,
    icon: '📚',
    description: 'Technical library with engineering resources',
    bestFor: ['Technical Study', 'Research', 'GATE Prep'],
    capacity: 'medium',
    campus: 'Acropolis Institute'
  },
  {
    id: 'acro-2',
    name: 'Acropolis Lab Block',
    type: 'lab',
    latitude: 22.8208,
    longitude: 75.9438,
    icon: '💻',
    description: 'Engineering labs with latest equipment',
    bestFor: ['Practicals', 'Projects', 'Innovation'],
    capacity: 'medium',
    campus: 'Acropolis Institute'
  },
  {
    id: 'acro-3',
    name: 'Acropolis Cafeteria',
    type: 'canteen',
    latitude: 22.8206,
    longitude: 75.9428,
    icon: '☕',
    description: 'Campus cafeteria with outdoor seating',
    bestFor: ['Lunch Breaks', 'Team Meetings', 'Quick Bites'],
    capacity: 'medium',
    campus: 'Acropolis Institute'
  },

  // ============ Holkar Science College ============
  // Center: 22.6956°N, 75.8709°E
  {
    id: 'hol-1',
    name: 'Holkar Science Library',
    type: 'library',
    latitude: 22.6962,
    longitude: 75.8704,
    icon: '📚',
    description: 'Historic science library with rare collections',
    bestFor: ['Science Research', 'Competitive Exams', 'Deep Study'],
    capacity: 'high',
    campus: 'Holkar Science College'
  },
  {
    id: 'hol-2',
    name: 'Holkar Science Labs',
    type: 'lab',
    latitude: 22.6950,
    longitude: 75.8714,
    icon: '💻',
    description: 'Physics, Chemistry, Biology labs',
    bestFor: ['Practicals', 'Lab Work', 'Experiments'],
    capacity: 'medium',
    campus: 'Holkar Science College'
  },
  {
    id: 'hol-3',
    name: 'Holkar Canteen',
    type: 'canteen',
    latitude: 22.6948,
    longitude: 75.8702,
    icon: '☕',
    description: 'Popular student hangout near campus',
    bestFor: ['Breaks', 'Discussions', 'Socializing'],
    capacity: 'high',
    campus: 'Holkar Science College'
  },

  // ============ Renaissance College ============
  // Center: 22.7364°N, 75.8939°E
  {
    id: 'ren-1',
    name: 'Renaissance Library',
    type: 'library',
    latitude: 22.7370,
    longitude: 75.8934,
    icon: '📚',
    description: 'Commerce and management library',
    bestFor: ['Commerce Study', 'MBA Prep', 'Research'],
    capacity: 'medium',
    campus: 'Renaissance College'
  },
  {
    id: 'ren-2',
    name: 'Renaissance Study Hall',
    type: 'study_room',
    latitude: 22.7358,
    longitude: 75.8944,
    icon: '📝',
    description: 'Dedicated study area for students',
    bestFor: ['Group Study', 'Presentations', 'Focus Work'],
    capacity: 'medium',
    campus: 'Renaissance College'
  },

  // ============ Oriental Institute ============
  // Center: 22.7563°N, 75.8933°E
  {
    id: 'ori-1',
    name: 'Oriental Library',
    type: 'library',
    latitude: 22.7568,
    longitude: 75.8928,
    icon: '📚',
    description: 'Multi-disciplinary academic library',
    bestFor: ['Research', 'Silent Study', 'Exam Prep'],
    capacity: 'medium',
    campus: 'Oriental Institute'
  },
  {
    id: 'ori-2',
    name: 'Oriental Computer Centre',
    type: 'lab',
    latitude: 22.7558,
    longitude: 75.8938,
    icon: '💻',
    description: 'IT lab with dedicated workstations',
    bestFor: ['Coding', 'Projects', 'Online Tests'],
    capacity: 'medium',
    campus: 'Oriental Institute'
  },

  // ============ LNCT Indore ============
  // Center: 22.7994°N, 75.8422°E
  {
    id: 'lnct-1',
    name: 'LNCT Central Library',
    type: 'library',
    latitude: 22.8000,
    longitude: 75.8416,
    icon: '📚',
    description: 'Engineering and technology library',
    bestFor: ['Technical Study', 'GATE Prep', 'Research'],
    capacity: 'high',
    campus: 'LNCT Indore'
  },
  {
    id: 'lnct-2',
    name: 'LNCT Innovation Lab',
    type: 'lab',
    latitude: 22.7988,
    longitude: 75.8428,
    icon: '💻',
    description: 'Modern tech lab with IoT and AI facilities',
    bestFor: ['Projects', 'Hackathons', 'Innovation'],
    capacity: 'medium',
    campus: 'LNCT Indore'
  },
  {
    id: 'lnct-3',
    name: 'LNCT Food Court',
    type: 'canteen',
    latitude: 22.7990,
    longitude: 75.8412,
    icon: '☕',
    description: 'Spacious food court with variety',
    bestFor: ['Breaks', 'Team Meetings', 'Socializing'],
    capacity: 'high',
    campus: 'LNCT Indore'
  },

  // ============ Sage University ============
  // Center: 22.6368°N, 75.8518°E
  {
    id: 'sage-1',
    name: 'Sage Central Library',
    type: 'library',
    latitude: 22.6374,
    longitude: 75.8512,
    icon: '📚',
    description: 'University library with digital resources',
    bestFor: ['Research', 'Silent Study', 'Exam Prep'],
    capacity: 'high',
    campus: 'Sage University'
  },
  {
    id: 'sage-2',
    name: 'Sage Tech Hub',
    type: 'lab',
    latitude: 22.6362,
    longitude: 75.8524,
    icon: '💻',
    description: 'Technology hub with modern equipment',
    bestFor: ['Coding', 'Projects', 'Innovation'],
    capacity: 'medium',
    campus: 'Sage University'
  },
  {
    id: 'sage-3',
    name: 'Sage Cafeteria',
    type: 'canteen',
    latitude: 22.6360,
    longitude: 75.8510,
    icon: '☕',
    description: 'Campus dining area',
    bestFor: ['Breaks', 'Group Study', 'Networking'],
    capacity: 'high',
    campus: 'Sage University'
  },

  // ============ Chameli Devi Group ============
  // Center: 22.6650°N, 75.8350°E (Khandwa Road)
  {
    id: 'cdgi-1',
    name: 'CDGI Library',
    type: 'library',
    latitude: 22.6656,
    longitude: 75.8344,
    icon: '📚',
    description: 'Engineering and pharmacy library',
    bestFor: ['Technical Study', 'Research', 'Exam Prep'],
    capacity: 'medium',
    campus: 'Chameli Devi Group'
  },
  {
    id: 'cdgi-2',
    name: 'CDGI Labs',
    type: 'lab',
    latitude: 22.6644,
    longitude: 75.8356,
    icon: '💻',
    description: 'Multi-disciplinary engineering labs',
    bestFor: ['Practicals', 'Projects', 'Lab Work'],
    capacity: 'medium',
    campus: 'Chameli Devi Group'
  },

  // ============ Sanghvi Institute ============
  // Center: 22.6200°N, 75.7900°E (Near IIM)
  {
    id: 'sanghvi-1',
    name: 'Sanghvi Library',
    type: 'library',
    latitude: 22.6206,
    longitude: 75.7894,
    icon: '📚',
    description: 'Management and technology library',
    bestFor: ['MBA Prep', 'Research', 'Silent Study'],
    capacity: 'medium',
    campus: 'Sanghvi Institute'
  },
  {
    id: 'sanghvi-2',
    name: 'Sanghvi Study Zone',
    type: 'study_room',
    latitude: 22.6194,
    longitude: 75.7906,
    icon: '📝',
    description: 'Dedicated study area for students',
    bestFor: ['Group Projects', 'Focus Work', 'Presentations'],
    capacity: 'medium',
    campus: 'Sanghvi Institute'
  },

  // ============ SIMS (Shri Govindram Seksaria) ============
  // Center: 22.7252°N, 75.8725°E
  {
    id: 'sims-1',
    name: 'SIMS Library',
    type: 'library',
    latitude: 22.7258,
    longitude: 75.8720,
    icon: '📚',
    description: 'Management institute library',
    bestFor: ['MBA Prep', 'Case Studies', 'Research'],
    capacity: 'medium',
    campus: 'SIMS Indore'
  },
  {
    id: 'sims-2',
    name: 'SIMS Common Area',
    type: 'common_area',
    latitude: 22.7246,
    longitude: 75.8730,
    icon: '🎯',
    description: 'Student common area and lounge',
    bestFor: ['Networking', 'Group Discussions', 'Breaks'],
    capacity: 'medium',
    campus: 'SIMS Indore'
  },

  // ============ IPS Academy ============
  // Center: 22.7450°N, 75.8950°E
  {
    id: 'ips-1',
    name: 'IPS Academy Library',
    type: 'library',
    latitude: 22.7456,
    longitude: 75.8944,
    icon: '📚',
    description: 'Multi-disciplinary academy library',
    bestFor: ['Research', 'Exam Prep', 'Silent Study'],
    capacity: 'high',
    campus: 'IPS Academy'
  },
  {
    id: 'ips-2',
    name: 'IPS Computer Centre',
    type: 'lab',
    latitude: 22.7444,
    longitude: 75.8956,
    icon: '💻',
    description: 'Technology lab with all facilities',
    bestFor: ['Coding', 'Projects', 'Online Tests'],
    capacity: 'medium',
    campus: 'IPS Academy'
  },
  {
    id: 'ips-3',
    name: 'IPS Cafeteria',
    type: 'canteen',
    latitude: 22.7442,
    longitude: 75.8942,
    icon: '☕',
    description: 'Campus food court',
    bestFor: ['Breaks', 'Team Meetings', 'Quick Bites'],
    capacity: 'high',
    campus: 'IPS Academy'
  }
]

export const getCampusHotspots = (): CampusHotspot[] => {
  return CAMPUS_HOTSPOTS
}

export const getNearbyHotspots = (userLat: number, userLng: number, radiusKm: number = 5): CampusHotspot[] => {
  return CAMPUS_HOTSPOTS.filter(hotspot => {
    const distance = getDistanceKm(userLat, userLng, hotspot.latitude, hotspot.longitude)
    return distance <= radiusKm
  })
}

const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
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

export const getUniqueCampuses = (): string[] => {
  return [...new Set(CAMPUS_HOTSPOTS.map(h => h.campus))]
}

export const IET_DAVV_CENTER = {
  latitude: 22.6811,
  longitude: 75.8800,
  name: 'IET DAVV, Indore'
}


