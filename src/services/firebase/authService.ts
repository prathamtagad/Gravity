import {
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { auth } from './config'
import { Capacitor } from '@capacitor/core'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'

const googleProvider = new GoogleAuthProvider()

const initGoogleAuth = () => {
  if (Capacitor.isNativePlatform()) {
    GoogleAuth.initialize({
      clientId: '54480158682-p9jh7jamp4275sd07nilgodd4hajjmq5.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    })
  }
}

initGoogleAuth()

export const signInWithGoogle = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      const googleUser = await GoogleAuth.signIn()
      const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken)
      const result = await signInWithCredential(auth, credential)
      return result.user
    } else {
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    }
  } catch (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
}

export const signOut = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      await GoogleAuth.signOut()
    }
    await firebaseSignOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

