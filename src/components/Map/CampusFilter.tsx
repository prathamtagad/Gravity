import React from 'react'
import { getUniqueCampuses } from '@services/map/campusHotspots'

interface CampusFilterProps {
  selectedCampus: string | null
  onSelectCampus: (campus: string | null) => void
}

const CampusFilter: React.FC<CampusFilterProps> = ({ selectedCampus, onSelectCampus }) => {
  const campuses = getUniqueCampuses()

  return (
    <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-800 p-3 max-h-[300px] overflow-y-auto">
      <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest px-2 mb-2">Filter by Campus</p>
      
      <button
        onClick={() => onSelectCampus(null)}
        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
          selectedCampus === null
            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
            : 'bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
        }`}
      >
        📍 All Campuses ({campuses.length})
      </button>

      <div className="mt-2 space-y-1">
        {campuses.map((campus) => (
          <button
            key={campus}
            onClick={() => onSelectCampus(campus)}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCampus === campus
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                : 'bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            🏫 {campus}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CampusFilter
