import React, { useRef } from 'react'
import type { UserProfile } from '@/types/user'
import { useImpactStore } from '@stores/impactStore'

interface ShareStatsProps {
  profile: UserProfile
  onClose: () => void
}

const ShareStats: React.FC<ShareStatsProps> = ({ profile, onClose }) => {
  const { stats } = useImpactStore()
  const cardRef = useRef<HTMLDivElement>(null)

  const handleShare = async () => {
    const shareText = `🚀 My Gravity Study Stats!

🔥 ${stats.currentStreak} Day Streak
⏰ ${stats.totalHoursSaved.toFixed(1)} Hours Saved
✅ ${stats.totalQuestsCompleted} Quests Completed
⭐ ${(profile.mass || 0).toLocaleString()} XP

Join me on Gravity Study! 📚✨`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Gravity Study Stats',
          text: shareText,
        })
      } catch (err) {
        await navigator.clipboard.writeText(shareText)
        alert('Stats copied to clipboard!')
      }
    } else {
      await navigator.clipboard.writeText(shareText)
      alert('Stats copied to clipboard!')
    }
  }

  return (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/40 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
      style={{ position: 'fixed', height: '100vh', width: '100vw' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <h2 className="text-lg font-bold text-neutral-900">Share Your Stats</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-all"
          >
            <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stats Card Preview */}
        <div className="p-6">
          <div 
            ref={cardRef}
            className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-3xl p-8 text-white relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-indigo-400 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-8">
                <img
                  src={profile.photoURL || '/default-avatar.png'}
                  alt={profile.displayName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20"
                />
                <div>
                  <h3 className="font-bold text-xl">{profile.displayName}</h3>
                  <span className="text-xs text-white/60 uppercase tracking-widest">{profile.rank || 'Voyager'}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-orange-400">{stats.currentStreak}</span>
                  <span className="text-[10px] text-white/60 uppercase tracking-widest mt-1">Day Streak 🔥</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-emerald-400">{stats.totalHoursSaved.toFixed(1)}</span>
                  <span className="text-[10px] text-white/60 uppercase tracking-widest mt-1">Hours Saved</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-blue-400">{stats.totalQuestsCompleted}</span>
                  <span className="text-[10px] text-white/60 uppercase tracking-widest mt-1">Quests Done</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-purple-400">{(profile.mass || 0).toLocaleString()}</span>
                  <span className="text-[10px] text-white/60 uppercase tracking-widest mt-1">Total XP</span>
                </div>
              </div>

              {/* Branding */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-white/40 uppercase tracking-widest">Gravity Study</span>
                <span className="text-lg">🚀</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={handleShare}
            className="flex-1 py-4 bg-neutral-900 hover:bg-black text-white rounded-2xl font-bold text-sm transition-all active:scale-95"
          >
            📤 Share Stats
          </button>
          <button
            onClick={onClose}
            className="px-6 py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-2xl font-bold text-sm transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShareStats
