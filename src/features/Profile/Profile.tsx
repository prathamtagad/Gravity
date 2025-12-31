import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@stores/authStore'
import { useUserStore } from '@stores/userStore'
import { createUserProfile } from '@services/firebase/dbService'
import ProfileForm from './ProfileForm'
import ProfileView from './ProfileView'
import Loading from '@components/Loading/Loading'

const Profile: React.FC = () => {
  const { user } = useAuthStore()
  const { profile, loadProfile, setProfile } = useUserStore()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadProfile(user.uid).then(() => {
        setLoading(false)
      })
    }
  }, [user, loadProfile])

  useEffect(() => {
    if (user && !profile && !loading) {
      // Create initial profile if it doesn't exist
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
    <div className="min-h-[calc(100vh-120px)] lg:min-h-[calc(100vh-80px)] bg-neutral-50 flex flex-col animate-reveal-up overflow-x-hidden relative font-sans">
      {/* Soft Aura Gradient Layer */}
      <div className="fixed inset-0 z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.03),transparent_40%)]" />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.03),transparent_40%)]" />
      </div>

      <div className="w-full flex-1 flex flex-col relative z-10">
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
            
            {/* Cosmic Quests - Gamification Module */}
            <div className="max-w-7xl mx-auto w-full px-6 mt-16">
               <div className="bg-white p-12 rounded-[56px] border border-neutral-100 shadow-sm overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:scale-175 transition-transform duration-1000">🚀</div>
                  
                  <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                      <div className="flex flex-col max-w-md">
                          <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.4em] mb-4">Current Directive</h3>
                          <h2 className="text-4xl font-bold text-neutral-900 tracking-tight leading-none mb-4">Cosmic Quests</h2>
                          <p className="text-sm text-neutral-500 font-medium">Complete daily study objectives to increase your gravitational pull.</p>
                      </div>
                      
                      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-6 bg-neutral-50 rounded-[32px] border border-neutral-100">
                             <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-neutral-900 uppercase tracking-widest">Orbit 5 Voyagers</span>
                                <span className="text-[10px] font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full">+20 XP</span>
                             </div>
                             <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-neutral-950 transition-all duration-1000" 
                                    style={{ width: `${Math.min((profile.followingCount / 5) * 100, 100)}%` }} 
                                />
                             </div>
                          </div>
                          <div className={`p-6 bg-neutral-50 rounded-[32px] border border-neutral-100 ${profile.messageCount && profile.messageCount >= 10 ? 'opacity-60' : ''}`}>
                             <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-neutral-900 uppercase tracking-widest">Send 10 Messages</span>
                                <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">+10 XP</span>
                             </div>
                             <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-neutral-950 transition-all duration-1000" 
                                    style={{ width: `${Math.min(((profile.messageCount || 0) / 10) * 100, 100)}%` }}
                                />
                             </div>
                          </div>
                      </div>
                  </div>
               </div>
            </div>

            {/* System Settings Footer */}
            <div className="max-w-7xl mx-auto w-full px-6 pb-20 mt-16">
               <div className="bg-white/40 backdrop-blur-xl p-8 md:p-12 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 border border-white shadow-sm">
                  <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-2xl">⚙️</div>
                      <div className="flex flex-col">
                         <h3 className="text-xl font-bold text-neutral-900 tracking-tight">System Configuration</h3>
                         <p className="text-xs text-neutral-400 font-medium">Manage localized continuum parameters</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        className="flex-1 md:flex-none justify-center text-neutral-400 hover:text-red-500 transition-colors text-[11px] font-bold uppercase tracking-widest px-8 py-4 rounded-2xl border border-transparent hover:border-red-100 hover:bg-red-50/50"
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

