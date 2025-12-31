import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '@services/firebase/config'
import type { UserProfile } from '@/types/user'
import Loading from '@components/Loading/Loading'
import EmptyState from '@components/EmptyState/EmptyState'

const Leaderboard: React.FC = () => {
  const [topUsers, setTopUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, orderBy('mass', 'desc'), limit(10))

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
  }, [])

  if (loading) return <Loading fullScreen message="Reading data..." />

  return (
    <div className="min-h-[calc(100vh-120px)] lg:min-h-[calc(100vh-80px)] bg-neutral-50 flex flex-col animate-reveal-up overflow-x-hidden relative font-sans">
      {/* Soft Light Aura Background */}
      <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.02),transparent_40%)]" />
      </div>

      {/* Hero Header - Minimalist */}
      <div className="relative h-[250px] md:h-[350px] w-full flex flex-col items-center justify-center text-center px-6 z-10">
        <div className="relative z-10 animate-fade-in">
            <h1 className="text-4xl md:text-8xl font-bold text-neutral-900 tracking-tight mb-4 md:mb-6">
                Continuum <span className="text-neutral-400">Rankings</span>
            </h1>
            <p className="text-[10px] md:text-sm font-bold text-neutral-400 uppercase tracking-[0.4em] opacity-80">Highest concentration of mass in the cosmos</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-6 -mt-20 relative z-10 pb-40">
        {/* Top 3 Podium - Elevated Light Cards */}
        <div className="grid md:grid-cols-3 gap-10 mb-20 items-end">
            {/* 2nd Place */}
            {topUsers[1] && (
                <div className="order-2 md:order-1 bg-white/60 backdrop-blur-3xl p-10 rounded-[48px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center transform hover:-translate-y-2 transition-all cursor-pointer group" onClick={() => navigate(`/profile/${topUsers[1].id}`)}>
                    <div className="relative mb-8">
                        <img src={topUsers[1].photoURL || '/default-avatar.png'} className="w-28 h-28 rounded-[32px] object-cover bg-neutral-100 shadow-xl border-4 border-white" />
                        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-neutral-200 border-4 border-white rounded-2xl flex items-center justify-center font-bold text-neutral-600 shadow-lg text-xl">2</div>
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 tracking-tight">{topUsers[1].displayName}</h3>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-2">{topUsers[1].rank || 'Voyager'}</p>
                    <div className="mt-8 px-6 py-2 bg-neutral-100/50 rounded-2xl">
                        <span className="text-lg font-bold text-neutral-900 tabular-nums">{(topUsers[1].mass || 0).toLocaleString()} ⚛️</span>
                    </div>
                </div>
            )}

            {/* 1st Place */}
            {topUsers[0] && (
                <div className="order-1 md:order-2 bg-white p-12 rounded-[56px] border border-neutral-100 shadow-[0_20px_60px_rgb(0,0,0,0.08)] flex flex-col items-center text-center transform hover:-translate-y-4 transition-all z-20 cursor-pointer group" onClick={() => navigate(`/profile/${topUsers[0].id}`)}>
                    <div className="relative mb-10">
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-6xl animate-bounce-subtle">👑</div>
                        <img src={topUsers[0].photoURL || '/default-avatar.png'} className="w-40 h-40 rounded-[40px] object-cover bg-neutral-50 shadow-2xl border-4 border-white" />
                        <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-neutral-900 border-4 border-white rounded-[24px] flex items-center justify-center font-bold text-white shadow-2xl text-2xl">1</div>
                    </div>
                    <h3 className="text-4xl font-bold text-neutral-900 tracking-tight leading-none">{topUsers[0].displayName}</h3>
                    <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mt-4">Apex Voyager</p>
                    <div className="mt-8 px-10 py-4 bg-neutral-900 rounded-[32px] shadow-lg">
                        <span className="text-2xl font-bold text-white tabular-nums">{(topUsers[0].mass || 0).toLocaleString()} ⚛️</span>
                    </div>
                </div>
            )}

            {/* 3rd Place */}
            {topUsers[2] && (
                <div className="order-3 bg-white/60 backdrop-blur-3xl p-10 rounded-[48px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center transform hover:-translate-y-2 transition-all cursor-pointer group" onClick={() => navigate(`/profile/${topUsers[2].id}`)}>
                    <div className="relative mb-8">
                        <img src={topUsers[2].photoURL || '/default-avatar.png'} className="w-28 h-28 rounded-[32px] object-cover bg-neutral-100 shadow-xl border-4 border-white" />
                        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-neutral-100 border-4 border-white rounded-2xl flex items-center justify-center font-bold text-neutral-400 shadow-lg text-xl">3</div>
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 tracking-tight">{topUsers[2].displayName}</h3>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-2">{topUsers[2].rank || 'Voyager'}</p>
                    <div className="mt-8 px-6 py-2 bg-neutral-100/50 rounded-2xl">
                        <span className="text-lg font-bold text-neutral-900 tabular-nums">{(topUsers[2].mass || 0).toLocaleString()} ⚛️</span>
                    </div>
                </div>
            )}
        </div>

        {/* Extended List - Minimalist Rows */}
        <div className="bg-white/40 backdrop-blur-xl rounded-[64px] border border-white shadow-[0_32px_120px_rgb(0,0,0,0.06)] overflow-hidden">
            <div className="px-12 py-10 border-b border-neutral-100 flex justify-between items-center">
                <h2 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Active Entities</h2>
                <span className="text-[9px] font-bold text-neutral-900 uppercase tracking-widest bg-neutral-100 px-4 py-1.5 rounded-full">REALTIME_SYNC</span>
            </div>
            <div className="divide-y divide-neutral-100">
                {topUsers.length === 0 ? (
                    <div className="py-20">
                        <EmptyState 
                            icon="🏆"
                            title="No Rankings Yet"
                            description="The cosmos is quiet. Be the first to start gaining mass and claim your spot!"
                            action={{
                                label: "Explore Map",
                                onClick: () => navigate('/')
                            }}
                        />
                    </div>
                ) : topUsers.slice(3).map((user, index) => (
                    <div 
                        key={user.id} 
                        className="flex items-center justify-between px-12 py-10 transition-all hover:bg-neutral-50/50 cursor-pointer group animate-reveal-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => navigate(`/profile/${user.id}`)}
                    >
                        <div className="flex items-center gap-10">
                            <span className="text-xl font-bold text-neutral-200 w-10 tabular-nums">#{index + 4}</span>
                            <div className="relative shrink-0">
                                <img src={user.photoURL || '/default-avatar.png'} className="w-20 h-20 rounded-[28px] object-cover bg-neutral-100 border border-neutral-100 transition-all group-hover:scale-105" />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-4 border-white rounded-full" />
                            </div>
                            <div>
                                <h3 className="font-bold text-neutral-900 text-2xl tracking-tight group-hover:text-black transition-colors">{user.displayName}</h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">LVL {user.level || 1}</span>
                                    <span className="text-[10px] font-bold text-neutral-200 uppercase tracking-widest">Verified Seeker</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold text-neutral-900 tabular-nums tracking-tighter">{(user.mass || 0).toLocaleString()}</div>
                            <div className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest mt-1">Units</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Minimal Footer Hint */}
        <div className="mt-24 flex justify-center">
            <div className="bg-white/80 backdrop-blur-3xl px-12 py-8 rounded-[40px] border border-white shadow-xl flex items-center gap-8 group">
                 <div className="w-14 h-14 bg-neutral-950 rounded-2xl flex items-center justify-center text-3xl text-white">⚛️</div>
                 <div className="flex flex-col text-left">
                    <p className="text-xl font-bold text-neutral-900 tracking-tight">Expand your influence</p>
                    <p className="text-xs text-neutral-400 font-medium">Connect with others to increase your gravitational pull.</p>
                 </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
