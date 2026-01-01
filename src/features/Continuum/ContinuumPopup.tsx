
import React from 'react'
import { useUserStore } from '@stores/userStore'

const ContinuumPopup: React.FC = () => {
  const { activeQuest } = useUserStore()

  if (!activeQuest) return null

  return (
    <div className="fixed bottom-6 right-6 z-[4000] animate-slide-up">
      <div className="bg-neutral-900 text-white rounded-2xl p-4 shadow-2xl border border-neutral-800 w-80">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Continuum Handoff</span>
        </div>
        
        <h3 className="font-bold text-lg leading-none mb-1">{activeQuest.title}</h3>
        <p className="text-xs text-neutral-400 mb-4 truncate">{activeQuest.description}</p>
        
        <div className="flex gap-2">
            <button 
                className="flex-1 py-2 bg-white text-neutral-900 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                onClick={async () => {
                   const { profile, updateProfile } = useUserStore.getState()
                   if (profile && activeQuest) {
                       await updateProfile(profile.id, {
                           orbitStatus: 'Event Horizon',
                           eventHorizonEndTime: Date.now() + (activeQuest.duration * 60 * 1000)
                       })
                   }
                   useUserStore.getState().setActiveQuest(null)
                }}
            >
                Start Quest
            </button>
            <button 
                className="px-3 py-2 bg-neutral-800 text-neutral-400 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-neutral-700 transition-colors"
                onClick={() => useUserStore.getState().setActiveQuest(null)}
            >
                Dismiss
            </button>
        </div>
      </div>
    </div>
  )
}

export default ContinuumPopup
