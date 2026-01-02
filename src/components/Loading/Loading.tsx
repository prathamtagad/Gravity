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
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }

  const orbitSizes = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Gravity-themed loader */}
      <div className="relative">
        {/* Outer orbit ring */}
        <div className={`${orbitSizes[size]} absolute inset-0 m-auto rounded-full border-2 border-dashed border-neutral-200 animate-[spin_8s_linear_infinite]`} />
        
        {/* Middle orbit ring */}
        <div className={`${sizeStyles[size]} absolute inset-0 m-auto rounded-full border-2 border-dashed border-neutral-300 animate-[spin_4s_linear_infinite_reverse]`} />
        
        {/* Center gravity core */}
        <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 shadow-lg flex items-center justify-center animate-pulse">
          <span className="text-white text-lg">🚀</span>
        </div>

        {/* Orbiting planets */}
        <div className={`${orbitSizes[size]} absolute inset-0 m-auto animate-[spin_3s_linear_infinite]`}>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50" />
        </div>
        <div className={`${orbitSizes[size]} absolute inset-0 m-auto animate-[spin_5s_linear_infinite_reverse]`}>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50" />
        </div>
      </div>

      {/* Message or default text */}
      {fullScreen && (
        <div className="text-center animate-pulse">
          <p className="text-neutral-600 font-medium text-sm">
            {message || 'Entering Gravity Field...'}
          </p>
        </div>
      )}
      {!fullScreen && message && (
        <p className="text-neutral-500 font-medium text-sm">{message}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-40 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-100 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Logo/Title */}
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Gravity</h1>
            <p className="text-neutral-400 text-sm font-medium uppercase tracking-widest mt-1">Study</p>
          </div>
          
          {spinner}

          {/* Loading tips */}
          <div className="mt-8 max-w-xs text-center">
            <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">
              💡 Optimizing your study gaps with AI
            </p>
          </div>
        </div>
      </div>
    )
  }

  return spinner
}

export default Loading
