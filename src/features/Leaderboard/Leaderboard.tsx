import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '@services/firebase/config'
import type { UserProfile } from '@/types/user'
import { useDemoStore } from '@stores/demoStore'
import { DEMO_USERS } from '@services/demo/demoData'
import Loading from '@components/Loading/Loading'
import EmptyState from '@components/EmptyState/EmptyState'

const Leaderboard: React.FC = () => {
  const [topUsers, setTopUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { isDemoMode } = useDemoStore()

  useEffect(() => {
    if (isDemoMode) {
      const demoUsersSorted = [...DEMO_USERS]
        .sort((a, b) => (b.mass || 0) - (a.mass || 0))
        .slice(0, 20) as UserProfile[]
      setTopUsers(demoUsersSorted)
      setLoading(false)
      return
    }

    const usersRef = collection(db, 'users')
    const q = query(usersRef, orderBy('mass', 'desc'), limit(20))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users: UserProfile[] = []
      snapshot.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id } as UserProfile)
      })
      setTopUsers(users)
      setLoading(false)
    }, (error) => {
      console.error('Leaderboard snapshot error:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [isDemoMode])

  if (loading) return <Loading fullScreen message="Loading rankings..." />

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
  }

  const getStreakEmoji = (streak?: number) => {
    if (!streak || streak < 3) return null
    if (streak >= 14) return '🔥🔥'
    if (streak >= 7) return '🔥'
    return '✨'
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-32 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-b from-neutral-900 to-neutral-800 text-white px-4 pt-16 pb-24 md:pb-32">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
            🏆 Leaderboard
          </h1>
          <p className="text-neutral-400 text-sm font-medium">
            Top students across Indore colleges
          </p>
        </div>
      </div>

      {/* Top 3 Podium - Mobile Optimized */}
      <div className="max-w-2xl mx-auto px-4 -mt-16 md:-mt-20 mb-6">
        <div className="flex justify-center items-end gap-2 md:gap-4">
          {/* 2nd Place */}
          {topUsers[1] && (
            <div 
              onClick={() => navigate(`/profile/${topUsers[1].id}`)}
              className="flex-1 max-w-[110px] md:max-w-[140px] bg-white rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-lg border border-neutral-100 text-center cursor-pointer active:scale-95 transition-all"
            >
              <div className="relative inline-block mb-2">
                <img 
                  src={topUsers[1].photoURL || '/default-avatar.png'} 
                  className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl object-cover border-2 border-neutral-200"
                />
                <div className="absolute -bottom-2 -right-2 w-7 h-7 md:w-8 md:h-8 bg-neutral-200 rounded-lg flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <h3 className="font-bold text-neutral-900 text-xs md:text-sm truncate">{topUsers[1].displayName?.split(' ')[0]}</h3>
              <p className="text-[10px] text-neutral-400 font-medium mt-0.5">{topUsers[1].rank || 'Star'}</p>
              <div className="mt-2 text-sm md:text-base font-bold text-neutral-700">
                {((topUsers[1].mass || 0) / 1000).toFixed(1)}k
              </div>
            </div>
          )}

          {/* 1st Place */}
          {topUsers[0] && (
            <div 
              onClick={() => navigate(`/profile/${topUsers[0].id}`)}
              className="flex-1 max-w-[130px] md:max-w-[160px] bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl border border-amber-200 text-center cursor-pointer active:scale-95 transition-all -mt-6"
            >
              <div className="text-2xl md:text-3xl mb-1 animate-bounce">👑</div>
              <div className="relative inline-block mb-2">
                <img 
                  src={topUsers[0].photoURL || '/default-avatar.png'} 
                  className="w-18 h-18 md:w-24 md:h-24 rounded-xl md:rounded-2xl object-cover border-3 border-amber-300 shadow-lg"
                  style={{ width: '72px', height: '72px' }}
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-amber-400 rounded-xl flex items-center justify-center text-base md:text-lg font-bold text-white shadow-lg">
                  1
                </div>
              </div>
              <h3 className="font-bold text-neutral-900 text-sm md:text-base truncate">{topUsers[0].displayName?.split(' ')[0]}</h3>
              <p className="text-[10px] text-amber-600 font-bold mt-0.5">Apex Voyager</p>
              <div className="mt-3 bg-neutral-900 text-white px-4 py-1.5 rounded-xl text-sm md:text-base font-bold">
                {((topUsers[0].mass || 0) / 1000).toFixed(1)}k XP
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {topUsers[2] && (
            <div 
              onClick={() => navigate(`/profile/${topUsers[2].id}`)}
              className="flex-1 max-w-[110px] md:max-w-[140px] bg-white rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-lg border border-neutral-100 text-center cursor-pointer active:scale-95 transition-all"
            >
              <div className="relative inline-block mb-2">
                <img 
                  src={topUsers[2].photoURL || '/default-avatar.png'} 
                  className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl object-cover border-2 border-neutral-200"
                />
                <div className="absolute -bottom-2 -right-2 w-7 h-7 md:w-8 md:h-8 bg-orange-100 rounded-lg flex items-center justify-center text-sm font-bold text-orange-600">
                  3
                </div>
              </div>
              <h3 className="font-bold text-neutral-900 text-xs md:text-sm truncate">{topUsers[2].displayName?.split(' ')[0]}</h3>
              <p className="text-[10px] text-neutral-400 font-medium mt-0.5">{topUsers[2].rank || 'Star'}</p>
              <div className="mt-2 text-sm md:text-base font-bold text-neutral-700">
                {((topUsers[2].mass || 0) / 1000).toFixed(1)}k
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard List - Mobile Optimized */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-lg border border-neutral-100 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-100 flex justify-between items-center">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">All Rankings</span>
            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider bg-neutral-200 px-2 py-1 rounded-full">
              {topUsers.length} Students
            </span>
          </div>

          {/* List */}
          {topUsers.length === 0 ? (
            <div className="py-16">
              <EmptyState 
                icon="🏆"
                title="No Rankings Yet"
                description="Be the first to claim your spot!"
                action={{
                  label: "Explore Map",
                  onClick: () => navigate('/')
                }}
              />
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {topUsers.map((user, index) => (
                <div 
                  key={user.id} 
                  className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 active:bg-neutral-100 cursor-pointer transition-all"
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  {/* Rank */}
                  <div className="w-8 text-center">
                    {getMedalEmoji(index + 1) || (
                      <span className="text-sm font-bold text-neutral-300">#{index + 1}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="relative">
                    <img 
                      src={user.photoURL || '/default-avatar.png'} 
                      className="w-12 h-12 rounded-xl object-cover border border-neutral-100"
                    />
                    {user.orbitStatus === 'Event Horizon' && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-purple-500 border-2 border-white rounded-full flex items-center justify-center">
                        <span className="text-[8px]">🕳️</span>
                      </div>
                    )}
                    {user.orbitStatus === 'High Gravity' && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-neutral-900 text-sm truncate">{user.displayName}</h3>
                      {getStreakEmoji((user as any).streak)}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-medium text-neutral-400">LVL {user.level || 1}</span>
                      <span className="text-[10px] text-neutral-300">•</span>
                      <span className="text-[10px] font-medium text-indigo-500">{user.rank || 'Star'}</span>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="text-right">
                    <div className="text-base font-bold text-neutral-900 tabular-nums">
                      {(user.mass || 0).toLocaleString()}
                    </div>
                    <div className="text-[9px] font-medium text-neutral-400 uppercase">XP</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-md border border-neutral-100">
            <span className="text-xl">💡</span>
            <p className="text-xs text-neutral-500 font-medium">Complete quests to climb the ranks!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
