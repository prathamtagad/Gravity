import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@services/firebase/config'
import type { Collision } from '@/types/user'
import EventHorizon from '@features/EventHorizon/EventHorizon'
import Loading from '@components/Loading/Loading'
import Button from '@components/Button/Button'

const CollisionView: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [collision, setCollision] = useState<Collision | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id || !user) return

    const collisionRef = doc(db, 'collisions', id)
    const unsubscribe = onSnapshot(collisionRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data()
        setCollision({
          ...data,
          id: snapshot.id,
          createdAt: data.createdAt?.toMillis() || Date.now(),
          expiresAt: data.expiresAt || Date.now() + 15 * 60 * 1000,
        } as Collision)
      } else {
        navigate('/')
      }
      setLoading(false)
    }, (error) => {
      console.error('Collision snapshot error:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [id, user, navigate])

  if (loading) {
    return <Loading fullScreen message="Loading collision..." />
  }

  if (!collision) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Collision not found</p>
          <Button onClick={() => navigate('/')}>Go to Map</Button>
        </div>
      </div>
    )
  }

  if (collision.userId1 !== user?.uid && collision.userId2 !== user?.uid) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">You are not part of this collision</p>
          <Button onClick={() => navigate('/')}>Go to Map</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-12 animate-reveal-up">
      <EventHorizon collision={collision} currentUserId={user!.uid} />
    </div>
  )
}

export default CollisionView
