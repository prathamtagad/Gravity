import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@stores/authStore'
import { useUserStore } from '@stores/userStore'
import { useImpactStore } from '@stores/impactStore'
import { useDemoStore } from '@stores/demoStore'
import { createUserProfile } from '@services/firebase/dbService'
import ProfileForm from './ProfileForm'
import ProfileView from './ProfileView'
import Loading from '@components/Loading/Loading'

const Profile: React.FC = () => {
  const { user } = useAuthStore()
  const { profile, loadProfile } = useUserStore()
  const { stats, loadDemoStats } = useImpactStore()
  const { isDemoMode } = useDemoStore()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode) {
      loadDemoStats()
    }
  }, [isDemoMode, loadDemoStats])

  useEffect(() => {
    if (user) {
      loadProfile(user.uid).then(() => {
        setLoading(false)
      })
    }
  }, [user, loadProfile])

  useEffect(() => {
    if (user && !profile && !loading) {
      createUserProfile(user.uid, {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || undefined,
        subjects: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).then(() => {
        loadProfile(user.uid)
      })
    }
  }, [user, profile, loading, loadProfile])

  if (loading) {
    return <Loading fullScreen message="Loading profile..." />
  }

  if (!profile) {
    return <Loading fullScreen message="Creating profile..." />
  }

  return (
    <div className="min-h-[calc(100vh-120px)] lg:min-h-[calc(100vh-80px)] bg-neutral-50 dark:bg-neutral-900 flex flex-col animate-reveal-up overflow-x-hidden relative font-sans transition-colors duration-300">
      <div className="fixed inset-0 z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.03),transparent_40%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.1),transparent_40%)]" />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.03),transparent_40%)] dark:bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.1),transparent_40%)]" />
      </div>

      <div className="w-full flex-1 flex flex-col relative z-10 text-neutral-900 dark:text-white">
        {isEditing ? (
          <div className="max-w-5xl mx-auto w-full p-6 md:p-12 lg:p-16">
            <ProfileForm
              onSave={() => {
                setIsEditing(false)
                if (user) loadProfile(user.uid)
              }}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col">
            <ProfileView
              profile={profile}
              onEdit={() => setIsEditing(true)}
            />
            
            {/* Impact Metrics Dashboard */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 mt-8 sm:mt-12">
               <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-0.5 sm:p-1 rounded-[24px] sm:rounded-[48px] shadow-2xl">
                 <div className="bg-white dark:bg-neutral-900 p-4 sm:p-8 md:p-10 rounded-[22px] sm:rounded-[44px] overflow-hidden relative transition-colors duration-300">
                   <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
                     <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-base sm:text-xl shadow-lg">📊</div>
                     <div className="flex-1 min-w-0">
                       <h3 className="text-base sm:text-xl font-bold text-neutral-900 dark:text-white tracking-tight">Your Impact</h3>
                       <p className="text-[10px] sm:text-xs text-neutral-400 dark:text-neutral-500 font-medium">Powered by Gravity Study</p>
                     </div>
                     {isDemoMode && (
                       <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-widest rounded-full">Demo</span>
                     )}
                   </div>
                   
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
                     <div className="p-3 sm:p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl sm:rounded-3xl border border-green-100 dark:border-green-900/30">
                       <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 tabular-nums">{stats.hoursThisWeek}h</div>
                       <div className="text-[8px] sm:text-[10px] font-bold text-green-500 dark:text-green-500 uppercase tracking-widest mt-1">Saved This Week</div>
                     </div>
                     <div className="p-3 sm:p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl sm:rounded-3xl border border-blue-100 dark:border-blue-900/30">
                       <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">{stats.questsCompleted}</div>
                       <div className="text-[8px] sm:text-[10px] font-bold text-blue-500 dark:text-blue-500 uppercase tracking-widest mt-1">Quests Done</div>
                     </div>
                     <div className="p-3 sm:p-5 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl sm:rounded-3xl border border-orange-100 dark:border-orange-900/30">
                       <div className="flex items-baseline gap-1">
                         <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400 tabular-nums">{stats.currentStreak}</span>
                         <span className="text-sm sm:text-lg">🔥</span>
                       </div>
                       <div className="text-[8px] sm:text-[10px] font-bold text-orange-500 dark:text-orange-500 uppercase tracking-widest mt-1">Day Streak</div>
                     </div>
                     <div className="p-3 sm:p-5 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 rounded-2xl sm:rounded-3xl border border-purple-100 dark:border-purple-900/30">
                       <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 tabular-nums">{stats.gapsOptimized}</div>
                       <div className="text-[8px] sm:text-[10px] font-bold text-purple-500 dark:text-purple-500 uppercase tracking-widest mt-1">Gaps Optimized</div>
                     </div>
                   </div>

                   <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                     <div className="grid grid-cols-3 gap-4 text-center">
                       <div>
                         <div className="text-xl font-bold text-neutral-900 dark:text-white tabular-nums">{stats.totalHoursSaved}h</div>
                         <div className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Total Saved</div>
                       </div>
                       <div>
                         <div className="text-xl font-bold text-neutral-900 dark:text-white tabular-nums">{stats.totalQuestsCompleted}</div>
                         <div className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">All Quests</div>
                       </div>
                       <div>
                         <div className="text-xl font-bold text-neutral-900 dark:text-white tabular-nums">{stats.studyBuddiesConnected}</div>
                         <div className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Study Buddies</div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
            
            <div className="max-w-7xl mx-auto w-full px-6 mt-16">
               <div className="bg-white dark:bg-neutral-900 p-12 rounded-[56px] border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden relative group transition-colors duration-300">
                  <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:scale-175 transition-transform duration-1000 dark:opacity-10 dark:text-white">🚀</div>
                  
                  <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                      <div className="flex flex-col max-w-md">
                          <h3 className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.4em] mb-4">Current Directive</h3>
                          <h2 className="text-4xl font-bold text-neutral-900 dark:text-white tracking-tight leading-none mb-4">Cosmic Quests</h2>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">Complete daily study objectives to increase your gravitational pull.</p>
                      </div>
                      
                      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-[32px] border border-neutral-100 dark:border-neutral-700">
                             <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-widest">Orbit 5 Voyagers</span>
                                <span className="text-[10px] font-bold text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">+20 XP</span>
                             </div>
                             <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-neutral-950 dark:bg-white transition-all duration-1000" 
                                    style={{ width: `${Math.min((profile.followingCount / 5) * 100, 100)}%` }} 
                                />
                             </div>
                          </div>
                          <div className={`p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-[32px] border border-neutral-100 dark:border-neutral-700 ${profile.messageCount && profile.messageCount >= 10 ? 'opacity-60' : ''}`}>
                             <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-widest">Send 10 Messages</span>
                                <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">+10 XP</span>
                             </div>
                             <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-neutral-950 dark:bg-white transition-all duration-1000" 
                                    style={{ width: `${Math.min(((profile.messageCount || 0) / 10) * 100, 100)}%` }}
                                />
                             </div>
                          </div>
                      </div>
                  </div>
               </div>
            </div>

            <div className="max-w-7xl mx-auto w-full px-6 pb-20 mt-16">
               <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl p-8 md:p-12 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 border border-white dark:border-white/5 shadow-sm transition-colors duration-300">
                  <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-2xl">⚙️</div>
                      <div className="flex flex-col">
                         <h3 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">System Configuration</h3>
                         <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Manage localized continuum parameters</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        className="flex-1 md:flex-none justify-center text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors text-[11px] font-bold uppercase tracking-widest px-8 py-4 rounded-2xl border border-transparent hover:border-red-100 dark:hover:border-red-900/50 hover:bg-red-50/50 dark:hover:bg-red-900/20"
                        onClick={async () => {
                            const { clearAllCollisions } = await import('@services/firebase/admin');
                            await clearAllCollisions();
                            alert('Local data successfully reset.');
                        }}
                    >
                        Reset Local Data
                    </button>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
