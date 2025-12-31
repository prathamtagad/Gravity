import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'
import { useUserStore } from '@stores/userStore'
import { useChatStore } from '@stores/chatStore'
import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary'
import Loading from '@components/Loading/Loading'
import Navigation from '@components/Navigation/Navigation'

// Lazy load features for better performance
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

  // Check if we are in a mobile chat view
  const isMobileChat = activeConversationId && location.pathname === '/messages'
  
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {user && <Navigation />}
      <main className={`flex-1 ${user && !isMobileChat ? 'pb-20 lg:pb-0' : ''}`}>
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
      </main>
    </div>
  )
}

function App() {
  const { user, loading, initializeAuth } = useAuthStore()
  const { loadProfile } = useUserStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

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
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  )
}

// Protected Route Component
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

