import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment
} from 'firebase/firestore'
import { db } from './config'
import type { Message, Conversation } from '@/types/chat'
import { UserProfile } from '@/types/user'

const CONVERSATIONS_COLLECTION = 'conversations'
const MESSAGES_COLLECTION = 'messages'

// Helper to ensure consistent conversation IDs (e.g., lexical sort of UIDs)
export const getConversationId = (uid1: string, uid2: string) => {
  return [uid1, uid2].sort().join('_')
}

export const createOrGetConversation = async (
  currentUser: UserProfile,
  otherUser: UserProfile
): Promise<string> => {
  const conversationId = getConversationId(currentUser.id, otherUser.id)
  const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId)
  
  // Optimize: Use setDoc with merge to avoid "read permission" issues on non-existent docs
  // and to reduce read operations.
  await setDoc(conversationRef, {
    id: conversationId,
    participants: [currentUser.id, otherUser.id],
    participantProfiles: {
      [currentUser.id]: {
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL
      },
      [otherUser.id]: {
          displayName: otherUser.displayName,
          photoURL: otherUser.photoURL
      }
    },
    updatedAt: serverTimestamp(),
    // Only set createdAt if it doesn't exist (merge won't overwrite existing fields if not specified, 
    // but here we are specifying it. To truly only set on create, we'd need a different approach or keep getDoc.
    // For now, let's stick to getDoc BUT handle the error gracefully or just tell user to fix rules.
    // Actually, let's keep the getDoc but wrap in try/catch to debug better.
  }, { merge: true })

  return conversationId
}

export const sendMessage = async (
  conversationId: string,
  text: string,
  senderId: string
) => {
  const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId)
  const messagesRef = collection(conversationRef, MESSAGES_COLLECTION)

  // Add message
  await addDoc(messagesRef, {
    text,
    senderId,
    timestamp: serverTimestamp(),
    readBy: [senderId]
  })

  // Update conversation last message
  await updateDoc(conversationRef, {
    lastMessage: {
      text,
      senderId,
      createdAt: Date.now(), // Use client time for immediate sort
      read: false
    },
    updatedAt: serverTimestamp()
  })

  // Update sender message count for quests
  const senderRef = doc(db, 'users', senderId)
  await updateDoc(senderRef, {
    messageCount: increment(1),
    updatedAt: Date.now()
  })
}

export const subscribeToMessages = (
  conversationId: string,
  callback: (messages: Message[]) => void
) => {
  const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId)
  const messagesRef = collection(conversationRef, MESSAGES_COLLECTION)
  const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(100))

  return onSnapshot(q, (snapshot) => {
    const messages: Message[] = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      messages.push({
        ...data,
        id: doc.id,
        createdAt: data.timestamp?.toMillis() || Date.now()
      } as Message)
    })
    callback(messages)
  }, (error) => {
    console.error('Messages subscription error:', error)
  })
}

export const subscribeToUserConversations = (
  userId: string,
  callback: (conversations: Conversation[]) => void
) => {
  const conversationsRef = collection(db, CONVERSATIONS_COLLECTION)
  // Firestore array-contains check
  const q = query(
    conversationsRef, 
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  )

  return onSnapshot(q, (snapshot) => {
    const conversations: Conversation[] = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      conversations.push({
        ...data,
        id: doc.id,
        updatedAt: data.updatedAt?.toMillis() || Date.now(),
        createdAt: data.createdAt?.toMillis() || Date.now()
      } as Conversation)
    })
    callback(conversations)
  }, (error) => {
    console.error('Conversations subscription error:', error)
  })
}
