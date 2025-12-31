import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCollisionStore } from '@stores/collisionStore'
import { useSessionStore } from '@stores/sessionStore'
import { useAuthStore } from '@stores/authStore'
import { subscribeToUserCollisions } from '@services/firebase/dbService'
import type { Collision } from '@/types/user'
import Button from '@components/Button/Button'

const Wormhole: React.FC = () => {
  const { user } = useAuthStore()
  const { activeCollisions, setActiveCollisions, expireCollision } = useCollisionStore()
  const { activeSession } = useSessionStore()

  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToUserCollisions(user.uid, (collisions) => {
      setActiveCollisions(collisions)
    })

    return () => unsubscribe()
  }, [user, setActiveCollisions])

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getPartnerName = (collision: Collision) => {
    if (!user) return 'Unknown'
    return user.uid === collision.userId1
      ? collision.user2Profile.displayName
      : collision.user1Profile.displayName
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-8 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-4xl">🌀</span> The Wormhole
          </h1>
          <p className="text-gray-500 mt-1">Active jumps and stable connections</p>
        </header>

        {activeSession && (
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-[1.02] transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">Session in Progress</h3>
                <p className="text-indigo-200">Event Horizon Limit: {activeSession.duration}m</p>
              </div>
              <span className="animate-pulse bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
            
            <Link to={`/collision/${activeSession.collisionId}`}>
              <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-transparent">
                Return to Event Horizon
              </Button>
            </Link>
          </div>
        )}

        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span>⚡</span> Detected Collisions
            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
              {activeCollisions.length}
            </span>
          </h2>

          <div className="space-y-4">
            {activeCollisions.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-gray-200">
                <span className="text-4xl block mb-2">📡</span>
                <p className="text-gray-500">No active collisions detected.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Adjust your orbit status or move closer to other users.
                </p>
              </div>
            ) : (
              activeCollisions.map((collision) => (
                <div
                  key={collision.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <span className="text-6xl">⚛️</span>
                  </div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-md uppercase tracking-wider">
                        {collision.matchedStatus} Match
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTime(collision.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {getPartnerName(collision)}
                    </h3>
                    
                    <p className="text-sm text-gray-500 mb-4">
                      Orbit sync established. Ready for interaction.
                    </p>

                    <div className="flex gap-3">
                      <Link to={`/collision/${collision.id}`} className="flex-1">
                        <Button className="w-full justify-center">
                          Open Channel
                        </Button>
                      </Link>
                      <button
                        onClick={() => expireCollision(collision.id)}
                        className="p-3 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-xl transition-colors"
                        title="Dismiss"
                      >
                         ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Wormhole
