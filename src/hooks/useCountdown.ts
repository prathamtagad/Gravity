import { useState, useEffect, useRef } from 'react'

interface UseCountdownOptions {
  initialMinutes: number
  onComplete?: () => void
  autoStart?: boolean
}

export const useCountdown = ({
  initialMinutes,
  onComplete,
  autoStart = true,
}: UseCountdownOptions) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60)
  const [isRunning, setIsRunning] = useState(autoStart)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            if (onComplete) {
              onComplete()
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, onComplete])

  const start = () => setIsRunning(true)
  const pause = () => setIsRunning(false)
  const reset = () => {
    setTimeLeft(initialMinutes * 60)
    setIsRunning(autoStart)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = ((initialMinutes * 60 - timeLeft) / (initialMinutes * 60)) * 100

  return {
    timeLeft,
    minutes,
    seconds,
    progress,
    isRunning,
    start,
    pause,
    reset,
  }
}
