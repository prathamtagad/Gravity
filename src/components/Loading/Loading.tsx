import React from 'react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  message?: string
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  fullScreen = false,
  message,
}) => {
  const sizeStyles = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeStyles[size]} border-gray-200 border-t-gravity-primary rounded-full animate-spin`}
      />
      {message && (
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}

export default Loading

