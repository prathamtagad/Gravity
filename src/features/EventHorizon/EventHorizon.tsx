import React from 'react'
import { useCountdown } from '@hooks/useCountdown'
import type { Collision } from '@/types/user'
import { useCollisionStore } from '@stores/collisionStore'
import { useSessionStore } from '@stores/sessionStore'
import { useNavigate } from 'react-router-dom'

interface EventHorizonProps {
  collision: Collision
  currentUserId: string
}

const EventHorizon: React.FC<EventHorizonProps> = ({ collision, currentUserId }) => {
  const { expireCollision } = useCollisionStore()
  const { startSession, activeSession } = useSessionStore()
  const navigate = useNavigate()

  const handleComplete = async () => {
    await expireCollision(collision.id)
    navigate('/')
  }

  const handleStartSession = async () => {
    if (!activeSession) {
      await startSession(collision.id, [collision.userId1, collision.userId2])
    }
  }

  const { minutes, seconds, progress, isRunning } = useCountdown({
    initialMinutes: 15,
    onComplete: handleComplete,
    autoStart: !!activeSession,
  })

  const otherUser =
    collision.userId1 === currentUserId
      ? collision.user2Profile
      : collision.user1Profile

  const circumference = 2 * Math.PI * 80 
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="max-w-3xl mx-auto px-6 font-sans">
      <div className="bg-white rounded-[64px] shadow-[0_32px_120px_rgb(0,0,0,0.06)] border border-neutral-100 p-16 text-center animate-reveal-up overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-neutral-900 opacity-5" />
        
        <div className="flex flex-col items-center mb-16">
            <h2 className="text-5xl font-bold text-neutral-900 tracking-tight">Sync State</h2>
            <p className="text-neutral-400 mt-2 font-medium">Shared focus session with {otherUser.displayName}</p>
        </div>

        <div className="relative w-72 h-72 mx-auto mb-16">
          <svg className="transform -rotate-90 w-full h-full">
            <circle
              cx="144"
              cy="144"
              r="80"
              stroke="#f5f5f5"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="144"
              cy="144"
              r="80"
              stroke="#000000"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-7xl font-bold text-neutral-900 tracking-tighter tabular-nums">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.3em] mt-4">
                {isRunning ? 'Synchronizing' : 'Linked Ready'}
              </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-12 mb-16">
            <div className="flex flex-col items-center">
                <div className="relative mb-6">
                    <img
                      src={otherUser.photoURL || '/default-avatar.png'}
                      alt={otherUser.displayName}
                      className="w-20 h-20 rounded-[28px] object-cover shadow-xl border-4 border-white"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full" />
                </div>
                <p className="font-bold text-neutral-900 text-lg">{otherUser.displayName}</p>
                <div className="mt-2 px-3 py-1 bg-neutral-50 text-neutral-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-neutral-100">
                    {collision.matchedStatus}
                </div>
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 max-w-md mx-auto">
          {!activeSession ? (
            <button 
                onClick={handleStartSession} 
                className="flex-1 py-5 rounded-[32px] bg-neutral-900 text-white font-bold uppercase text-[11px] tracking-widest shadow-xl hover:bg-black transition-all active:scale-95"
            >
              Initialize Sync
            </button>
          ) : (
            <div className="flex-1 py-5 rounded-[32px] bg-neutral-50 text-neutral-300 font-bold uppercase text-[11px] tracking-widest cursor-default">
                Focusing...
            </div>
          )}
          <button 
            onClick={handleComplete} 
            className="px-10 py-5 rounded-[32px] border border-neutral-100 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 font-bold uppercase text-[11px] tracking-widest transition-all active:scale-95"
          >
            Terminal
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventHorizon
