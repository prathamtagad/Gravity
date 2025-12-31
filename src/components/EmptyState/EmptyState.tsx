import React from 'react'

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-reveal-up">
      <div className="w-24 h-24 bg-neutral-50 rounded-[32px] flex items-center justify-center text-4xl mb-8 shadow-inner border border-neutral-100/50">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-neutral-900 tracking-tight mb-3">
        {title}
      </h3>
      <p className="text-sm text-neutral-400 font-medium max-w-[280px] leading-relaxed mb-10">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-8 py-4 bg-neutral-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-lg hover:bg-black active:scale-95 transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export default EmptyState
