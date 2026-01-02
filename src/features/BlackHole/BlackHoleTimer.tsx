import React, { useEffect, useState } from 'react'
import { useUserStore } from '@stores/userStore'

const BlackHoleTimer: React.FC = () => {
  const { profile, updateStatus, updateProfile, activeQuest, setActiveQuest } = useUserStore()
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [particles, setParticles] = useState<Array<{x: number, y: number, size: number, speed: number, angle: number}>>([])

  useEffect(() => {
    if (profile?.orbitStatus === 'Event Horizon') {
      setIsActive(true)
      if (profile.eventHorizonEndTime) {
        const remaining = Math.max(0, Math.ceil((profile.eventHorizonEndTime - Date.now()) / 1000))
        setTimeLeft(remaining)
      } else {
        setTimeLeft(25 * 60) 
      }
    } else {
      setIsActive(false)
      setTimeLeft(25 * 60)
    }
  }, [profile?.orbitStatus, profile?.eventHorizonEndTime])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && profile?.eventHorizonEndTime) {
      interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((profile.eventHorizonEndTime! - Date.now()) / 1000))
        setTimeLeft(remaining)
        if (remaining <= 0) {
          setIsActive(false)
          if (profile) {
              updateProfile(profile.id, {
                  orbitStatus: 'In Orbit',
                  eventHorizonEndTime: null as any,
                  mass: (profile.mass || 0) + (activeQuest?.xpReward || 100)
              })
              setActiveQuest(null)
          }
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive, profile, activeQuest])

  useEffect(() => {
    if (!isActive) return
    const initialParticles = Array.from({ length: 30 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 1.5 + 0.5,
      angle: Math.random() * Math.PI * 2
    }))
    setParticles(initialParticles)

    const animateParticles = () => {
        setParticles(prev => prev.map(p => {
            const centerX = window.innerWidth / 2
            const centerY = window.innerHeight / 2
            const dx = centerX - p.x
            const dy = centerY - p.y
            const dist = Math.sqrt(dx*dx + dy*dy)
            if (dist < 40) {
                const angle = Math.random() * Math.PI * 2
                const r = Math.max(window.innerWidth, window.innerHeight) / 1.5
                return {
                    x: centerX + Math.cos(angle) * r, y: centerY + Math.sin(angle) * r,
                    size: p.size, speed: p.speed, angle: angle
                }
            }
            const moveX = (dx / dist) * p.speed * 2.5
            const moveY = (dy / dist) * p.speed * 2.5
            return { ...p, x: p.x + moveX, y: p.y + moveY }
        }))
    }
    const interval = setInterval(animateParticles, 40)
    return () => clearInterval(interval)
  }, [isActive])

  if (!isActive) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = activeQuest 
    ? 1 - (timeLeft / (activeQuest.duration * 60))
    : 0

  return (
    <div className="fixed inset-0 z-[3000] bg-white flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 font-sans px-6">
      {/* Particles */}
      {particles.map((p, i) => (
        <div 
            key={i}
            className="absolute rounded-full bg-neutral-900 opacity-5"
            style={{
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                boxShadow: `0 0 ${p.size * 10}px rgba(0,0,0,0.05)`
            }}
        />
      ))}

      {/* Quest Info Card - Mobile & Desktop */}
      {activeQuest && (
        <div className="absolute top-6 left-4 right-4 md:left-auto md:right-8 md:top-8 md:w-96 z-20 animate-reveal-up">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl md:rounded-3xl p-4 md:p-6 border border-indigo-100 shadow-xl">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl md:text-2xl text-white shadow-lg shrink-0">
                {activeQuest.category === 'Learning' && '📚'}
                {activeQuest.category === 'Wellness' && '🧘'}
                {activeQuest.category === 'Social' && '👥'}
                {activeQuest.category === 'Creation' && '✨'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] md:text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{activeQuest.category}</span>
                  <span className="text-[9px] md:text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">+{activeQuest.xpReward} XP</span>
                </div>
                <h3 className="font-bold text-neutral-900 text-base md:text-lg leading-tight truncate">{activeQuest.title}</h3>
                <p className="text-xs md:text-sm text-neutral-500 mt-1 line-clamp-2">{activeQuest.description}</p>
                
                {/* Progress Bar */}
                <div className="mt-3 md:mt-4">
                  <div className="h-1.5 md:h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-linear"
                      style={{ width: `${Math.min(progress * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5 text-[10px] md:text-xs text-neutral-400 font-medium">
                    <span>{Math.round(progress * 100)}% complete</span>
                    <span>{activeQuest.duration} min quest</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timer Circle */}
      <div className="relative mb-12 md:mb-20">
        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white border border-neutral-100 shadow-[0_20px_60px_rgb(0,0,0,0.06)] md:shadow-[0_40px_120px_rgb(0,0,0,0.08)] relative z-10 flex flex-col items-center justify-center animate-reveal-up">
             <div className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.4em] md:tracking-[0.5em] mb-3 md:mb-4">Focus Mode</div>
             <div className="text-6xl md:text-8xl font-bold text-neutral-900 tracking-tighter tabular-nums drop-shadow-sm">
                 {formatTime(timeLeft)}
             </div>
             <div className="absolute inset-0 rounded-full border border-neutral-900/5 scale-110 animate-pulse-slow" />
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center z-10 space-y-3 md:space-y-4 max-w-sm px-4">
        {activeQuest ? (
          <>
            <h2 className="text-2xl md:text-4xl font-bold text-neutral-900 tracking-tight">{activeQuest.title}</h2>
            <p className="text-neutral-400 font-medium text-sm md:text-base leading-relaxed">
              Stay focused! Complete this quest to earn <span className="text-indigo-600 font-bold">+{activeQuest.xpReward} XP</span>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl md:text-4xl font-bold text-neutral-900 tracking-tight">Focusing Mode</h2>
            <p className="text-neutral-400 font-medium text-sm md:text-base leading-relaxed">
              Distractions minimized. Stay in the zone!
            </p>
          </>
        )}
        
        <button
            onClick={() => {
                if (profile) {
                  updateStatus(profile.id, 'In Orbit')
                  setActiveQuest(null)
                }
            }}
            className="mt-8 md:mt-12 px-8 md:px-10 py-4 md:py-5 bg-neutral-50 text-neutral-400 font-bold uppercase text-[10px] md:text-[11px] tracking-widest rounded-2xl md:rounded-[32px] hover:bg-neutral-100 hover:text-neutral-900 transition-all active:scale-95"
          >
            End Focus
          </button>
      </div>

    </div>
  )
}

export default BlackHoleTimer
