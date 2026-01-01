
import React, { useState, useEffect } from 'react'
import { generateGapActivities, QuestActivity } from '@services/ai/geminiService'
import { useUserStore } from '@stores/userStore'
import { useTimetableStore } from '@stores/timetableStore'

interface GapNavigatorProps {
  onClose: () => void
}

const GapNavigator: React.FC<GapNavigatorProps> = ({ onClose }) => {
  const { detectedGaps, getCurrentGap, currentGap } = useTimetableStore()
  const [time, setTime] = useState(30)
  const [loading, setLoading] = useState(false)
  const [quests, setQuests] = useState<QuestActivity[]>([])
  const { setActiveQuest, updateProfile, profile } = useUserStore()

  useEffect(() => {
    const gap = getCurrentGap()
    if (gap) {
      setTime(Math.min(gap.durationMinutes, 120))
    } else if (detectedGaps.length > 0) {
      setTime(Math.min(detectedGaps[0].durationMinutes, 120))
    }
  }, [detectedGaps, getCurrentGap])

  const handleOptimize = async () => {
    setLoading(true)
    try {
      const subjects = profile?.subjects || []
      const results = await generateGapActivities(time, subjects)
      setQuests(results)
    } finally {
      setLoading(false)
    }
  }

  const handleStartQuest = async (quest: QuestActivity) => {
    setActiveQuest(quest)
    if (profile) {
      await updateProfile(profile.id, {
          orbitStatus: 'Event Horizon',
          eventHorizonEndTime: Date.now() + (quest.duration * 60 * 1000)
      })
    }
    onClose()
  }

  return (
    <div className="absolute inset-0 z-[2000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-2">
            powered by Gemini
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">Gap Navigator</h2>
          <p className="text-neutral-500 text-sm mt-1">Transform downtime into progress</p>
        </div>

        {currentGap && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <span className="text-sm font-bold text-green-700">
                You're in a {currentGap.durationMinutes}min gap right now!
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              {currentGap.day} {currentGap.startTime} - {currentGap.endTime}
            </p>
          </div>
        )}

        {detectedGaps.length > 0 && !currentGap && (
          <div className="mb-6 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              {detectedGaps.length} gaps in your schedule
            </span>
          </div>
        )}

        {quests.length === 0 ? (
          <div className="space-y-8 py-4">
            <div className="flex flex-col items-center">
              <div className="text-6xl font-bold text-neutral-900 mb-2">{time}</div>
              <div className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Minutes Available</div>
              <input 
                type="range" 
                min="5" 
                max="120" 
                step="5" 
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
                className="w-full mt-8 accent-neutral-900 h-2 bg-neutral-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <button
              onClick={handleOptimize}
              disabled={loading}
              className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin text-lg">✦</span> Generating...
                </>
              ) : (
                <>
                  <span>✨ Optimize my Gap</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {quests.map((quest) => (
              <div 
                key={quest.id}
                onClick={() => handleStartQuest(quest)}
                className="group p-4 rounded-2xl border border-neutral-100 bg-neutral-50 hover:bg-white hover:border-neutral-200 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-neutral-200 group-hover:bg-blue-500 transition-colors" />
                <div className="flex justify-between items-start mb-2">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 group-hover:text-blue-500 transition-colors">
                     {quest.category} • {quest.duration}m
                   </span>
                   <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                     +{quest.xpReward} XP
                   </span>
                </div>
                <h3 className="font-bold text-neutral-900 text-lg mb-1">{quest.title}</h3>
                <p className="text-sm text-neutral-500 leading-snug">{quest.description}</p>
                {quest.googleTool && (
                   <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-neutral-400">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                     Uses {quest.googleTool}
                   </div>
                )}
              </div>
            ))}
            <button 
              onClick={() => setQuests([])}
              className="w-full py-3 text-neutral-400 text-xs font-bold uppercase tracking-widest hover:text-neutral-900 transition-colors"
            >
              Adjust Time
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default GapNavigator
