export interface UserLocation {
  latitude: number
  longitude: number
  timestamp: number
}

export type OrbitStatus =
  | 'In Orbit'
  | 'High Gravity'
  | 'Event Horizon'
  | string

export interface UserProfile {
  id: string
  email: string
  displayName: string
  photoURL?: string
  bio?: string
  subjects: string[]
  teachingSubjects?: string[]
  learningSubjects?: string[]
  location?: UserLocation
  orbitStatus?: OrbitStatus
  eventHorizonEndTime?: number 
  mass: number
  level: number
  rank?: string
  streak: number
  lastActiveDate?: string
  totalQuests: number
  followersCount: number
  followingCount: number
  messageCount?: number
  createdAt: number
  updatedAt: number
}

export interface FollowRelationship {
  id: string;
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
  duration: number
}
