import React from 'react'
import { signInWithGoogle } from '@services/firebase/authService'
import Loading from '@components/Loading/Loading'

const Login: React.FC = () => {
  const [loading, setLoading] = React.useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
    } catch (error) {
      console.error('Error signing in:', error)
      alert('Failed to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6 font-sans">
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-md w-full bg-white/60 backdrop-blur-3xl rounded-[64px] shadow-[0_32px_120px_rgb(0,0,0,0.06)] border border-white p-12 text-center relative z-10">
        <div className="w-24 h-24 mx-auto mb-10 shadow-2xl rounded-[28px] overflow-hidden group-hover:scale-105 transition-transform">
           <img src="/logo.png" alt="Gravity Logo" className="w-full h-full object-cover" />
        </div>
        
        <h1 className="text-4xl font-bold text-neutral-900 tracking-tight mb-4">Gravity</h1>
        <p className="text-neutral-400 font-medium mb-12">
          The ultimate study companion for local students.
        </p>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`
            w-full flex items-center justify-center gap-4 py-5 rounded-3xl font-bold transition-all shadow-lg active:scale-95 border border-neutral-100 mb-4
            ${loading ? 'bg-neutral-50 text-neutral-300 cursor-not-allowed' : 'bg-white text-neutral-900 hover:bg-neutral-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}
          `}
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <Loading size="sm" />
              <span className="text-xs uppercase tracking-widest">Processing...</span>
            </div>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Sign in with Google</span>
            </>
          )}
        </button>

        <p className="text-[10px] text-neutral-300 font-bold uppercase tracking-widest mt-12 leading-relaxed">
          By continuing, you agree to our <br/>Terms of Service & Privacy Protocol
        </p>
      </div>
    </div>
  )
}

export default Login
