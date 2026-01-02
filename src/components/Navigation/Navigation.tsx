import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useUserStore } from '@stores/userStore'
import { useChatStore } from '@stores/chatStore'
import { useDemoStore } from '@stores/demoStore'
import { useTimetableStore } from '@stores/timetableStore'
import { useMapStore } from '@stores/mapStore'
import { useImpactStore } from '@stores/impactStore'
import { signOut } from '@services/firebase/authService'

const Navigation: React.FC = () => {
  const { profile } = useUserStore()
  const { activeConversationId } = useChatStore()
  const { isDemoMode, toggleDemoMode } = useDemoStore()
  const { loadDemoTimetable, clearTimetable } = useTimetableStore()
  const { loadDemoUsers, clearDemoUsers } = useMapStore()
  const { loadDemoStats } = useImpactStore()
  const location = useLocation()
  const navigate = useNavigate()

  const handleDemoToggle = () => {
    if (!isDemoMode) {
      loadDemoTimetable()
      loadDemoUsers()
      loadDemoStats()
    } else {
      clearTimetable()
      clearDemoUsers()
    }
    toggleDemoMode()
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const isActive = (path: string) => location.pathname === path

  const isMobileChat = activeConversationId && location.pathname === '/messages'

  const navLinks = [
    { 
      path: '/', 
      label: 'Map', 
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 transition-all ${active ? 'fill-neutral-900 dark:fill-white' : 'stroke-neutral-400 dark:stroke-neutral-600 fill-none'}`} viewBox="0 0 24 24" strokeWidth={active ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-10.125V15M3.375 3h17.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125H3.375c-.621 0-1.125-.504-1.125-1.125V4.125C2.25 3.504 2.754 3 3.375 3zm0 14.25h17.25a1.125 1.125 0 011.125 1.125V21h-19.5v-2.625c0-.621.504-1.125 1.125-1.125z" />
        </svg>
      )
    },
    { 
      path: '/leaderboard', 
      label: 'Ranks', 
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 transition-all ${active ? 'fill-neutral-900 dark:fill-white stroke-neutral-900 dark:stroke-white' : 'stroke-neutral-400 dark:stroke-neutral-600 fill-none'}`} viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-2.25c-.621 0-1.125.504-1.125 1.125v3.375m9 0h-9M15 12V4.5m-6 7.5V4.5M10.5 4.5V3a1.125 1.125 0 011.125-1.125h.75A1.125 1.125 0 0113.5 3v1.5m-6 0h9" />
        </svg>
      )
    },
    { 
      path: '/booster', 
      label: 'Boost', 
      icon: (active: boolean) => (
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${active ? 'bg-neutral-900 dark:bg-white shadow-xl scale-110' : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}>
          <span className={`text-xl ${active ? 'grayscale-0' : 'grayscale opacity-70'}`}>⚛️</span>
        </div>
      )
    },
    { 
      path: '/messages', 
      label: 'Inbox', 
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 transition-all ${active ? 'fill-neutral-900 dark:fill-white' : 'stroke-neutral-400 dark:stroke-neutral-600 fill-none'}`} viewBox="0 0 24 24" strokeWidth={active ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.37.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      )
    },
    { 
      path: '/profile', 
      label: 'Me', 
      icon: (active: boolean) => (
        <div className={`w-6 h-6 rounded-lg overflow-hidden border-2 transition-all ${active ? 'border-neutral-900 dark:border-white scale-110' : 'border-transparent'}`}>
            <img src={profile?.photoURL || '/default-avatar.png'} className="w-full h-full object-cover" alt="Profile" />
        </div>
      )
    },
  ]

  return (
    <>
      {/* Desktop Navigation - Top Bar */}
      <nav className="hidden lg:block sticky top-0 left-0 right-0 z-[1100] w-full bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-b border-neutral-100 dark:border-neutral-800 shadow-sm font-sans transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform border border-neutral-100 dark:border-neutral-800">
               <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight leading-none">GRAVITY</span>
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest leading-none mt-1">Study Companion</span>
            </div>
          </Link>

          <div className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-900 p-1.5 rounded-[24px] border border-neutral-100 dark:border-neutral-800 transition-colors">
            {navLinks.filter(l => l.path !== '/booster').map((link) => (
               <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-6 py-2.5 rounded-[18px] text-[11px] font-bold uppercase tracking-widest transition-all ${
                  isActive(link.path)
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm border border-neutral-100 dark:border-neutral-700'
                    : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={handleDemoToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                isDemoMode
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              <span>{isDemoMode ? '✨' : '🎭'}</span>
              <span>{isDemoMode ? 'Demo Active' : 'Demo Mode'}</span>
            </button>
            <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-neutral-900 dark:text-white">{profile?.displayName}</span>
                <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] mt-1">XP {profile?.mass || 0}</span>
            </div>
            <button onClick={handleSignOut} className="p-3 text-neutral-300 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white transition-colors">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                 </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Top Header - Hide when in Chat */}
      {/* Mobile Top Header - Hide when in Chat */}
      {!isMobileChat && (
        <header className="lg:hidden sticky top-0 left-0 right-0 z-[1100] w-full h-14 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-neutral-50 dark:border-neutral-800 flex items-center justify-between px-5 font-sans transition-colors duration-300">
            <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
            <span className="text-lg font-black text-neutral-900 dark:text-white tracking-tighter">Gravity</span>
            </div>
            
            <div className="flex items-center gap-2">
            <button
              onClick={handleDemoToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${
                isDemoMode
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500'
              }`}
            >
              <span>{isDemoMode ? '✨' : '🎭'}</span>
              <span>{isDemoMode ? 'Demo' : 'Demo'}</span>
            </button>
            <button onClick={() => navigate('/messages')} className="p-2 text-neutral-800 dark:text-neutral-200 relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black" />
            </button>
            </div>
        </header>
      )}

      {/* Mobile Bottom Navigation Bar - Hide when in Chat */}
      {!isMobileChat && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[1100] h-16 bg-white/95 dark:bg-black/95 backdrop-blur-3xl border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-around px-2 pb-safe font-sans shadow-[0_-1px_10px_rgba(0,0,0,0.02)] dark:shadow-none transition-colors duration-300">
            {navLinks.map((link) => (
            <Link
                key={link.path}
                to={link.path}
                className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
                {link.icon(isActive(link.path))}
                <span className={`text-[8px] font-bold uppercase tracking-widest mt-1.5 transition-all ${isActive(link.path) ? 'text-neutral-900 dark:text-white opacity-100' : 'text-neutral-300 dark:text-neutral-600 opacity-0'}`}>
                {link.label}
                </span>
                {isActive(link.path) && link.path !== '/booster' && (
                <div className="absolute -top-1 w-1 h-1 bg-neutral-900 dark:bg-white rounded-full" />
                )}
            </Link>
            ))}
        </nav>
      )}
    </>
  )
}

export default Navigation
