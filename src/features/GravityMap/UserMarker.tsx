import React from 'react' 
import type { UserProfile } from '@/types/user'

interface UserMarkerProps {
  user: UserProfile
  onClick?: () => void
}

const UserMarker: React.FC<UserMarkerProps> = ({ user, onClick }) => {
  const getStatusColor = (status?: string) => {
    const colors: Record<string, string> = {
      'Reviewing Calculus': 'bg-blue-500',
      'Studying Physics': 'bg-purple-500',
      'Working on Chemistry': 'bg-green-500',
      'Reading History': 'bg-yellow-500',
      'Writing Essay': 'bg-pink-500',
      'Preparing for Exam': 'bg-red-500',
      'Group Study': 'bg-indigo-500',
      'Focused Work': 'bg-gray-500',
      'Available': 'bg-teal-500',
    }
    return colors[status || ''] || 'bg-gray-400'
  }

  if (!user.location) return null

  return (
    <div
      className="relative cursor-pointer transform hover:scale-110 transition-transform"
      onClick={onClick}
    >
      <div
        className={`w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${getStatusColor(
          typeof user.orbitStatus === 'string' ? user.orbitStatus : (user.orbitStatus as any)?.label
        )}`}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-white text-lg font-bold">
            {user.displayName.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      {user.orbitStatus && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          {user.displayName} - {typeof user.orbitStatus === 'string' ? user.orbitStatus : (user.orbitStatus as any)?.label}
        </div>
      )}
    </div>
  )
}

export default UserMarker

