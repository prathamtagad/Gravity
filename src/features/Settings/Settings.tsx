import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@stores/userStore'
import { useDemoStore } from '@stores/demoStore'
import { useThemeStore } from '@stores/themeStore'
import { signOut } from '@services/firebase/authService'

const Settings: React.FC = () => {
  const navigate = useNavigate()
  const { profile } = useUserStore()
  const { isDemoMode, toggleDemoMode } = useDemoStore()
  const { isDarkMode, toggleTheme } = useThemeStore()
  
  const [notifications, setNotifications] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [focusReminders, setFocusReminders] = useState(true)
  const [showOnMap, setShowOnMap] = useState(true)

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const SettingToggle = ({ 
    label, 
    description, 
    enabled, 
    onToggle 
  }: { 
    label: string
    description: string
    enabled: boolean
    onToggle: () => void 
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
      <div className="flex-1 pr-4">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">{label}</h3>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-12 h-7 rounded-full transition-colors ${
          enabled ? 'bg-neutral-900 dark:bg-neutral-200' : 'bg-neutral-200 dark:bg-neutral-700'
        }`}
      >
        <div
          className={`absolute top-1 w-5 h-5 bg-white dark:bg-neutral-900 rounded-full shadow-md transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )

  const SettingLink = ({ 
    icon, 
    label, 
    onClick,
    danger = false 
  }: { 
    icon: string
    label: string
    onClick: () => void
    danger?: boolean
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 py-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0 text-left active:bg-neutral-50 dark:active:bg-neutral-800 transition-colors ${
        danger ? 'text-red-500' : 'text-neutral-900 dark:text-neutral-100'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className={`font-medium text-sm ${danger ? 'text-red-500' : ''}`}>{label}</span>
      <svg className="w-5 h-5 text-neutral-300 dark:text-neutral-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )


  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-32 font-sans transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 px-4 py-6 sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center active:scale-95 transition-colors"
          >
            <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Settings</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Section */}
        {profile && (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm border border-neutral-100 dark:border-neutral-700 transition-colors">
            <div className="flex items-center gap-4">
              <img 
                src={profile.photoURL || '/default-avatar.png'} 
                alt={profile.displayName}
                className="w-16 h-16 rounded-2xl object-cover border border-neutral-100 dark:border-neutral-700"
              />
              <div className="flex-1">
                <h2 className="font-bold text-neutral-900 dark:text-white">{profile.displayName}</h2>
                <p className="text-sm text-neutral-400 dark:text-neutral-500">{profile.email}</p>
                <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium mt-1">Level {profile.level} • {profile.rank}</p>
              </div>
              <button 
                onClick={() => navigate('/profile')}
                className="px-4 py-2 bg-neutral-100 dark:bg-neutral-700 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-300 active:scale-95 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        )}

        {/* Notifications */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl px-4 shadow-sm border border-neutral-100 dark:border-neutral-700 transition-colors">
          <div className="py-3 border-b border-neutral-100 dark:border-neutral-700">
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Notifications</span>
          </div>
          <SettingToggle
            label="Push Notifications"
            description="Get notified about quests and study reminders"
            enabled={notifications}
            onToggle={() => setNotifications(!notifications)}
          />
          <SettingToggle
            label="Focus Reminders"
            description="Gentle nudges to start studying during gaps"
            enabled={focusReminders}
            onToggle={() => setFocusReminders(!focusReminders)}
          />
          <SettingToggle
            label="Sound Effects"
            description="Play sounds for achievements and timers"
            enabled={soundEnabled}
            onToggle={() => setSoundEnabled(!soundEnabled)}
          />
        </div>

        {/* Privacy */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl px-4 shadow-sm border border-neutral-100 dark:border-neutral-700 transition-colors">
          <div className="py-3 border-b border-neutral-100 dark:border-neutral-700">
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Privacy</span>
          </div>
          <SettingToggle
            label="Show on Campus Map"
            description="Allow nearby students to see your location"
            enabled={showOnMap}
            onToggle={() => setShowOnMap(!showOnMap)}
          />
        </div>

        {/* App Settings */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl px-4 shadow-sm border border-neutral-100 dark:border-neutral-700 transition-colors">
          <div className="py-3 border-b border-neutral-100 dark:border-neutral-700">
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">App</span>
          </div>
          <SettingToggle
            label="Demo Mode"
            description="Use sample data for testing features"
            enabled={isDemoMode}
            onToggle={toggleDemoMode}
          />
          <SettingToggle
            label="Dark Mode"
            description="Switch to dark theme"
            enabled={isDarkMode}
            onToggle={toggleTheme}
          />
        </div>

        {/* Account Actions */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl px-4 shadow-sm border border-neutral-100 dark:border-neutral-700 transition-colors">
          <div className="py-3 border-b border-neutral-100 dark:border-neutral-700">
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Account</span>
          </div>
          <SettingLink 
            icon="📊" 
            label="My Statistics" 
            onClick={() => navigate('/profile')} 
          />
          <SettingLink 
            icon="📅" 
            label="My Schedule" 
            onClick={() => navigate('/')} 
          />
          <SettingLink 
            icon="🏆" 
            label="Achievements" 
            onClick={() => navigate('/leaderboard')} 
          />
          <SettingLink 
            icon="📚" 
            label="Study History" 
            onClick={() => navigate('/profile')} 
          />
        </div>

        {/* Support */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl px-4 shadow-sm border border-neutral-100 dark:border-neutral-700 transition-colors">
          <div className="py-3 border-b border-neutral-100 dark:border-neutral-700">
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Support</span>
          </div>
          <SettingLink 
            icon="❓" 
            label="Help & FAQ" 
            onClick={() => window.open('https://github.com', '_blank')} 
          />
          <SettingLink 
            icon="💬" 
            label="Send Feedback" 
            onClick={() => window.open('mailto:support@gravitystudy.app', '_blank')} 
          />
          <SettingLink 
            icon="📜" 
            label="Terms of Service" 
            onClick={() => {}} 
          />
          <SettingLink 
            icon="🔒" 
            label="Privacy Policy" 
            onClick={() => {}} 
          />
        </div>

        {/* Sign Out */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl px-4 shadow-sm border border-neutral-100 dark:border-neutral-700 transition-colors">
          <SettingLink 
            icon="🚪" 
            label="Sign Out" 
            onClick={handleSignOut}
            danger
          />
        </div>

        {/* App Info */}
        <div className="text-center py-6">
          <p className="text-xs text-neutral-300 font-medium">Gravity Study v1.0.0</p>
          <p className="text-[10px] text-neutral-300 mt-1">Made with ❤️ By Team AKATSUKI</p>
        </div>
      </div>
    </div>
  )
}

export default Settings
