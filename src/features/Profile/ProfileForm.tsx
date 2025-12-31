import React, { useState } from 'react'
import { useUserStore } from '@stores/userStore'
import { uploadProfileImage } from '@services/firebase/storageService'
import Alert from '@components/Alert/Alert'

interface ProfileFormProps {
  onSave?: () => void
  onCancel?: () => void
}

const COMMON_SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 
  'History', 'English', 'Computer Science', 'Engineering', 
  'Business', 'Psychology'
]

const ProfileForm: React.FC<ProfileFormProps> = ({ onSave, onCancel }) => {
  const { profile, updateProfile } = useUserStore()
  const [displayName, setDisplayName] = useState(profile?.displayName || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [subjects, setSubjects] = useState<string[]>(profile?.subjects || [])
  const [teachingSubjects, setTeachingSubjects] = useState<string[]>(profile?.teachingSubjects || [])
  const [learningSubjects, setLearningSubjects] = useState<string[]>(profile?.learningSubjects || [])
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    profile?.photoURL || null
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [isAddingSubject, setIsAddingSubject] = useState(false)
  const [customSubject, setCustomSubject] = useState('')

  const handleSubjectToggle = (subject: string) => {
    setSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    )
  }

  const handleAddCustomSubject = (e: React.FormEvent) => {
    e.preventDefault()
    if (customSubject.trim() && !subjects.includes(customSubject.trim())) {
      setSubjects([...subjects, customSubject.trim()])
      setCustomSubject('')
      setIsAddingSubject(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      if (file.size > 1024 * 1024) {
        setError('Image size must be less than 1MB')
      }
      setPhotoFile(file)
      setError(null)
      const reader = new FileReader()
      reader.onloadend = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setLoading(true)
    try {
      let photoURL = profile.photoURL
      if (photoFile) {
        photoURL = await uploadProfileImage(profile.id, photoFile)
      }
      await updateProfile(profile.id, { 
        displayName, 
        bio, 
        subjects, 
        teachingSubjects, 
        learningSubjects, 
        photoURL 
      })
      if (onSave) onSave()
      setError(null)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/40 backdrop-blur-3xl rounded-[64px] shadow-[0_32px_120px_rgb(0,0,0,0.08)] border border-white p-4 animate-reveal-up relative font-sans overflow-hidden">
      <div className="px-12 pb-20 pt-16">
        <div className="flex flex-col md:flex-row items-center gap-10 mb-20">
          <div className="relative group cursor-pointer shrink-0">
            <img
              src={photoPreview || '/default-avatar.png'}
              alt="Profile"
              className="w-48 h-48 rounded-[48px] border-4 border-white shadow-xl object-cover bg-neutral-50 relative z-10 transition-all group-hover:scale-105"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-white/60 text-neutral-900 rounded-[48px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20 backdrop-blur-md">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">📸</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Update Photo</span>
                </div>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <div className="flex flex-col text-center md:text-left">
              <h2 className="text-5xl font-bold text-neutral-900 tracking-tight">Identity Settings</h2>
              <p className="text-neutral-400 mt-2 text-lg">Manage your personal profile and preferences.</p>
          </div>
        </div>

        {error && (
          <div className="mb-12 max-w-3xl mx-auto">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-16 max-w-3xl mx-auto">
          {/* Information Selection */}
          <div className="space-y-12">
            <div className="space-y-10">
                <div className="group">
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-4 ml-2 group-focus-within:text-neutral-900 transition-colors">Display Name</label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-8 py-5 rounded-[28px] bg-neutral-50 border border-neutral-100 focus:ring-8 focus:ring-neutral-900/5 focus:border-neutral-900/20 transition-all outline-none text-neutral-900 font-bold placeholder:text-neutral-300"
                        placeholder="Your name..."
                        required
                    />
                </div>

                <div className="group">
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-4 ml-2 group-focus-within:text-neutral-900 transition-colors">Biography</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={5}
                        className="w-full px-8 py-5 rounded-[32px] bg-neutral-50 border border-neutral-100 focus:ring-8 focus:ring-neutral-900/5 focus:border-neutral-900/20 transition-all outline-none resize-none text-neutral-700 font-medium placeholder:text-neutral-300 leading-relaxed"
                        placeholder="Tell the community about yourself..."
                    />
                </div>
            </div>
          </div>

          {/* Dynamic Grid Selection */}
          <div className="space-y-12">
            <div className="flex items-center gap-4">
                <span className="text-[11px] font-bold text-neutral-900 uppercase tracking-widest">Specialization Matrix</span>
                <div className="h-px flex-1 bg-neutral-100" />
            </div>

            <div className="grid md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.4em] ml-2">I Can Teach</label>
                    <div className="flex flex-wrap gap-2 p-8 bg-neutral-50 rounded-[40px] border border-neutral-100/50 shadow-inner min-h-[200px]">
                       {COMMON_SUBJECTS.map((s) => (
                          <button
                            key={`teach-${s}`}
                            type="button"
                            onClick={() => {
                                setTeachingSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
                            }}
                            className={`px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-full border transition-all ${
                                teachingSubjects.includes(s) 
                                ? 'bg-neutral-900 text-white border-neutral-900 shadow-lg scale-105' 
                                : 'bg-white text-neutral-400 border-neutral-100 hover:border-neutral-300'
                            }`}
                          >
                             {s}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.4em] ml-2">I am Learning</label>
                    <div className="flex flex-wrap gap-2 p-8 bg-neutral-50 rounded-[40px] border border-neutral-100/50 shadow-inner min-h-[200px]">
                       {COMMON_SUBJECTS.map((s) => (
                          <button
                            key={`learn-${s}`}
                            type="button"
                            onClick={() => {
                                setLearningSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
                            }}
                            className={`px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-full border transition-all ${
                                learningSubjects.includes(s) 
                                ? 'bg-neutral-900 text-white border-neutral-900 shadow-lg scale-105' 
                                : 'bg-white text-neutral-400 border-neutral-100 hover:border-neutral-300'
                            }`}
                          >
                             {s}
                          </button>
                       ))}
                    </div>
                 </div>
            </div>
          </div>

          {/* Action Synchronization */}
          <div className="pt-16 flex flex-col md:flex-row gap-6">
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 justify-center py-6 rounded-[32px] text-[11px] font-bold uppercase tracking-widest border border-neutral-100 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className={`flex-[3] justify-center py-6 rounded-[32px] text-[11px] font-bold uppercase tracking-widest transition-all shadow-xl active:scale-95 relative overflow-hidden group ${loading ? 'opacity-50 cursor-not-allowed' : 'bg-neutral-900 text-white hover:bg-black'}`}
            >
              {loading ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileForm
