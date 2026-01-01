wimport React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'
import { useUserStore } from '@stores/userStore'
import { getUserProfile, followUser, unfollowUser, isFollowing } from '@services/firebase/dbService'
import type { UserProfile } from '@/types/user'
import Loading from '@components/Loading/Loading'
import Alert from '@components/Alert/Alert'

const PublicProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile: currentUserProfile } = useUserStore()
  const { user } = useAuthStore()
  
  const [targetProfile, setTargetProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  useEffect(() => {
    if (id) {
      if (id === user?.uid) {
        navigate('/profile')
        return
      }

      const fetchData = async () => {
        setLoading(true)
        try {
          const profile = await getUserProfile(id)
          setTargetProfile(profile)
          
          if (user) {
            const followingStatus = await isFollowing(user.uid, id)
            setFollowing(followingStatus)
          }
        } catch (error) {
          console.error('Error fetching public profile:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchData()
    }
  }, [id, user, navigate])

  const handleFollowToggle = async () => {
    if (!user || !id || actionLoading) return
    
    setActionLoading(true)
    try {
      if (following) {
        await unfollowUser(user.uid, id)
        setFollowing(false)
        if (targetProfile) setTargetProfile({ ...targetProfile, followersCount: Math.max(0, targetProfile.followersCount - 1) })
        setAlertMessage(`Unfollowed ${targetProfile?.displayName}`)
        setShowAlert(true)
      } else {
        await followUser(user.uid, id)
        setFollowing(true)
        if (targetProfile) setTargetProfile({ ...targetProfile, followersCount: (targetProfile.followersCount || 0) + 1 })
        setAlertMessage(`Following ${targetProfile?.displayName}!`)
        setShowAlert(true)
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <Loading fullScreen message="Reading data..." />
  if (!targetProfile) return (
    <div className="flex flex-col items-center justify-center h-screen bg-neutral-50 p-6 text-center">
      <h2 className="text-3xl font-bold text-neutral-900">Entity Not Found</h2>
      <p className="text-neutral-500 mt-4 max-w-sm">The profile you are looking for does not exist in the current sector.</p>
      <button onClick={() => navigate('/')} className="mt-10 px-10 py-4 bg-neutral-900 text-white rounded-[24px] font-bold text-[11px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">Go Home</button>
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-120px)] lg:min-h-[calc(100vh-80px)] bg-neutral-50 flex flex-col animate-reveal-up overflow-x-hidden relative">
      <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(99,102,241,0.02),transparent_30%)]" />
      </div>

      <div className="w-full flex-1 flex flex-col relative z-10 font-sans">
        <div className="max-w-7xl mx-auto w-full px-6 pt-12">
             <button 
                onClick={() => navigate(-1)}
                className="bg-white/40 hover:bg-white text-neutral-500 hover:text-neutral-900 p-4 rounded-2xl backdrop-blur-3xl border border-white/60 transition-all shadow-sm active:scale-95 group"
            >
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Back</span>
                </div>
            </button>
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 pt-16 pb-32">
            <div className="flex flex-col">
                
                <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-12">
                    <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                        <div className="relative">
                            <img
                                src={targetProfile.photoURL || '/default-avatar.png'}
                                alt={targetProfile.displayName}
                                className="w-48 h-48 rounded-[48px] object-cover bg-white shadow-[0_12px_40px_rgb(0,0,0,0.08)] border border-neutral-100"
                            />
                            {targetProfile.orbitStatus && (
                                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-neutral-50">
                                    <span className="text-3xl">🪐</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <h1 className="text-6xl md:text-7xl font-bold text-neutral-900 tracking-tighter leading-none">
                                {targetProfile.displayName}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 mt-8">
                                <span className="px-6 py-2 bg-neutral-900 text-white rounded-full text-[11px] font-bold uppercase tracking-widest leading-none">
                                    {targetProfile.rank || 'Voyager'}
                                </span>
                                <span className="text-sm font-medium text-neutral-400">Sector Registered</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleFollowToggle}
                            disabled={actionLoading}
                            className={`px-12 py-5 rounded-[28px] text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 ${following ? 'bg-white border border-neutral-200 text-neutral-400' : 'bg-neutral-900 text-white hover:bg-black'}`}
                        >
                            {following ? 'Following' : 'Follow Entity'}
                        </button>
                        <button
                            onClick={() => {
                                import('@stores/chatStore').then(({ useChatStore }) => {
                                    if (currentUserProfile) {
                                        useChatStore.getState().openChat(targetProfile, currentUserProfile)
                                        navigate('/messages')
                                    }
                                })
                            }}
                            className="p-5 rounded-[28px] bg-white border border-neutral-200 text-neutral-900 transition-all hover:bg-neutral-50 shadow-sm active:scale-95"
                            title="Send Message"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        </button>
                    </div>
                </div>

                <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-12 mt-24">
                    <div className="flex flex-col">
                        <span className="text-5xl font-bold text-neutral-900 tabular-nums leading-none">{(targetProfile.mass || 0).toLocaleString()}</span>
                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mt-4">Orbital Mass</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-5xl font-bold text-neutral-900 tabular-nums leading-none">LVL {targetProfile.level || 1}</span>
                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mt-4">Stellar Level</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-5xl font-bold text-neutral-900 tabular-nums leading-none">{targetProfile.followersCount || 0}</span>
                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mt-4">Founders</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-5xl font-bold text-neutral-900 tabular-nums leading-none">{targetProfile.followingCount || 0}</span>
                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mt-4">Orbiting</span>
                    </div>
                </div>

                <div className="w-full grid lg:grid-cols-12 gap-12 mt-24">
                    
                    <div className="lg:col-span-12 xl:col-span-8">
                        <div className="bg-white/50 backdrop-blur-2xl p-12 md:p-20 rounded-[56px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.4em] mb-10">Mission Directive</h3>
                            <p className="text-3xl md:text-4xl font-medium text-neutral-800 leading-tight tracking-tight">
                                {targetProfile.bio || "No biography signal detected from this voyager's frequency."}
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-12 xl:col-span-4">
                        <div className="bg-white p-16 rounded-[56px] border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] h-full flex flex-col justify-center">
                            <div className="flex justify-between items-end mb-5">
                                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Saturation</span>
                                <span className="text-xl font-bold text-neutral-900 tabular-nums">{(targetProfile.mass % 100)}%</span>
                            </div>
                            <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-neutral-950 transition-all duration-1000" 
                                    style={{ width: `${(targetProfile.mass % 100)}%` }}
                                />
                            </div>
                            <p className="text-sm font-medium text-neutral-500 mt-10 leading-relaxed">
                                Currently evolving through level {targetProfile.level || 1} of the continuum.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-6">
                        <div className="bg-white p-12 rounded-[56px] border border-neutral-100 shadow-sm h-full">
                            <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.5em] mb-12 flex items-center gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                                Proficiency
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {targetProfile.teachingSubjects?.map(s => (
                                    <span key={s} className="px-7 py-3.5 bg-neutral-50 text-neutral-800 rounded-3xl text-[12px] font-bold border border-neutral-100/50 uppercase tracking-wider">
                                        {s}
                                    </span>
                                )) || <p className="text-neutral-300 text-xs italic">Silent signal.</p>}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-6">
                        <div className="bg-white p-12 rounded-[56px] border border-neutral-100 shadow-sm h-full">
                            <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.5em] mb-12 flex items-center gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                                Acquisitions
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {targetProfile.learningSubjects?.map(s => (
                                    <span key={s} className="px-7 py-3.5 bg-neutral-50 text-neutral-800 rounded-3xl text-[12px] font-bold border border-neutral-100/50 uppercase tracking-wider">
                                        {s}
                                    </span>
                                )) || <p className="text-neutral-300 text-xs italic">Silent signal.</p>}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
      </div>

      {showAlert && (
        <Alert
          type="success"
          message={alertMessage}
          onClose={() => setShowAlert(false)}
          autoClose={3000}
        />
      )}
    </div>
  )
}

export default PublicProfile
