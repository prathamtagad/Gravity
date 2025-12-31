import React, { useEffect, useState } from 'react'
import { useUserStore } from '@stores/userStore'

const BlackHoleTimer: React.FC = () => {
  const { profile, updateStatus, updateProfile } = useUserStore()
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
                  eventHorizonEndTime: undefined,
                  mass: (profile.mass || 0) + 100
              })
          }
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive, profile])

  useEffect(() => {
    if (!isActive) return
    const initialParticles = Array.from({ length: 40 }).map(() => ({
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

  return (
    <div className="fixed inset-0 z-[3000] bg-white flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 font-sans">
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

      <div className="relative mb-20">
        <div className="w-80 h-80 rounded-full bg-white border border-neutral-100 shadow-[0_40px_120px_rgb(0,0,0,0.08)] relative z-10 flex flex-col items-center justify-center animate-reveal-up">
             <div className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.5em] mb-4">Focus Protocol</div>
             <div className="text-8xl font-bold text-neutral-900 tracking-tighter tabular-nums drop-shadow-sm">
                 {formatTime(timeLeft)}
             </div>
             <div className="absolute inset-0 rounded-full border border-neutral-900/5 scale-110 animate-pulse-slow" />
        </div>
      </div>

      <div className="text-center z-10 space-y-4 max-w-sm px-10">
        <h2 className="text-4xl font-bold text-neutral-900 tracking-tight">Focusing Mode</h2>
        <p className="text-neutral-400 font-medium leading-relaxed">
            Distractions have been minimized. Your concentration is currently high.
        </p>
        
        <button
            onClick={() => {
                if (profile) updateStatus(profile.id, 'In Orbit')
            }}
            className="mt-12 px-10 py-5 bg-neutral-50 text-neutral-400 font-bold uppercase text-[11px] tracking-widest rounded-[32px] hover:bg-neutral-100 hover:text-neutral-900 transition-all active:scale-95"
          >
            End Focus Early
          </button>
      </div>

    </div>
  )
}

export default BlackHoleTimer
