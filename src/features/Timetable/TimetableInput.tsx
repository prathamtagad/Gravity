import React, { useState } from 'react'
import { useTimetableStore } from '@stores/timetableStore'
import { DAYS, TIME_OPTIONS } from '@/types/timetable'
import type { TimeSlot } from '@/types/timetable'

interface TimetableInputProps {
  onClose: () => void
}

const TimetableInput: React.FC<TimetableInputProps> = ({ onClose }) => {
  const { timetable, detectedGaps, addClassSlot, removeClassSlot, detectGaps } = useTimetableStore()
  const [day, setDay] = useState<TimeSlot['day']>('Monday')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:30')
  const [className, setClassName] = useState('')

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

  const groupedByDay = DAYS.map(d => ({
    day: d,
    slots: timetable.filter(slot => slot.day === d).sort(
      (a, b) => a.startTime.localeCompare(b.startTime)
    )
  }))

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">My Timetable</h2>
            <p className="text-neutral-500 text-sm mt-1">Add your class schedule to detect free time gaps</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        <div className="p-6 border-b border-neutral-100 bg-neutral-50">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Add New Class</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <select
              value={day}
              onChange={(e) => setDay(e.target.value as TimeSlot['day'])}
              className="p-3 rounded-xl bg-white border border-neutral-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900"
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
    </div>
  )
}

export default TimetableInput
