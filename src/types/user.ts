export interface UserLocation {
  latitude: number
  longitude: number
  timestamp: number
}

export type OrbitStatus =
  | 'In Orbit'
  | 'High Gravity'
  | 'Event Horizon'
  | string // Allow string fallback for now to prevent breaking existing data immediately

export interface UserProfile {
  id: string
  email: string
  displayName: string
  photoURL?: string
  bio?: string
  subjects: string[] // General interests
  teachingSubjects?: string[] // Skills user can teach
  learningSubjects?: string[] // Skills user wants to learn
  location?: UserLocation
  orbitStatus?: OrbitStatus
  eventHorizonEndTime?: number 
  mass: number // XP points
  level: number // Calculated from mass
  rank?: string // Star-based rank (e.g. "Protostar")
  followersCount: number
  followingCount: number
  messageCount?: number // Added for quests
  createdAt: number
  updatedAt: number
}

export interface FollowRelationship {
  id: string; // followerId_followingId
  followerId: string;
  followingId: string;
  createdAt: number;
}

export interface Collision {
  id: string
  userId1: string
  userId2: string
  user1Profile: UserProfile
  user2Profile: UserProfile
  status: 'active' | 'expired' | 'completed'
  user1Status: 'pending' | 'accepted' | 'declined'
  user2Status: 'pending' | 'accepted' | 'declined'
  createdAt: number
  expiresAt: number
  matchedStatus: OrbitStatus
}

export interface StudySession {
  id: string
  collisionId: string
  participants: string[]
  startTime: number
  endTime?: number
  duration: number // in minutes (15 for Event Horizon)
}

