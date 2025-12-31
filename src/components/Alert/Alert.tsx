import React, { useEffect } from 'react'

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose?: () => void
  autoClose?: number // milliseconds
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  message,
  onClose,
  autoClose,
}) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, autoClose)
      return () => clearTimeout(timer)
    }
  }, [autoClose, onClose])

  const typeStyles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg border shadow-lg ${typeStyles[type]} max-w-md animate-slide-in`}
    >
      <div className="flex items-center justify-between">
        <p className="font-medium">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-current opacity-70 hover:opacity-100"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export default Alert

