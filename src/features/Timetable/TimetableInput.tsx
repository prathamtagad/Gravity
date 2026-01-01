import React, { useState } from 'react'
import { useTimetableStore } from '@stores/timetableStore'
import { DAYS, TIME_OPTIONS } from '@/types/timetable'
import type { TimeSlot } from '@/types/timetable'

import { initiateGoogleLogin, fetchCalendarEvents } from '@/services/calendar/googleCalendarService'

interface TimetableInputProps {
  onClose: () => void
}

const TimetableInput: React.FC<TimetableInputProps> = ({ onClose }) => {
  const { timetable, detectedGaps, addClassSlot, removeClassSlot, detectGaps, loadDemoTimetable, importFromCSV } = useTimetableStore()
  const [day, setDay] = useState<TimeSlot['day']>('Monday')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:30')
  const [className, setClassName] = useState('')
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [loadingCalendar, setLoadingCalendar] = useState(false)

  const handleGoogleSync = async () => {
    setLoadingCalendar(true)
    try {
      const success = await initiateGoogleLogin()
      if (success) {
        const events = await fetchCalendarEvents()
        events.forEach(event => {
          addClassSlot({
            day: event.day,
            startTime: event.startTime,
            endTime: event.endTime,
            className: event.className
          })
        })
        setShowCalendarModal(false)
      }
    } catch (error) {
      console.error('Calendar sync failed:', error)
    } finally {
      setLoadingCalendar(false)
    }
  }

  const handleAddClass = () => {
    if (!className.trim()) return
    addClassSlot({
      day,
      startTime,
      endTime,
      className: className.trim()
    })
    setClassName('')
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      if (text) {
        const result = importFromCSV(text)
        if (result.success) {
           
        } else {
           console.error(result.error)
        }
      }
    }
    reader.readAsText(file)
  }

  const groupedByDay = DAYS.map(d => ({
    day: d,
    slots: timetable.filter(slot => slot.day === d).sort(
      (a, b) => a.startTime.localeCompare(b.startTime)
    )
  }))

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] rounded-[20px] sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col my-auto">
        <div className="p-4 sm:p-6 border-b border-neutral-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-neutral-900">My Timetable</h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-0.5 sm:mt-1">Add your class schedule to detect gaps</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors text-base sm:text-lg shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="px-4 sm:px-6 py-3 sm:pt-6 sm:pb-4 bg-gradient-to-r from-blue-50 via-white to-green-50 border-b border-neutral-100 shrink-0">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setShowCalendarModal(true)}
              className="w-full sm:w-auto sm:flex-none flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-white rounded-xl sm:rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-xs sm:text-sm font-bold text-neutral-700 group-hover:text-blue-600 transition-colors">Import from Google Calendar</span>
            </button>
            
            <button 
              onClick={() => document.getElementById('csv-upload')?.click()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-600 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 transition-all shadow-sm group"
            >
              <span className="text-lg">📄</span>
              <span className="group-hover:text-neutral-900">Upload CSV</span>
            </button>
            <input 
              id="csv-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />

            <span className="text-neutral-300 text-[10px] sm:text-xs font-bold uppercase tracking-widest hidden sm:block">or</span>
            <button
              onClick={() => {
                loadDemoTimetable()
                detectGaps()
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
            >
              <span>✨</span>
              <span>Load Demo Schedule</span>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-b border-neutral-100 bg-neutral-50 shrink-0">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Add New Class</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
            <select
              value={day}
              onChange={(e) => setDay(e.target.value as TimeSlot['day'])}
              className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              {DAYS.map(d => (
                <option key={d} value={d}>{d.slice(0, 3)}</option>
              ))}
            </select>

            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="p-3 rounded-xl bg-white border border-neutral-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              {TIME_OPTIONS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="p-3 rounded-xl bg-white border border-neutral-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              {TIME_OPTIONS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Subject name"
              className="p-3 rounded-xl bg-white border border-neutral-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900 col-span-2 md:col-span-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAddClass()}
            />

            <button
              onClick={handleAddClass}
              disabled={!className.trim()}
              className="p-3 bg-neutral-900 text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedByDay.map(({ day: d, slots }) => (
              <div key={d} className="bg-neutral-50 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">{d}</h4>
                {slots.length === 0 ? (
                  <p className="text-sm text-neutral-300 italic">No classes</p>
                ) : (
                  <div className="space-y-2">
                    {slots.map(slot => (
                      <div 
                        key={slot.id} 
                        className="bg-white p-3 rounded-xl border border-neutral-100 flex items-center justify-between group"
                      >
                        <div>
                          <p className="font-bold text-neutral-900 text-sm">{slot.className}</p>
                          <p className="text-xs text-neutral-400">{slot.startTime} - {slot.endTime}</p>
                        </div>
                        <button
                          onClick={() => removeClassSlot(slot.id)}
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 bg-red-100 text-red-500 rounded-full text-xs flex items-center justify-center hover:bg-red-200 transition-all"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {detectedGaps.length > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">⚡</span>
                <span className="text-sm font-bold text-green-700">{detectedGaps.length} Free Time Gaps Detected!</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {detectedGaps.map(gap => (
                  <span 
                    key={gap.id}
                    className="px-3 py-1.5 bg-white rounded-full text-xs font-bold text-green-700 border border-green-200"
                  >
                    {gap.day.slice(0, 3)} {gap.startTime}-{gap.endTime} ({gap.durationMinutes}m)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-neutral-100 flex gap-3">
          <button
            onClick={() => {
              detectGaps()
              onClose()
            }}
            className="flex-1 py-4 bg-neutral-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-black transition-colors"
          >
            Save & Close
          </button>
        </div>
      </div>

      {showCalendarModal && (
        <div className="fixed inset-0 z-[3000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-green-100 rounded-3xl flex items-center justify-center">
              <svg className="w-12 h-12" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">Sync with Google</h3>
            
            {loadingCalendar ? (
              <div className="py-8 space-y-4">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-neutral-500 text-sm">Connecting to Calendar...</p>
              </div>
            ) : (
                <>
                <p className="text-neutral-500 text-sm mb-6">
                  Connect your Google Calendar to automatically import your class schedule and detect gaps.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl text-left">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-neutral-600">Read-only access to events</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl text-left">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-neutral-600">Auto-convert to timetable</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                    <button
                      onClick={handleGoogleSync}
                      className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-black transition-colors"
                    >
                      Connect Account
                    </button>
                    <button
                      onClick={() => setShowCalendarModal(false)}
                      className="w-full py-4 text-neutral-400 font-bold text-xs uppercase tracking-widest hover:text-neutral-900 transition-colors"
                    >
                      Cancel
                    </button>
                </div>
                </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TimetableInput

