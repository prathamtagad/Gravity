import { create } from 'zustand'
import type { Conversation, Message } from '@/types/chat'
import type { UserProfile } from '@/types/user'
import { subscribeToMessages, subscribeToUserConversations, sendMessage, createOrGetConversation } from '@services/firebase/chatService'

interface ChatState {
  isOpen: boolean
  minimized: boolean
  activeConversationId: string | null
  activeRecipient: UserProfile | null
  conversations: Conversation[]
  messages: Message[]
  suggestedMessage: string | null
  
  openChat: (recipient: UserProfile, currentUser: UserProfile, suggestedMessage?: string) => Promise<void>
  setSuggestedMessage: (message: string | null) => void
  openInbox: () => void
  closeChat: () => void
  minimizeChat: () => void
  maximizeChat: () => void
  
  sendMessage: (text: string, senderId: string) => Promise<void>
  
  subscribeToConversations: (userId: string) => () => void
  subscribeToActiveChat: (conversationId: string) => () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  minimized: false,
  activeConversationId: null,
  activeRecipient: null,
  conversations: [],
  messages: [],
  suggestedMessage: null,

  openChat: async (recipient, currentUser, suggestedMessage) => {
    try {
      set({ isOpen: true, minimized: false, activeRecipient: recipient, suggestedMessage: suggestedMessage || null })
      const conversationId = await createOrGetConversation(currentUser, recipient)
      set({ activeConversationId: conversationId })
    } catch (error) {
      console.error('Failed to open chat:', error)
    }
  },

  setSuggestedMessage: (message) => set({ suggestedMessage: message }),

  openInbox: () => {
    set({ isOpen: true, minimized: false, activeConversationId: null, activeRecipient: null, suggestedMessage: null })
  },

  closeChat: () => set({ isOpen: false, activeConversationId: null, activeRecipient: null, messages: [], suggestedMessage: null }),
  minimizeChat: () => set({ minimized: true }),
  maximizeChat: () => set({ minimized: false }),

  sendMessage: async (text, senderId) => {
    const { activeConversationId } = get()
    if (!activeConversationId) return
    await sendMessage(activeConversationId, text, senderId)
  },

  subscribeToConversations: (userId) => {
    return subscribeToUserConversations(userId, (conversations) => {
      set({ conversations })
    })
  },

  subscribeToActiveChat: (conversationId) => {
    return subscribeToMessages(conversationId, (messages) => {
      set({ messages })
    })
  }
}))
