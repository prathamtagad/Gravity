import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
    }
    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  // Use a portal to render at document root
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 min-h-screen"
    >
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-gravity-dark/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content - Animate enter */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl ${sizeStyles[size]} w-full max-h-[90vh] overflow-y-auto transform transition-all animate-slide-in border border-white/20`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gravity-primary to-purple-600">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <span className="text-xl leading-none">&times;</span>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  )
}

export default Modal
