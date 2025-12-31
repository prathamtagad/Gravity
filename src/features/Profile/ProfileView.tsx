import React from 'react'
import type { UserProfile } from '@/types/user'

interface ProfileViewProps {
  profile: UserProfile
  onEdit: () => void
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onEdit }) => {
  return (
    <div className="w-full animate-reveal-up font-sans">
      {/* Aura Container */}
      <div className="max-w-7xl mx-auto w-full px-6 pt-20">
          <div className="flex flex-col items-center">
              
              {/* Profile Header - Minimalist */}
              <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-12">
                  <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                      <div className="relative">
                          <img
                              src={profile.photoURL || '/default-avatar.png'}
                              alt={profile.displayName}
                              className="w-44 h-44 rounded-[40px] object-cover bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-neutral-100"
                          />
                          {profile.orbitStatus && (
                              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-3 shadow-lg border border-neutral-50 flex items-center justify-center">
                                  <span className="text-2xl">🪐</span>
                              </div>
                          )}
                      </div>

                      <div className="flex flex-col">
                          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 tracking-tight leading-tight">
                              {profile.displayName}
                          </h1>
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                              <span className="px-5 py-1.5 bg-neutral-900 text-white rounded-full text-[11px] font-bold uppercase tracking-wider">
                                  {profile.rank || 'Voyager'}
                              </span>
                              <span className="text-sm font-medium text-neutral-400">
                                  {profile.email}
                              </span>
                          </div>
                      </div>
                  </div>

                  <button 
                      onClick={onEdit}
                      className="px-10 py-4 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95"
                  >
                      Edit Profile
                  </button>
              </div>

              {/* Stats Hub - Elegant Typography */}
              <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 mt-24">
                  <div className="flex flex-col">
                      <span className="text-4xl font-bold text-neutral-900 tabular-nums">{(profile.mass || 0).toLocaleString()}</span>
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mt-2">Orbital Mass</span>
                  </div>
                  <div className="flex flex-col">
                      <span className="text-4xl font-bold text-neutral-900 tabular-nums">LVL {profile.level || 1}</span>
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mt-2">Evolution Rank</span>
                  </div>
                  <div className="flex flex-col">
                      <span className="text-4xl font-bold text-neutral-900 tabular-nums">{profile.followersCount || 0}</span>
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mt-2">Founders Following</span>
                  </div>
                  <div className="flex flex-col">
                      <span className="text-4xl font-bold text-neutral-900 tabular-nums">{profile.followingCount || 0}</span>
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mt-2">Entities Orbiting</span>
                  </div>
              </div>

              {/* Information Grid - Clean Separation */}
              <div className="w-full grid lg:grid-cols-12 gap-12 mt-24">
                  
                  {/* Bio Area */}
                  <div className="lg:col-span-12 xl:col-span-8">
                      <div className="bg-white/40 backdrop-blur-xl p-12 md:p-16 rounded-[48px] border border-white shadow-sm">
                          <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-8">Biography</h3>
                          <p className="text-2xl md:text-3xl text-neutral-800 leading-relaxed font-medium">
                              {profile.bio || "This user's biography has not been shared yet."}
                          </p>
                      </div>
                  </div>

                  {/* Level Progress - Miniature */}
                  <div className="lg:col-span-12 xl:col-span-4">
                      <div className="bg-white p-12 rounded-[48px] border border-neutral-100 shadow-sm flex flex-col justify-center h-full">
                          <div className="flex justify-between items-end mb-4">
                              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Progress</span>
                              <span className="text-sm font-bold text-neutral-900">{(profile.mass % 100)}%</span>
                          </div>
                          <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                              <div 
                                  className="h-full bg-neutral-900 transition-all duration-1000" 
                                  style={{ width: `${(profile.mass % 100)}%` }}
                              />
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-6 leading-relaxed">
                              Collect <span className="text-neutral-900 font-bold">{100 - (profile.mass % 100)} more units</span> to reach level {(profile.level || 1) + 1}.
                          </p>
                      </div>
                  </div>

                  {/* Skills Section */}
                  <div className="lg:col-span-6">
                      <div className="bg-white p-12 rounded-[48px] border border-neutral-100 shadow-sm h-full">
                          <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-2">
                              <span>🎓</span> Proficiency Array
                          </h3>
                          <div className="flex flex-wrap gap-3">
                              {profile.teachingSubjects?.map(s => (
                                  <span key={s} className="px-6 py-3 bg-neutral-50 text-neutral-700 rounded-2xl text-[12px] font-semibold border border-neutral-100/50">
                                      {s}
                                  </span>
                              )) || <span className="text-neutral-300 text-xs italic">No proficiency signals found.</span>}
                          </div>
                      </div>
                  </div>

                  <div className="lg:col-span-6">
                      <div className="bg-white p-12 rounded-[48px] border border-neutral-100 shadow-sm h-full">
                          <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-2">
                              <span>🔭</span> Research Interests
                          </h3>
                          <div className="flex flex-wrap gap-3">
                              {profile.learningSubjects?.map(s => (
                                  <span key={s} className="px-6 py-3 bg-neutral-50 text-neutral-700 rounded-2xl text-[12px] font-semibold border border-neutral-100/50">
                                      {s}
                                  </span>
                              )) || <span className="text-neutral-300 text-xs italic">No research targets defined.</span>}
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
