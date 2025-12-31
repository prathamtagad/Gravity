import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  increment,
  deleteDoc,
} from 'firebase/firestore'
import { db } from './config'
import type { UserProfile, Collision, OrbitStatus, UserLocation } from '@/types/user'

const USERS_COLLECTION = 'users'
const COLLISIONS_COLLECTION = 'collisions'
// const SESSIONS_COLLECTION = 'sessions' // Removed unused collection
const FOLLOWS_COLLECTION = 'follows'

// User Profile Operations
export const createUserProfile = async (userId: string, profile: Partial<UserProfile>) => {
  const userRef = doc(db, USERS_COLLECTION, userId)
  await setDoc(userRef, {
    ...profile,
    id: userId,
    followersCount: 0,
    followingCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userRef = doc(db, USERS_COLLECTION, userId)
  const userSnap = await getDoc(userRef)
  
  if (userSnap.exists()) {
    const data = userSnap.data()
    return {
      ...data,
      id: userSnap.id,
      createdAt: data.createdAt?.toMillis() || Date.now(),
      updatedAt: data.updatedAt?.toMillis() || Date.now(),
    } as UserProfile
  }
  return null
}

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const userRef = doc(db, USERS_COLLECTION, userId)
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

export const updateUserLocation = async (userId: string, location: UserLocation) => {
  const userRef = doc(db, USERS_COLLECTION, userId)
  await updateDoc(userRef, {
    location,
    updatedAt: serverTimestamp(),
  })
}

export const updateOrbitStatus = async (userId: string, status: OrbitStatus) => {
  const userRef = doc(db, USERS_COLLECTION, userId)
  await updateDoc(userRef, {
    orbitStatus: status,
    updatedAt: serverTimestamp(),
  })
}

// Real-time listeners
export const subscribeToUserProfile = (
  userId: string,
  callback: (profile: UserProfile | null) => void
) => {
  const userRef = doc(db, USERS_COLLECTION, userId)
  return onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data()
      callback({
        ...data,
        id: snapshot.id,
        createdAt: data.createdAt?.toMillis() || Date.now(),
        updatedAt: data.updatedAt?.toMillis() || Date.now(),
      } as UserProfile)
    } else {
      callback(null)
    }
  }, (error) => {
    console.error(`Error subscribing to user profile (${userId}):`, error)
    callback(null)
  })
}

export const subscribeToAllUsers = (
  callback: (users: UserProfile[]) => void
) => {
  const usersRef = collection(db, USERS_COLLECTION)
  return onSnapshot(usersRef, (snapshot) => {
    const users: UserProfile[] = []
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000

    snapshot.forEach((doc) => {
      const data = doc.data()
      const updatedAt = data.updatedAt?.toMillis() || 0
      
      // Filter out users who haven't updated location/status in 10 mins
      if (updatedAt > tenMinutesAgo) {
        users.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toMillis() || Date.now(),
          updatedAt: updatedAt,
        } as UserProfile)
      }
    })
    callback(users)
  }, (error) => {
    console.error('Error subscribing to all users:', error)
  })
}

// Collision Operations
export const createCollision = async (collision: Omit<Collision, 'id'>) => {
  const collisionsRef = collection(db, COLLISIONS_COLLECTION)
  const docRef = doc(collisionsRef)
  await setDoc(docRef, {
    ...collision,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export const updateCollisionStatus = async (
  collisionId: string,
  status: Collision['status']
) => {
  const collisionRef = doc(db, COLLISIONS_COLLECTION, collisionId)
  await updateDoc(collisionRef, {
    status,
    updatedAt: serverTimestamp(),
  })
}

export const subscribeToUserCollisions = (
  userId: string,
  callback: (collisions: Collision[]) => void
) => {
  const collisionsRef = collection(db, COLLISIONS_COLLECTION)
  const q = query(
    collisionsRef,
    where('status', '==', 'active'),
    where('userId1', '==', userId)
  )
  
  const q2 = query(
    collisionsRef,
    where('status', '==', 'active'),
    where('userId2', '==', userId)
  )

  let collisions1: Collision[] = []
  let collisions2: Collision[] = []

  const updateCollisions = () => {
    // Merge and deduplicate by ID
    const all = [...collisions1, ...collisions2]
    const unique = Array.from(new Map(all.map(item => [item.id, item])).values())
    callback(unique)
  }

  const unsubscribe1 = onSnapshot(q, (snapshot) => {
    collisions1 = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      collisions1.push({
        ...data,
        id: doc.id,
        createdAt: typeof data.createdAt === 'number' ? data.createdAt : data.createdAt?.toMillis() || Date.now(),
        expiresAt: typeof data.expiresAt === 'number' ? data.expiresAt : data.expiresAt?.toMillis() || Date.now() + 15 * 60 * 1000,
      } as Collision)
    })
    updateCollisions()
  }, (error) => {
    console.error('Collision listener 1 error:', error)
  })

  const unsubscribe2 = onSnapshot(q2, (snapshot) => {
    collisions2 = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      collisions2.push({
        ...data,
        id: doc.id,
        createdAt: typeof data.createdAt === 'number' ? data.createdAt : data.createdAt?.toMillis() || Date.now(),
        expiresAt: typeof data.expiresAt === 'number' ? data.expiresAt : data.expiresAt?.toMillis() || Date.now() + 15 * 60 * 1000,
      } as Collision)
    })
    updateCollisions()
  }, (error) => {
    console.error('Collision listener 2 error:', error)
  })

  return () => {
    unsubscribe1()
    unsubscribe2()
  }
}

export const updateCollisionUserStatus = async (
  collisionId: string,
  userId: string,
  status: 'accepted' | 'declined'
) => {
  const collisionRef = doc(db, COLLISIONS_COLLECTION, collisionId)
  const collisionSnap = await getDoc(collisionRef)
  
  if (!collisionSnap.exists()) return

  const data = collisionSnap.data() as Collision
  const updates: any = { updatedAt: serverTimestamp() }

  if (data.userId1 === userId) {
    updates.user1Status = status
  } else if (data.userId2 === userId) {
    updates.user2Status = status
  } else {
    console.warn('updateCollisionUserStatus: UserId not found in collision', userId, data)
    return
  }

  // console.log('Updating collision status:', collisionId, updates)
  await updateDoc(collisionRef, updates)
}

// Session Operations
// ... (existing sessions functions)

// Social / Follow Operations
export const followUser = async (followerId: string, followingId: string) => {
  const followId = `${followerId}_${followingId}`
  const followRef = doc(db, FOLLOWS_COLLECTION, followId)
  
  // Create follow doc
  await setDoc(followRef, {
    id: followId,
    followerId,
    followingId,
    createdAt: serverTimestamp()
  })

  // Update counts atomically
  const followerRef = doc(db, USERS_COLLECTION, followerId)
  const followingRef = doc(db, USERS_COLLECTION, followingId)

  await updateDoc(followerRef, {
    followingCount: increment(1)
  })

  await updateDoc(followingRef, {
    followersCount: increment(1)
  })

  // Award mass to the follower for networking
  await updateDoc(followerRef, {
    mass: increment(10)
  })
}

export const unfollowUser = async (followerId: string, followingId: string) => {
  const followId = `${followerId}_${followingId}`
  const followRef = doc(db, FOLLOWS_COLLECTION, followId)
  
  await deleteDoc(followRef)

  // Update counts atomically
  const followerRef = doc(db, USERS_COLLECTION, followerId)
  const followingRef = doc(db, USERS_COLLECTION, followingId)

  await updateDoc(followerRef, {
    followingCount: increment(-1)
  })

  await updateDoc(followingRef, {
    followersCount: increment(-1)
  })
}

export const isFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
  const followId = `${followerId}_${followingId}`
  const followRef = doc(db, FOLLOWS_COLLECTION, followId)
  const snap = await getDoc(followRef)
  return snap.exists()
}


