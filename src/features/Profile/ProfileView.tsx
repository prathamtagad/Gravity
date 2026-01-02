import React, { useState } from 'react'
import type { UserProfile } from '@/types/user'
import { useImpactStore } from '@stores/impactStore'
import ShareStats from './ShareStats'

interface ProfileViewProps {
  profile: UserProfile
  onEdit: () => void
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onEdit }) => {
  const { stats } = useImpactStore()
  const [showShareStats, setShowShareStats] = useState(false)
  
  return (
    <div className="w-full animate-reveal-up font-sans">
      <div className="max-w-7xl mx-auto w-full px-6 pt-20">
          <div className="flex flex-col items-center">
              
              <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-12">
                  <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                      <div className="relative">
                          <img
                              src={profile.photoURL || '/default-avatar.png'}
                              alt={profile.displayName}
                              className="w-44 h-44 rounded-[40px] object-cover bg-white dark:bg-neutral-800 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border border-neutral-100 dark:border-neutral-700"
                          />
                          {profile.orbitStatus && (
                              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-neutral-800 rounded-2xl p-3 shadow-lg border border-neutral-50 dark:border-neutral-700 flex items-center justify-center">
                                  <span className="text-2xl">🪐</span>
                              </div>
                          )}
                      </div>

                      <div className="flex flex-col">
                          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white tracking-tight leading-tight">
                              {profile.displayName}
                          </h1>
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                              <span className="px-5 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                  {profile.rank || 'Voyager'}
                              </span>
                              <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
                                  {profile.email}
                              </span>
                          </div>
                      </div>
                  </div>

                  <div className="flex gap-3">
                      <button 
                          onClick={() => setShowShareStats(true)}
                          className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95"
                      >
                          📤 Share
                      </button>
                      <button 
                          onClick={onEdit}
                          className="px-10 py-4 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95"
                      >
                          Edit Profile
                      </button>
                      <button
                          onClick={() => window.location.hash = '#/settings'}
                          className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-2xl flex items-center justify-center transition-all shadow-sm active:scale-95"
                      >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                      </button>
                  </div>
              </div>

              {showShareStats && <ShareStats profile={profile} onClose={() => setShowShareStats(false)} />}

              <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 mt-24">
                  <div className="flex flex-col">
                      <span className="text-4xl font-bold text-neutral-900 dark:text-white tabular-nums">{(profile.mass || 0).toLocaleString()}</span>
                      <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-2">Orbital Mass</span>
                  </div>
                  <div className="flex flex-col">
                      <span className="text-4xl font-bold text-neutral-900 dark:text-white tabular-nums">LVL {profile.level || 1}</span>
                      <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-2">Evolution Rank</span>
                  </div>
                  <div className="flex flex-col">
                      <span className="text-4xl font-bold text-neutral-900 dark:text-white tabular-nums">{profile.followersCount || 0}</span>
                      <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-2">Founders Following</span>
                  </div>
                  <div className="flex flex-col">
                      <span className="text-4xl font-bold text-neutral-900 dark:text-white tabular-nums">{profile.followingCount || 0}</span>
                      <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-2">Entities Orbiting</span>
                  </div>
              </div>

              <div className="w-full grid lg:grid-cols-12 gap-12 mt-24">
                  
                  <div className="lg:col-span-12 xl:col-span-8">
                      <div className="bg-white/40 dark:bg-neutral-800/40 backdrop-blur-xl p-12 md:p-16 rounded-[48px] border border-white dark:border-neutral-700 shadow-sm transition-colors">
                          <h3 className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.3em] mb-8">Biography</h3>
                          <p className="text-2xl md:text-3xl text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                              {profile.bio || "This user's biography has not been shared yet."}
                          </p>
                      </div>
                  </div>

                  <div className="lg:col-span-12 xl:col-span-4">
                      <div className="bg-white dark:bg-neutral-800 p-12 rounded-[48px] border border-neutral-100 dark:border-neutral-700 shadow-sm flex flex-col justify-center h-full transition-colors">
                          <div className="flex justify-between items-end mb-4">
                              <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Progress</span>
                              <span className="text-sm font-bold text-neutral-900 dark:text-white">{(profile.mass % 100)}%</span>
                          </div>
                          <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                              <div 
                                  className="h-full bg-neutral-900 dark:bg-white transition-all duration-1000" 
                                  style={{ width: `${(profile.mass % 100)}%` }}
                              />
                          </div>
                          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-6 leading-relaxed">
                              Collect <span className="text-neutral-900 dark:text-white font-bold">{100 - (profile.mass % 100)} more units</span> to reach level {(profile.level || 1) + 1}.
                          </p>
                      </div>
                  </div>

                  <div className="lg:col-span-6">
                      <div className="bg-white dark:bg-neutral-800 p-12 rounded-[48px] border border-neutral-100 dark:border-neutral-700 shadow-sm h-full transition-colors">
                          <h3 className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.3em] mb-10 flex items-center gap-2">
                              <span>🎓</span> Proficiency Array
                          </h3>
                          <div className="flex flex-wrap gap-3">
                              {profile.teachingSubjects?.map(s => (
                                  <span key={s} className="px-6 py-3 bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-2xl text-[12px] font-semibold border border-neutral-100/50 dark:border-neutral-600/50">
                                      {s}
                                  </span>
                              )) || <span className="text-neutral-300 dark:text-neutral-600 text-xs italic">No proficiency signals found.</span>}
                          </div>
                      </div>
                  </div>

                  <div className="lg:col-span-6">
                      <div className="bg-white dark:bg-neutral-800 p-12 rounded-[48px] border border-neutral-100 dark:border-neutral-700 shadow-sm h-full transition-colors">
                          <h3 className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.3em] mb-10 flex items-center gap-2">
                              <span>🔭</span> Research Interests
                          </h3>
                          <div className="flex flex-wrap gap-3">
                              {profile.learningSubjects?.map(s => (
                                  <span key={s} className="px-6 py-3 bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-2xl text-[12px] font-semibold border border-neutral-100/50 dark:border-neutral-600/50">
                                      {s}
                                  </span>
                              )) || <span className="text-neutral-300 dark:text-neutral-600 text-xs italic">No research targets defined.</span>}
                          </div>
                      </div>
                  </div>

                  <div className="lg:col-span-12">
                      <div className="bg-gradient-to-r from-emerald-50 via-white to-blue-50 dark:from-emerald-900/20 dark:via-neutral-800 dark:to-blue-900/20 p-12 rounded-[48px] border border-emerald-100/50 dark:border-emerald-800/30 shadow-sm transition-colors">
                          <h3 className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-2">
                              <span>📊</span> Your Impact Metrics
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                  <span className="text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{stats.totalHoursSaved.toFixed(1)}</span>
                                  <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-2">Hours Saved</span>
                              </div>
                              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                  <span className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">{stats.totalQuestsCompleted}</span>
                                  <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-2">Quests Done</span>
                              </div>
                              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                  <span className="text-4xl md:text-5xl font-bold text-orange-500 dark:text-orange-400 tabular-nums">{stats.currentStreak}</span>
                                  <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-2">Day Streak 🔥</span>
                              </div>
                              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                  <span className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 tabular-nums">{stats.gapsOptimized}</span>
                                  <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-2">Gaps Optimized</span>
                              </div>
                          </div>
                          <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-700 flex flex-wrap items-center gap-4 text-xs text-neutral-400 dark:text-neutral-500">
                              <span>🎯 <strong className="text-neutral-600 dark:text-neutral-300">{stats.studyBuddiesConnected}</strong> Study Buddies</span>
                              <span>•</span>
                              <span>🏆 Longest Streak: <strong className="text-neutral-600 dark:text-neutral-300">{stats.longestStreak} days</strong></span>
                              <span>•</span>
                              <span>📅 This Week: <strong className="text-emerald-600 dark:text-emerald-400">{stats.hoursThisWeek}h</strong></span>
                          </div>
                      </div>
                  </div>

              </div>
          </div>
      </div>
    </div>
  )
}

export default ProfileView
