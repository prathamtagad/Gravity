import React from 'react'

interface ClusterMarkerProps {
  count: number
  onClick?: () => void
}

const ClusterMarker: React.FC<ClusterMarkerProps> = ({ count, onClick }) => {
  return (
    <div
      className="relative cursor-pointer transform hover:scale-110 transition-transform"
      onClick={onClick}
    >
      <div className="w-16 h-16 rounded-full bg-gravity-primary border-4 border-white shadow-lg flex items-center justify-center">
        <span className="text-white text-lg font-bold">{count}</span>
      </div>
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded">
        {count} students
      </div>
    </div>
  )
}

export default ClusterMarker

