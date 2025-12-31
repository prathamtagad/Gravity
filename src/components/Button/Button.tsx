import React from 'react'
import Loading from '../Loading/Loading'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  children,
  ...props
}) => {
  // Base classes that apply to all buttons
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  // Clean, flat variants
  const variants = {
    primary: 'bg-gravity-primary text-white hover:bg-violet-700 shadow-sm active:scale-[0.98] focus:ring-gravity-primary',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm active:scale-[0.98] focus:ring-gray-200',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm active:scale-[0.98] focus:ring-red-500',
  }

  // Size styles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-base rounded-xl',
    lg: 'px-6 py-3 text-lg rounded-xl',
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="mr-2">
          <Loading size="sm" />
        </div>
      ) : null}
      {children}
    </button>
  )
}

export default Button
