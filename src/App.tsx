import React, { useEffect } from 'react'
import ContinuumPopup from '@features/Continuum/ContinuumPopup'
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'
import { useUserStore } from '@stores/userStore'
import { useChatStore } from '@stores/chatStore'
import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary'
import Loading from '@components/Loading/Loading'
import Navigation from '@components/Navigation/Navigation'
import { useTimetableStore } from '@stores/timetableStore'
import { requestNotificationPermission, sendGapNotification } from '@services/notifications/notificationService'


const GravityMap = React.lazy(() => import('@features/GravityMap/GravityMap'))
const Profile = React.lazy(() => import('@features/Profile/Profile'))
const CollisionView = React.lazy(() => import('@features/CollisionView/CollisionView'))
const ChatPage = React.lazy(() => import('@features/Chat/ChatPage'))
const Login = React.lazy(() => import('@features/Auth/Login'))
const PublicProfile = React.lazy(() => import('@features/Profile/PublicProfile'))
const Leaderboard = React.lazy(() => import('@features/Leaderboard/Leaderboard'))

function AppContent() {
  const { user } = useAuthStore()
  const { activeConversationId } = useChatStore()
  const location = useLocation()

  const isMobileChat = activeConversationId && location.pathname === '/messages'
  
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {user && <Navigation />}
      {user && <ContinuumPopup />}
      <main className={`flex-1 ${user && !isMobileChat ? 'pb-20 lg:pb-0' : ''}`}>
        <React.Suspense fallback={<Loading />}>
          <Routes>
            <Route
              path="/login"
              element={user ? <Navigate to="/" replace /> : <Login />}
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <GravityMap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <PublicProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/collision/:id"
              element={
                <ProtectedRoute>
                  <CollisionView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </main>
    </div>
  )
}

function App() {
  const { user, loading, initializeAuth } = useAuthStore()
  const { loadProfile } = useUserStore()
  const { getCurrentGap } = useTimetableStore()

  useEffect(() => {
    initializeAuth()
    requestNotificationPermission()
  }, [initializeAuth])

  useEffect(() => {
    if (!user) return
    
    const checkGaps = () => {
      const gap = getCurrentGap()
      if (gap) {
        const storageKey = `notified-gap-${gap.id}`
        const alreadyNotified = sessionStorage.getItem(storageKey)
        
        if (!alreadyNotified) {
          sendGapNotification(gap.durationMinutes, gap.startTime)
          sessionStorage.setItem(storageKey, 'true')
        }
      }
    }

    const interval = setInterval(checkGaps, 60000)
    checkGaps() // Initial check

    return () => clearInterval(interval)
  }, [user, getCurrentGap])

  useEffect(() => {
    if (user) {
      loadProfile(user.uid)
    }
  }, [user, loadProfile])

  if (loading) {
    return <Loading fullScreen message="Loading Gravity Study..." />
  }

  return (
    <ErrorBoundary>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </ErrorBoundary>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <React.Suspense fallback={<Loading />}>
      <div className="animate-reveal-up w-full h-full"> 
        {children}
      </div>
    </React.Suspense>
  )
}

export default App
