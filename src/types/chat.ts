export interface Message {
  id: string
  senderId: string
  text: string
  createdAt: number
  readBy?: string[]
}

export interface Conversation {
  id: string
  participants: string[]
  participantProfiles?: {
    [uid: string]: {
        displayName: string
        photoURL?: string
    }
  }
  lastMessage?: {
    text: string
    senderId: string
    createdAt: number
    read: boolean
  }
  updatedAt: number
  createdAt: number
}
