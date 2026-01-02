import React from 'react'
import { getUniqueCampuses } from '@services/map/campusHotspots'

interface CampusFilterProps {
  selectedCampus: string | null
  onSelectCampus: (campus: string | null) => void
}

const CampusFilter: React.FC<CampusFilterProps> = ({ selectedCampus, onSelectCampus }) => {
  const campuses = getUniqueCampuses()

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-neutral-100 p-3 max-h-[300px] overflow-y-auto">
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-2 mb-2">Filter by Campus</p>
      
      <button
        onClick={() => onSelectCampus(null)}
        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
          selectedCampus === null
            ? 'bg-neutral-900 text-white'
            : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
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
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
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
