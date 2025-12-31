import { create } from 'zustand'
import type { StudySession } from '@/types/user'
import { createStudySession, updateStudySession } from '@services/firebase/dbService'

interface SessionState {
  activeSession: StudySession | null
  setActiveSession: (session: StudySession | null) => void
  startSession: (collisionId: string, participants: string[]) => Promise<string>
  endSession: (sessionId: string) => Promise<void>
}

export const useSessionStore = create<SessionState>((set) => ({
  activeSession: null,
  setActiveSession: (session) => set({ activeSession: session }),
  startSession: async (collisionId, participants) => {
    const now = Date.now()
    const sessionData = {
      collisionId,
      participants,
      startTime: now,
      duration: 15,
    }

    const sessionId = await createStudySession(sessionData)
    set({
      activeSession: { ...sessionData, id: sessionId },
    })

    return sessionId
  },
  endSession: async (sessionId) => {
    await updateStudySession(sessionId, { endTime: Date.now() })
    set({ activeSession: null })
  },
}))
