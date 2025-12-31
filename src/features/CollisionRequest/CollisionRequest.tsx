import React, { useEffect, useState } from 'react'
import { useCollisionStore } from '@stores/collisionStore'
import { useAuthStore } from '@stores/authStore'
import { subscribeToUserCollisions } from '@services/firebase/dbService'
import type { Collision } from '@/types/user'
import Button from '@components/Button/Button'
import { useNavigate } from 'react-router-dom'

const CollisionRequest: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { 
    setActiveCollisions, 
    acceptCollision, 
    declineCollision 
  } = useCollisionStore()
  
  const [request, setRequest] = useState<Collision | null>(null)

  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToUserCollisions(user.uid, (collisions) => {
      setActiveCollisions(collisions)

      const sessionReady = collisions.find(c => {
        const ready = c.user1Status === 'accepted' && c.user2Status === 'accepted'
        return ready
      })

      if (sessionReady) {
        navigate(`/collision/${sessionReady.id}`)
        return
      }

      const activeInteraction = collisions.find(c => {
        const isUser1 = c.userId1 === user.uid
        const myStatus = isUser1 ? c.user1Status : c.user2Status
        return c.status === 'active' && (myStatus === 'pending' || myStatus === 'accepted')
      })

      setRequest(activeInteraction || null)
    })

    return () => unsubscribe()
  }, [user, setActiveCollisions, navigate])

  if (!request || !user) return null

  const isUser1 = request.userId1 === user.uid
  const partnerName = isUser1 ? request.user2Profile.displayName : request.user1Profile.displayName
  const partnerPhoto = isUser1 ? request.user2Profile.photoURL : request.user1Profile.photoURL
  const myStatus = isUser1 ? request.user1Status : request.user2Status
  const isWaiting = myStatus === 'accepted'

  return (
    <div className="fixed top-24 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[1200] animate-slide-in">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-indigo-100">
        <div className={`p-4 text-white flex justify-between items-center ${isWaiting ? 'bg-gradient-to-r from-gray-500 to-gray-600' : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}>
          <div className="flex items-center gap-2">
            <span className="text-xl animate-pulse">⚡</span>
            <span className="font-bold">{isWaiting ? 'Waiting for Partner...' : 'Collision Detected!'}</span>
          </div>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
            {request.matchedStatus}
          </span>
        </div>
        
        <div className="p-5">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={partnerPhoto || '/default-avatar.png'} 
              alt={partnerName}
              className="w-14 h-14 rounded-full border-4 border-indigo-50 object-cover"
            />
            <div>
              <h3 className="text-lg font-bold text-gray-900">{partnerName}</h3>
              <p className="text-sm text-gray-500">
                {isWaiting ? 'Waiting for their response...' : 'Wants to sync orbit'}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {isWaiting ? (
               <div className="flex flex-col gap-2 w-full">
                 <div className="w-full text-center py-2 text-indigo-600 font-medium bg-indigo-50 rounded-lg animate-pulse">
                   Request Sent
                 </div>
                 <button 
                    onClick={() => declineCollision(request.id)}
                    className="text-xs text-center text-gray-400 hover:text-red-500 underline"
                 >
                    Cancel Request
                 </button>
               </div>
            ) : (
              <>
                <Button 
                  className="flex-1 justify-center bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => {
                    console.log('Accepting collision:', request.id)
                    acceptCollision(request.id, user.uid)
                  }}
                >
                  Accept
                </Button>
                <Button 
                  className="flex-1 justify-center bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  onClick={() => {
                    console.log('Declining collision:', request.id)
                    declineCollision(request.id)
                  }}
                >
                  Decline
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollisionRequest
