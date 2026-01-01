import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { auth } from './config'
import { Capacitor } from '@capacitor/core'

const googleProvider = new GoogleAuthProvider()

const isNativePlatform = () => {
  return Capacitor.isNativePlatform()
}

export const signInWithGoogle = async () => {
  try {
    if (isNativePlatform()) {
      await signInWithRedirect(auth, googleProvider)
      return null
    } else {
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    }
  } catch (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
}

export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth)
    if (result) {
      return result.user
    }
    return null
  } catch (error) {
    console.error('Error handling redirect result:', error)
    throw error
  }
}

export const signOut = async () => {
  try {
    await firebaseSignOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

