import React, { useState, useEffect, useRef } from 'react'
import type { UserProfile } from '@/types/user'

interface LiveActivityTickerProps {
  users: UserProfile[]
}

const LiveActivityTicker: React.FC<LiveActivityTickerProps> = ({ users }) => {
  const [currentMessage, setCurrentMessage] = useState<string | null>(null)
  const [queue, setQueue] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const prevUsersRef = useRef<Map<string, UserProfile>>(new Map())

  // Detect status changes and add to queue
  useEffect(() => {
    const newEvents: string[] = []
    
    users.forEach(user => {
      const prev = prevUsersRef.current.get(user.id)
      
      // Only check for changes if we've seen this user before (avoids flood on initial load)
      if (prev) {
        // Detect orbit entry
        if (user.orbitStatus === 'In Orbit' && prev.orbitStatus !== 'In Orbit') {
            newEvents.push(`✨ ${user.displayName} entered Orbit`)
        } 
        // Detect deep focus
        else if (user.orbitStatus === 'Event Horizon' && prev.orbitStatus !== 'Event Horizon') {
            newEvents.push(`🤐 ${user.displayName} went into Deep Focus`)
        }
        // Detect level up
        else if ((user.level || 1) > (prev.level || 1)) {
            newEvents.push(`🚀 ${user.displayName} reached Level ${user.level}`)
        }
      }
      
      prevUsersRef.current.set(user.id, user)
    })

    if (newEvents.length > 0) {
      setQueue(prev => [...prev, ...newEvents])
    }
  }, [users])

  // Process queue
  useEffect(() => {
    if (queue.length > 0 && !isVisible && !currentMessage) {
        const nextMsg = queue[0]
        setCurrentMessage(nextMsg)
        setQueue(prev => prev.slice(1))
        setIsVisible(true)

        // Show for 4 seconds, then hide
        const timer = setTimeout(() => {
            setIsVisible(false)
            // Wait for fade out animation (500ms) before clearing message to allow next one
            setTimeout(() => {
                setCurrentMessage(null)
            }, 500)
        }, 4000)

        return () => clearTimeout(timer)
    }
  }, [queue, isVisible, currentMessage])

  if (!currentMessage && !isVisible) return null

  return (
    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
      <div className={`
        bg-white/90 backdrop-blur-2xl border border-white/50 px-6 py-3 rounded-full shadow-2xl transition-all duration-500 flex items-center gap-3
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'}
      `}>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
          <span className="text-[11px] font-bold text-neutral-900 uppercase tracking-widest whitespace-nowrap">
            {currentMessage}
          </span>
      </div>
    </div>
  )
}

export default LiveActivityTicker
