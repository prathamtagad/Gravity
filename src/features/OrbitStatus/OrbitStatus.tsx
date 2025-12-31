import React, { useState } from 'react'
import { useUserStore } from '@stores/userStore'
// import { useMapStore } from '@stores/mapStore'
// import { detectCollisions } from '@services/collisionService'
import Modal from '@components/Modal/Modal'
import Button from '@components/Button/Button'
import Alert from '@components/Alert/Alert'

const ORBIT_MODES = [
  {
    id: 'in-orbit',
    label: 'In Orbit' as const,
    description: 'Available for casual study',
    color: 'bg-green-500',
    icon: '🪐'
  },
  {
    id: 'high-gravity',
    label: 'High Gravity' as const,
    description: 'Hosting a group, others can join',
    color: 'bg-purple-600',
    icon: '⚛️'
  },
  {
    id: 'event-horizon',
    label: 'Event Horizon' as const,
    description: 'Deep focus mode (Do Not Disturb)',
    color: 'bg-red-500',
    icon: '⛔'
  }
]

interface OrbitStatusProps {
  onCollisionDetected?: (collisionId: string) => void
}

const OrbitStatus: React.FC<OrbitStatusProps> = () => {
  const { profile, updateProfile } = useUserStore()
  // const { users } = useMapStore()
  // const { setPotentialMatches, createNewCollision } = useCollisionStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage] = useState('')

  // No background collision detection. 
  // Collision requests are now strictly manual via the Map "Connect" button.
  const handleStatusChange = async (mode: typeof ORBIT_MODES[0]) => {
    if (!profile) return
    try {
      const updates: any = { orbitStatus: mode.label }
      
      if (mode.label === 'Event Horizon') {
        // Set timer for 25 minutes from now
        updates.eventHorizonEndTime = Date.now() + 25 * 60 * 1000
      } else {
        // Clear timer
        updates.eventHorizonEndTime = null
      }

      await updateProfile(profile.id, updates)
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  if (!profile) return null

  return (
    <>
      {/* Floating Status Card */}
      <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[1000] animate-reveal-up" style={{ animationDelay: '0.6s' }}>
        <div className="glass-panel p-1 rounded-3xl bg-gradient-to-r from-white/90 to-white/70 shadow-2xl shadow-purple-500/10 border-white/50">
          <div className="bg-white/40 backdrop-blur-md rounded-[22px] p-4 border border-white/40">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 animate-pulse-subtle">
                  <span className="text-xl">🪐</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-none mb-1">Orbit Status</h3>
                  <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">Live Activity</p>
                </div>
              </div>
              <Button
                variant={profile.orbitStatus ? "secondary" : "primary"}
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="text-xs rounded-full px-4 h-8 transition-premium hover:scale-105 active:scale-95"
              >
                {profile.orbitStatus ? 'Change' : 'Set Status'}
              </Button>
            </div>
            
            {profile.orbitStatus ? (
              <div 
                onClick={() => setIsModalOpen(true)}
                className="relative overflow-hidden group rounded-2xl bg-gradient-to-r from-gravity-primary/10 to-blue-500/10 p-4 border border-gravity-primary/10 cursor-pointer transition-premium hover:scale-[1.02]"
              >
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse" />
                    <span className="text-gray-900 font-bold text-sm tracking-tight">
                      {typeof profile.orbitStatus === 'string' ? profile.orbitStatus : (profile.orbitStatus as any)?.label}
                    </span>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
                {/* Decorative background glow */}
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-gravity-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              </div>
            ) : (
              <div 
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-200 p-4 text-center hover:border-gravity-primary/40 hover:bg-gravity-primary/5 transition-premium group"
              >
                <p className="text-sm text-gray-500 group-hover:text-gravity-primary font-bold">
                  Tap to set your study mode ✨
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Set Your Orbit Status"
        size="md"
      >
        <div className="space-y-4">
          {ORBIT_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleStatusChange(mode)}
              className={`w-full relative overflow-hidden p-4 rounded-xl text-left transition-all duration-200 border-2 group ${
                profile.orbitStatus === mode.label
                  ? 'border-gravity-primary bg-gravity-primary/5'
                  : 'border-transparent bg-gray-50 hover:bg-white hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm ${
                  mode.id === 'in-orbit' ? 'bg-green-100' : 
                  mode.id === 'high-gravity' ? 'bg-purple-100' : 'bg-red-100'
                }`}>
                  {mode.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{mode.label}</h4>
                  <p className="text-sm text-gray-500">{mode.description}</p>
                </div>
              </div>
              
              {/* Active Indicator */}
              {profile.orbitStatus === mode.label && (
                <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-gravity-primary animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </Modal>

      {showAlert && (
        <Alert
          type="info"
          message={alertMessage}
          onClose={() => setShowAlert(false)}
          autoClose={5000}
        />
      )}
    </>
  )
}

export default OrbitStatus
