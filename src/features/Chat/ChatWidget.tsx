import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '@stores/chatStore'
import { useAuthStore } from '@stores/authStore'
import { useUserStore } from '@stores/userStore'
import type { Conversation } from '@/types/chat'

export const ChatWidget: React.FC = () => {
  const { 
    isOpen, 
    minimized, 
    activeRecipient, 
    activeConversationId,
    conversations,
    messages, 
    closeChat, 
    minimizeChat, 
    maximizeChat, 
    sendMessage,
    subscribeToActiveChat,
    subscribeToConversations,
    openChat,
    openInbox,
    suggestedMessage,
    setSuggestedMessage
  } = useChatStore()
  
  const { user } = useAuthStore()
  const { profile } = useUserStore()
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (suggestedMessage && isOpen) {
        setInputText(suggestedMessage)
        setSuggestedMessage(null)
    }
  }, [suggestedMessage, setSuggestedMessage, isOpen])

  useEffect(() => {
    if (user) {
        const unsubscribe = subscribeToConversations(user.uid)
        return () => unsubscribe()
    }
  }, [user, subscribeToConversations])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (activeConversationId) {
      const unsubscribe = subscribeToActiveChat(activeConversationId)
      return () => unsubscribe()
    }
  }, [activeConversationId, subscribeToActiveChat])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputText.trim() || !user) return

    try {
      await sendMessage(inputText, user.uid)
      setInputText('')
    } catch (err) {
      console.error('Failed to send message', err)
    }
  }
  
  const handleConversationClick = (conv: Conversation) => {
      if (!user || !profile) return
      const otherId = conv.participants.find(id => id !== user.uid)
      if (!otherId) return

      const partnerProfile = conv.participantProfiles?.[otherId]
      if (partnerProfile) {
          openChat({ id: otherId, ...partnerProfile } as any, profile)
      }
  }

  if (!isOpen || !user) return null

  if (minimized) {
    return (
      <div 
        className="fixed bottom-4 right-4 z-[2000] cursor-pointer"
        onClick={maximizeChat}
      >
        <div className="relative">
             {activeRecipient ? (
                 <img 
                   src={activeRecipient.photoURL || '/default-avatar.png'} 
                   alt={activeRecipient.displayName}
                   className="w-14 h-14 rounded-full border-4 border-white shadow-lg"
                 />
             ) : (
                 <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg text-white text-2xl">
                     💬
                 </div>
             )}
             <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
      </div>
    )
  }

  const isInbox = !activeConversationId

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] flex flex-col bg-white rounded-2xl shadow-2xl z-[2000] border border-gray-100 overflow-hidden animate-slide-up font-sans">
      <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
            {!isInbox && (
                <button onClick={openInbox} className="mr-1 hover:bg-white/10 p-1 rounded-full">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}
            
          {isInbox ? (
             <h3 className="font-bold text-lg">Messages</h3>
          ) : (
              <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={activeRecipient?.photoURL || '/default-avatar.png'} 
                      alt={activeRecipient?.displayName}
                      className="w-10 h-10 rounded-full border-2 border-white/30"
                    />
                     <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-indigo-600"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight">{activeRecipient?.displayName}</h3>
                    <p className="text-[10px] text-indigo-100 opacity-80">In Orbit</p>
                  </div>
              </div>
          )}
        </div>
        <div className="flex gap-2 text-white/80">
          <button onClick={minimizeChat} className="hover:text-white hover:bg-white/10 p-1 rounded transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </button>
          <button onClick={closeChat} className="hover:text-white hover:bg-white/10 p-1 rounded transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {isInbox ? (
          <div className="flex-1 overflow-y-auto bg-gray-50 p-2 space-y-2">
              {conversations.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center space-y-2">
                     <span className="text-4xl opacity-50">📭</span>
                     <p className="text-sm">No conversations yet.</p>
                     <p className="text-xs">Find someone on the map to chat!</p>
                   </div>
              ) : (
                  conversations.map(conv => {
                      const otherId = conv.participants.find(id => id !== user.uid)
                      const profile = conv.participantProfiles?.[otherId || '']
                      if (!profile) return null

                      return (
                          <div 
                            key={conv.id}
                            onClick={() => handleConversationClick(conv)}
                            className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 cursor-pointer transition-all flex gap-3 items-center group"
                          >
                              <img src={profile.photoURL || '/default-avatar.png'} className="w-12 h-12 rounded-full border border-gray-100" />
                              <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-baseline mb-1">
                                      <h4 className="font-bold text-gray-800 text-sm truncate">{profile.displayName}</h4>
                                      <span className="text-[10px] text-gray-400">
                                          {conv.updatedAt ? new Date(conv.updatedAt).toLocaleDateString() : ''}
                                      </span>
                                  </div>
                                  <p className="text-sm text-gray-500 truncate group-hover:text-indigo-600 transition-colors">
                                      {conv.lastMessage?.text || 'Start a conversation'}
                                  </p>
                              </div>
                          </div>
                      )
                  })
              )}
          </div>
      ) : (
          <>
              <div className="flex-1 bg-gray-50 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
                {messages.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center space-y-2">
                     <span className="text-4xl">👋</span>
                     <p className="text-sm">Say hello to {activeRecipient?.displayName}!</p>
                   </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === user.uid
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div 
                          className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            isMe 
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-none' 
                              : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <span className={`text-[10px] block mt-1 ${isMe ? 'text-indigo-100' : 'text-gray-400'} text-right`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 shrink-0">
                <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400"
                  />
                  <button 
                    type="submit"
                    disabled={!inputText.trim()}
                    className="text-indigo-600 disabled:opacity-40 hover:scale-110 active:scale-95 transition-all"
                  >
                    <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
              </form>
          </>
      )}
    </div>
  )
}

export const ChatWidgetName = 'ChatWidget'
export default ChatWidget
