import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '@stores/chatStore'
import { useAuthStore } from '@stores/authStore'
import { useUserStore } from '@stores/userStore'
import type { Conversation } from '@/types/chat'
import { useNavigate } from 'react-router-dom'
import EmptyState from '@components/EmptyState/EmptyState'

const ChatPage: React.FC = () => {
  const { 
    activeConversationId,
    activeRecipient,
    conversations,
    messages, 
    sendMessage,
    subscribeToActiveChat,
    subscribeToConversations,
    openChat,
    openInbox,
    suggestedMessage,
    setSuggestedMessage
  } = useChatStore()
  
  const { user } = useAuthStore()
  const { profile, updateProfile } = useUserStore()
  const navigate = useNavigate()
  
  const [inputText, setInputText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showXp, setShowXp] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
     if (suggestedMessage) {
         setInputText(suggestedMessage)
         setSuggestedMessage(null)
     }
  }, [suggestedMessage, setSuggestedMessage])

  useEffect(() => {
    if (user) {
        const unsubscribe = subscribeToConversations(user.uid)
        return () => unsubscribe()
    }
  }, [user, subscribeToConversations])

  useEffect(() => {
    if (activeConversationId) {
      const unsubscribe = subscribeToActiveChat(activeConversationId)
      return () => unsubscribe()
    }
  }, [activeConversationId, subscribeToActiveChat])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeConversationId])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputText.trim() || !user) return

    try {
      await sendMessage(inputText, user.uid)
      setInputText('')
      
      setShowXp(true)
      setTimeout(() => setShowXp(false), 2000)

      if (profile) {
        updateProfile(user.uid, {
            mass: (profile.mass || 0) + 5
        })
      }
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

  const filteredConversations = conversations.filter(conv => {
      if (!searchQuery.trim()) return true
      const otherId = conv.participants.find(id => id !== user!.uid) || ''
      const partner = conv.participantProfiles?.[otherId]
      return partner?.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  if (!user || !profile) return null

  const showChat = !!activeConversationId

  return (
    <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] bg-white md:bg-neutral-50 flex flex-col font-sans overflow-hidden"> 
      <div className="flex-1 flex items-stretch min-h-0 bg-white md:m-4 md:rounded-[40px] md:shadow-[0_8px_40px_rgb(0,0,0,0.04)] md:border md:border-neutral-100 overflow-hidden">
          <div className={`
            w-full md:w-[400px] flex flex-col border-r border-neutral-100 bg-white md:bg-neutral-50/30
            ${showChat ? 'hidden md:flex' : 'flex'}
          `}>
            <div className="px-6 py-6 md:px-10 md:py-12 flex justify-between items-center bg-white/40 sticky top-0 z-10">
                 <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">Messages</h1>
                 <button className="w-10 h-10 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                 </button>
            </div>

            <div className="px-6 md:px-8 mb-6 md:mb-8">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search conversations..." 
                        className="block w-full pl-10 pr-3 py-3.5 border-none rounded-2xl leading-5 bg-neutral-100 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-neutral-900/5 transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-6 space-y-2 pb-20 md:pb-10 custom-scrollbar">
                 {filteredConversations.length === 0 ? (
                    <div className="py-20 px-10 text-center">
                        {searchQuery ? (
                            <>
                                <div className="text-3xl mb-2">🔍</div>
                                <h3 className="text-neutral-900 font-bold">No results found</h3>
                                <p className="text-neutral-500 text-sm mt-1">Try a different name</p>
                            </>
                        ) : (
                            <EmptyState 
                                icon="🛰️"
                                title="No Signals"
                                description="Connect with others on the map to start a conversation."
                                action={{
                                    label: "Find Voyagers",
                                    onClick: () => navigate('/')
                                }}
                            />
                        )}
                    </div>
                 ) : (
                    filteredConversations.map((conv, index) => {
                        const otherId = conv.participants.find(id => id !== user.uid)
                        const partner = conv.participantProfiles?.[otherId || '']
                        const isActive = activeConversationId === conv.id
                        
                        if (!partner) return null

                        return (
                            <div 
                               key={conv.id}
                               onClick={() => handleConversationClick(conv)}
                               className={`
                                 group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all relative stagger-item border border-transparent
                                 ${isActive ? 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-neutral-100 scale-[1.02]' : 'hover:bg-neutral-50 hover:scale-[1.01]'}
                               `}
                               style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="relative shrink-0">
                                    <img src={partner.photoURL || '/default-avatar.png'} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border border-neutral-100" />
                                    {isActive && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full hidden md:block" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className={`font-semibold text-[15px] truncate ${isActive ? 'text-neutral-900' : 'text-neutral-900'}`}>{partner.displayName}</h3>
                                    </div>
                                    <p className={`text-sm truncate ${conv.lastMessage?.senderId !== user.uid && !conv.lastMessage?.read ? 'text-neutral-900 font-bold' : 'text-neutral-500 font-normal'}`}>
                                        {conv.lastMessage?.text || 'Sent an image'}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                 )}
            </div>
          </div>

          <div className={`
            flex-1 flex flex-col bg-white relative
            ${showChat ? 'fixed inset-0 z-[2000] w-full h-[100dvh] overscroll-none md:static md:h-full md:flex-1 md:z-0' : 'hidden md:flex md:flex-1 h-full'}
          `}>
              {!activeConversationId ? (
                  <div className="flex-1 flex flex-col items-center justify-center">
                      <EmptyState 
                        icon="📫"
                        title="Your Messages"
                        description="Send private photos and messages to a friend or group."
                      />
                  </div>
              ) : (
                 <>
                    <div className="h-[60px] px-4 md:px-6 flex items-center border-b border-neutral-100 bg-white sticky top-0 z-30 shrink-0">
                        <button 
                          onClick={() => openInbox()}
                          className="mr-3 -ml-2 p-2 hover:bg-neutral-50 rounded-full transition-colors md:hidden"
                        >
                            <svg className="w-6 h-6 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        
                        <div 
                            className="flex items-center gap-3 cursor-pointer flex-1"
                            onClick={() => activeRecipient && navigate(`/profile/${activeRecipient.id}`)}
                        >
                            <img 
                              src={activeRecipient?.photoURL || '/default-avatar.png'} 
                              className="w-9 h-9 rounded-full border border-neutral-100 object-cover"
                            />
                            <div className="flex flex-col">
                                <h2 className="font-semibold text-neutral-900 text-[15px] leading-tight flex items-center gap-1">
                                    {activeRecipient?.displayName}
                                    {activeRecipient?.orbitStatus === 'In Orbit' && <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />}
                                </h2>
                                <span className="text-xs text-neutral-400">Active now</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 text-neutral-900">
                             <button><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></button>
                             <button><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-white scroll-smooth custom-scrollbar min-h-0">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center pt-20 pb-10 grayscale opacity-50">
                                <img 
                                  src={activeRecipient?.photoURL || '/default-avatar.png'} 
                                  className="w-24 h-24 rounded-full mb-4 border-4 border-neutral-50 shadow-sm object-cover"
                                />
                                <h3 className="text-xl font-bold text-neutral-900">{activeRecipient?.displayName}</h3>
                                <p className="text-sm text-neutral-400">Instagram-style Direct Messages</p>
                            </div>
                        )}
                        
                        {messages.map((msg, index) => {
                            const isMe = msg.senderId === user.uid
                            const prevMsg = messages[index - 1]
                            const nextMsg = messages[index + 1]
                            
                            const isSequenceTop = prevMsg && prevMsg.senderId === msg.senderId
                            const isSequenceBottom = nextMsg && nextMsg.senderId === msg.senderId
                            
                            const showTimestamp = !prevMsg || (new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() > 5 * 60 * 1000)

                            return (
                                <React.Fragment key={msg.id}>
                                    {showTimestamp && (
                                        <div className="flex justify-center my-4">
                                            <span className="text-[10px] text-neutral-400 font-medium">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    )}
                                    <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} ${isSequenceTop ? 'mt-0.5' : 'mt-2'} animate-reveal-up`}>
                                        {!isMe && !isSequenceBottom && (
                                             <img src={activeRecipient?.photoURL} className="w-7 h-7 rounded-full object-cover mr-2 self-end mb-1" />
                                        )}
                                        {!isMe && isSequenceBottom && <div className="w-9" />}

                                        <div className={`
                                            max-w-[70%] px-4 py-2.5 text-[15px] leading-relaxed break-words
                                            ${isMe 
                                                ? 'bg-neutral-950 text-white rounded-[20px] rounded-br-[4px]' 
                                                : 'bg-neutral-100 text-black rounded-[20px] rounded-bl-[4px]'
                                            }
                                            ${isSequenceTop && isMe ? 'rounded-tr-[4px]' : ''}
                                            ${isSequenceBottom && isMe ? 'rounded-br-[20px]' : ''}
                                            ${isSequenceTop && !isMe ? 'rounded-tl-[4px]' : ''}
                                            ${isSequenceBottom && !isMe ? 'rounded-bl-[20px]' : ''}
                                        `}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </React.Fragment>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 md:p-6 bg-white shrink-0 pb-safe">
                        <div className="flex items-center gap-3 bg-neutral-100 rounded-[28px] p-2 pl-2 transition-all ring-1 ring-transparent focus-within:ring-neutral-200 focus-within:bg-white">
                            <button className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition-transform active:scale-95 shadow-md group">
                                <svg className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </button>
                            
                            <textarea 
                                rows={1}
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSend()
                                    }
                                }}
                                placeholder="Write a message..."
                                className="flex-1 bg-transparent border-none outline-none text-neutral-900 placeholder:text-neutral-400 text-[15px] resize-none py-2.5 px-1 font-medium leading-relaxed"
                                style={{ minHeight: '44px', maxHeight: '120px' }}
                            />
                            
                            {inputText.trim() ? (
                                <button 
                                    onClick={() => handleSend()}
                                    className="px-5 py-2.5 bg-neutral-900 text-white font-bold text-sm rounded-full hover:bg-black transition-all shadow-md active:scale-95"
                                >
                                    Send
                                </button>
                            ) : (
                                <div className="flex items-center gap-1 pr-3 text-neutral-400">
                                   <button className="p-2 hover:bg-neutral-200 rounded-full transition-colors hover:text-neutral-900"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
                                </div>
                            )}
                        </div>
                    </div>
                 </>
              )}
          </div>
      </div>

      {showXp && (
        <div className="fixed inset-0 pointer-events-none z-[3000] flex items-center justify-center">
            <div className="bg-neutral-900/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl animate-float-up flex items-center gap-3 border border-white/10">
                <span className="text-xl">✨</span>
                <span className="text-sm font-bold tracking-widest">+5 MASS</span>
            </div>
        </div>
      )}
    </div>
  )
}

export default ChatPage
