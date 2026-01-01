
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
  const [showAiContext, setShowAiContext] = useState(false)
  const { setActiveQuest, updateProfile, profile } = useUserStore()

  const getTimeOfDay = (): string => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Morning'
    if (hour < 17) return 'Afternoon'
    return 'Evening'
  }

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

  const subjects = profile?.subjects || []

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-md max-h-[90vh] rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 shadow-2xl overflow-hidden relative flex flex-col my-auto">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 flex items-center justify-center bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors z-10"
        >
          ✕
        </button>

        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest rounded-full mb-2 sm:mb-3 shadow-lg">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span>Powered by Gemini 2.0</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Gap Navigator</h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1">AI-powered micro-quest generation</p>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* AI Context Panel */}
          <button
            onClick={() => setShowAiContext(!showAiContext)}
            className="w-full mb-3 sm:mb-4 p-2.5 sm:p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 text-left group hover:border-blue-200 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg">🤖</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-blue-600 uppercase tracking-widest">AI Context</span>
              </div>
              <svg className={`w-4 h-4 text-blue-400 transition-transform ${showAiContext ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <p className="text-[10px] sm:text-xs text-blue-500 mt-1">Click to see what Gemini AI is analyzing</p>
          </button>

          {showAiContext && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-neutral-900 rounded-xl sm:rounded-2xl text-white animate-fadeIn">
              <div className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 sm:mb-3">Gemini Analysis Context</div>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400"></span>
                  <span className="text-neutral-300">⏱️ Time:</span>
                  <span className="font-bold text-white">{time} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400"></span>
                  <span className="text-neutral-300">🌅 Period:</span>
                  <span className="font-bold text-white">{getTimeOfDay()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-400"></span>
                  <span className="text-neutral-300">📚 Subjects:</span>
                  <span className="font-bold text-white truncate">{subjects.length > 0 ? subjects.slice(0, 2).join(', ') : 'General'}</span>
                </div>
              </div>
            </div>
          )}

          {currentGap && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl border border-green-100">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg">⚡</span>
                <span className="text-xs sm:text-sm font-bold text-green-700">
                  You're in a {currentGap.durationMinutes}min gap!
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-green-600 mt-1">
                {currentGap.day} {currentGap.startTime} - {currentGap.endTime}
              </p>
            </div>
          )}

          {detectedGaps.length > 0 && !currentGap && (
            <div className="mb-4 sm:mb-6 p-2.5 sm:p-3 bg-neutral-50 rounded-xl border border-neutral-100">
              <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                {detectedGaps.length} gaps in your schedule
              </span>
            </div>
          )}

          {quests.length === 0 ? (
            <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
              <div className="flex flex-col items-center">
                <div className="text-5xl sm:text-6xl font-bold text-neutral-900 mb-2">{time}</div>
                <div className="text-neutral-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Minutes Available</div>
                <input 
                  type="range" 
                  min="5" 
                  max="120" 
                  step="5" 
                  value={time}
                  onChange={(e) => setTime(Number(e.target.value))}
                  className="w-full mt-6 sm:mt-8 accent-neutral-900 h-2 bg-neutral-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <button
                onClick={handleOptimize}
                disabled={loading}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2 sm:gap-3 shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Gemini thinking...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    <span>Generate AI Quests</span>
                  </>
                )}
              </button>

              {loading && (
                <div className="text-center animate-pulse">
                  <p className="text-[10px] sm:text-xs text-neutral-400">
                    Analyzing context with Gemini 2.0 Flash...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[9px] sm:text-[10px] font-bold text-green-600 uppercase tracking-widest">
                  {quests.length} AI-Generated Quests
                </span>
              </div>
              {quests.map((quest) => (
                <div 
                  key={quest.id}
                  onClick={() => handleStartQuest(quest)}
                  className="group p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-neutral-100 bg-neutral-50 hover:bg-white hover:border-neutral-200 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 group-hover:w-1.5 transition-all" />
                  <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                     <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-neutral-400 group-hover:text-blue-500 transition-colors">
                       {quest.category} • {quest.duration}m
                     </span>
                     <span className="text-[9px] sm:text-[10px] font-bold bg-yellow-100 text-yellow-700 px-1.5 sm:px-2 py-0.5 rounded-full">
                       +{quest.xpReward} XP
                     </span>
                  </div>
                  <h3 className="font-bold text-neutral-900 text-base sm:text-lg mb-1">{quest.title}</h3>
                  <p className="text-xs sm:text-sm text-neutral-500 leading-snug">{quest.description}</p>
                  {quest.googleTool && (
                     <div className="mt-2 sm:mt-3 flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-lg w-fit">
                       <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                         <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                         <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                         <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                       </svg>
                       <span>Uses {quest.googleTool}</span>
                     </div>
                  )}
                </div>
              ))}
              <button 
                onClick={() => setQuests([])}
                className="w-full py-2.5 sm:py-3 text-neutral-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:text-neutral-900 transition-colors"
              >
                ← Adjust Time
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GapNavigator
