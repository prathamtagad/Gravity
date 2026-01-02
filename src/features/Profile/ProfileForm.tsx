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
  const [subjects] = useState<string[]>(profile?.subjects || [])
  const [teachingSubjects, setTeachingSubjects] = useState<string[]>(profile?.teachingSubjects || [])
  const [learningSubjects, setLearningSubjects] = useState<string[]>(profile?.learningSubjects || [])
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    profile?.photoURL || null
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    <div className="bg-white/40 dark:bg-black/40 backdrop-blur-3xl rounded-[64px] shadow-[0_32px_120px_rgb(0,0,0,0.08)] border border-white dark:border-white/5 p-4 animate-reveal-up relative font-sans overflow-hidden transition-colors duration-300">
      <div className="px-12 pb-20 pt-16">
        <div className="flex flex-col md:flex-row items-center gap-10 mb-20">
          <div className="relative group cursor-pointer shrink-0">
            <img
              src={photoPreview || '/default-avatar.png'}
              alt="Profile"
              className="w-48 h-48 rounded-[48px] border-4 border-white dark:border-neutral-800 shadow-xl object-cover bg-neutral-50 dark:bg-neutral-900 relative z-10 transition-all group-hover:scale-105"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-black/60 text-neutral-900 dark:text-white rounded-[48px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20 backdrop-blur-md">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">📸</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Update Photo</span>
                </div>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <div className="flex flex-col text-center md:text-left">
              <h2 className="text-5xl font-bold text-neutral-900 dark:text-white tracking-tight">Identity Settings</h2>
              <p className="text-neutral-400 dark:text-neutral-500 mt-2 text-lg">Manage your personal profile and preferences.</p>
          </div>
        </div>

        {error && (
          <div className="mb-12 max-w-3xl mx-auto">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-16 max-w-3xl mx-auto">
          <div className="space-y-12">
            <div className="space-y-10">
                <div className="group">
                    <label className="block text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-4 ml-2 group-focus-within:text-neutral-900 dark:group-focus-within:text-white transition-colors">Display Name</label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-8 py-5 rounded-[28px] bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 focus:ring-8 focus:ring-neutral-900/5 dark:focus:ring-white/5 focus:border-neutral-900/20 dark:focus:border-white/20 transition-all outline-none text-neutral-900 dark:text-white font-bold placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
                        placeholder="Your name..."
                        required
                    />
                </div>

                <div className="group">
                    <label className="block text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-4 ml-2 group-focus-within:text-neutral-900 dark:group-focus-within:text-white transition-colors">Biography</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={5}
                        className="w-full px-8 py-5 rounded-[32px] bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 focus:ring-8 focus:ring-neutral-900/5 dark:focus:ring-white/5 focus:border-neutral-900/20 dark:focus:border-white/20 transition-all outline-none resize-none text-neutral-700 dark:text-neutral-200 font-medium placeholder:text-neutral-300 dark:placeholder:text-neutral-600 leading-relaxed"
                        placeholder="Tell the community about yourself..."
                    />
                </div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="flex items-center gap-4">
                <span className="text-[11px] font-bold text-neutral-900 dark:text-white uppercase tracking-widest">Specialization Matrix</span>
                <div className="h-px flex-1 bg-neutral-100 dark:bg-neutral-800" />
            </div>

            <div className="grid md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <label className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.4em] ml-2">I Can Teach</label>
                    <div className="flex flex-wrap gap-2 p-8 bg-neutral-50 dark:bg-neutral-800/50 rounded-[40px] border border-neutral-100/50 dark:border-neutral-700/50 shadow-inner min-h-[200px]">
                       {COMMON_SUBJECTS.map((s) => (
                          <button
                            key={`teach-${s}`}
                            type="button"
                            onClick={() => {
                                setTeachingSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
                            }}
                            className={`px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-full border transition-all ${
                                teachingSubjects.includes(s) 
                                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-lg scale-105' 
                                : 'bg-white dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border-neutral-100 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
                            }`}
                          >
                             {s}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.4em] ml-2">I am Learning</label>
                    <div className="flex flex-wrap gap-2 p-8 bg-neutral-50 dark:bg-neutral-800/50 rounded-[40px] border border-neutral-100/50 dark:border-neutral-700/50 shadow-inner min-h-[200px]">
                       {COMMON_SUBJECTS.map((s) => (
                          <button
                            key={`learn-${s}`}
                            type="button"
                            onClick={() => {
                                setLearningSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
                            }}
                            className={`px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-full border transition-all ${
                                learningSubjects.includes(s) 
                                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-lg scale-105' 
                                : 'bg-white dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border-neutral-100 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
                            }`}
                          >
                             {s}
                          </button>
                       ))}
                    </div>
                 </div>
            </div>
          </div>

          <div className="pt-16 flex flex-col md:flex-row gap-6">
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 justify-center py-6 rounded-[32px] text-[11px] font-bold uppercase tracking-widest border border-neutral-100 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className={`flex-[3] justify-center py-6 rounded-[32px] text-[11px] font-bold uppercase tracking-widest transition-all shadow-xl active:scale-95 relative overflow-hidden group ${loading ? 'opacity-50 cursor-not-allowed' : 'bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-neutral-200'}`}
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
