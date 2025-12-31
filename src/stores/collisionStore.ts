import { create } from 'zustand'
import type { Collision, UserProfile } from '@/types/user'
import { createCollision, updateCollisionStatus, updateCollisionUserStatus } from '@services/firebase/dbService'

interface CollisionState {
  activeCollisions: Collision[]
  potentialMatches: UserProfile[]
  setActiveCollisions: (collisions: Collision[]) => void
  setPotentialMatches: (matches: UserProfile[]) => void
  createNewCollision: (
    user1: UserProfile,
    user2: UserProfile,
    matchedStatus: string
  ) => Promise<string>
  acceptCollision: (collisionId: string, userId: string) => Promise<void>
  declineCollision: (collisionId: string) => Promise<void>
  expireCollision: (collisionId: string) => Promise<void>
}

export const useCollisionStore = create<CollisionState>((set) => ({
  activeCollisions: [],
  potentialMatches: [],
  setActiveCollisions: (collisions) => set({ activeCollisions: collisions }),
  setPotentialMatches: (matches) => set({ potentialMatches: matches }),
  createNewCollision: async (user1, user2, matchedStatus) => {
    const now = Date.now()
    const expiresAt = now + 15 * 60 * 1000 // 15 minutes

    const collisionData = {
      userId1: user1.id,
      userId2: user2.id,
      user1Profile: user1,
      user2Profile: user2,
      status: 'active' as const,
      user1Status: 'accepted' as const, // Creator automatically accepts
      user2Status: 'pending' as const,
      createdAt: now,
      expiresAt,
      matchedStatus: matchedStatus as any,
    }

    const collisionId = await createCollision(collisionData)
    
    set((state) => ({
      activeCollisions: [
        ...state.activeCollisions,
        { ...collisionData, id: collisionId },
      ],
    }))

    return collisionId
  },
  expireCollision: async (collisionId: string) => {
    await updateCollisionStatus(collisionId, 'expired')
    set((state) => ({
      activeCollisions: state.activeCollisions.filter((c) => c.id !== collisionId),
    }))
  },
  acceptCollision: async (collisionId, userId) => {
    await updateCollisionUserStatus(collisionId, userId, 'accepted')
    // Local state will be updated via subscription
  },
  declineCollision: async (collisionId) => {
    await updateCollisionStatus(collisionId, 'expired')
    set((state) => ({
      activeCollisions: state.activeCollisions.filter((c) => c.id !== collisionId),
    }))
  },
}))

