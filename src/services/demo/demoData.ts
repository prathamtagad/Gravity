import type { TimeSlot } from '@/types/timetable'
import type { UserProfile } from '@/types/user'

export const DEMO_TIMETABLE: Omit<TimeSlot, 'id'>[] = [
  { day: 'Monday', startTime: '09:00', endTime: '10:30', className: 'Data Structures & Algorithms', location: 'CS Lab Block' },
  { day: 'Monday', startTime: '11:30', endTime: '13:00', className: 'Database Management', location: 'Room 201' },
  { day: 'Monday', startTime: '14:00', endTime: '15:30', className: 'Web Development', location: 'CS Lab Block' },
  
  { day: 'Tuesday', startTime: '08:30', endTime: '10:00', className: 'Operating Systems', location: 'Room 102' },
  { day: 'Tuesday', startTime: '11:00', endTime: '12:30', className: 'Computer Networks', location: 'Room 203' },
  { day: 'Tuesday', startTime: '14:30', endTime: '16:00', className: 'Software Engineering', location: 'Seminar Hall' },
  
  { day: 'Wednesday', startTime: '09:30', endTime: '11:00', className: 'Machine Learning', location: 'AI Lab' },
  { day: 'Wednesday', startTime: '12:00', endTime: '13:30', className: 'Data Structures & Algorithms', location: 'CS Lab Block' },
  { day: 'Wednesday', startTime: '15:00', endTime: '16:30', className: 'Cloud Computing', location: 'Room 301' },
  
  { day: 'Thursday', startTime: '08:00', endTime: '09:30', className: 'Theory of Computation', location: 'Room 105' },
  { day: 'Thursday', startTime: '10:30', endTime: '12:00', className: 'Database Management', location: 'Room 201' },
  { day: 'Thursday', startTime: '14:00', endTime: '15:30', className: 'Artificial Intelligence', location: 'AI Lab' },
  
  { day: 'Friday', startTime: '09:00', endTime: '10:30', className: 'Web Development', location: 'CS Lab Block' },
  { day: 'Friday', startTime: '11:30', endTime: '13:00', className: 'Cyber Security', location: 'Room 204' },
  { day: 'Friday', startTime: '14:30', endTime: '16:00', className: 'Project Work', location: 'Project Lab' },
  
  { day: 'Saturday', startTime: '09:00', endTime: '11:00', className: 'Tutorial Session', location: 'Room 101' },
  { day: 'Saturday', startTime: '12:00', endTime: '13:30', className: 'Lab Practice', location: 'CS Lab Block' },
]

export const DEMO_USERS: Partial<UserProfile>[] = [
  // ===== IET DAVV =====
  {
    id: 'demo-user-1',
    displayName: 'Aryan Sharma',
    email: 'aryan@ietdavv.edu.in',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aryan&backgroundColor=b6e3f4',
    bio: 'CS undergrad passionate about AI/ML 🤖 | IET DAVV',
    subjects: ['Machine Learning', 'Python', 'Deep Learning'],
    mass: 2450,
    level: 12,
    rank: 'Nebula',
    streak: 7,
    totalQuests: 45,
    orbitStatus: 'In Orbit',
    location: { latitude: 22.6815, longitude: 75.8795, timestamp: Date.now() },
    followersCount: 156,
    followingCount: 89,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  },
  {
    id: 'demo-user-2',
    displayName: 'Priya Patel',
    email: 'priya@ietdavv.edu.in',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=ffd5dc',
    bio: 'Full-stack developer | Open source contributor | IET',
    subjects: ['React', 'Node.js', 'TypeScript'],
    mass: 3120,
    level: 15,
    rank: 'Supernova',
    streak: 12,
    totalQuests: 89,
    orbitStatus: 'High Gravity',
    location: { latitude: 22.6808, longitude: 75.8802, timestamp: Date.now() },
    followersCount: 234,
    followingCount: 112,
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  },

  // ===== IIM INDORE =====
  {
    id: 'demo-user-3',
    displayName: 'Aditya Kapoor',
    email: 'aditya.k@iimindore.edu.in',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aditya&backgroundColor=c0aede',
    bio: 'MBA 2025 | Strategy & Consulting | IIM Indore',
    subjects: ['Business Strategy', 'Finance', 'Marketing'],
    mass: 4580,
    level: 18,
    rank: 'Black Hole',
    streak: 21,
    totalQuests: 156,
    orbitStatus: 'In Orbit',
    location: { latitude: 22.6245, longitude: 75.7952, timestamp: Date.now() },
    followersCount: 345,
    followingCount: 67,
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  },
  {
    id: 'demo-user-4',
    displayName: 'Meera Saxena',
    email: 'meera.s@iimindore.edu.in',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meera&backgroundColor=d1d4f9',
    bio: 'Case Study Champion | Analytics | IIM Indore',
    subjects: ['Data Analytics', 'Operations', 'Excel'],
    mass: 3890,
    level: 16,
    rank: 'Supernova',
    streak: 15,
    totalQuests: 112,
    orbitStatus: 'High Gravity',
    location: { latitude: 22.6238, longitude: 75.7948, timestamp: Date.now() },
    followersCount: 289,
    followingCount: 156,
    createdAt: Date.now() - 50 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  },

  // ===== SGSITS =====
  {
    id: 'demo-user-5',
    displayName: 'Rohit Malhotra',
    email: 'rohit.m@sgsits.edu.in',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rohit&backgroundColor=ffdfbf',
    bio: 'Mechanical Engineering | GATE aspirant | SGSITS',
    subjects: ['Thermodynamics', 'Engineering Mechanics', 'CAD'],
    mass: 2780,
    level: 13,
    rank: 'Nebula',
    streak: 9,
    totalQuests: 67,
    orbitStatus: 'Event Horizon',
    eventHorizonEndTime: Date.now() + 25 * 60 * 1000,
    location: { latitude: 22.7255, longitude: 75.8710, timestamp: Date.now() },
    followersCount: 201,
    followingCount: 98,
    createdAt: Date.now() - 40 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  },

  // ===== MEDICAPS UNIVERSITY =====
  {
    id: 'demo-user-6',
    displayName: 'Ananya Joshi',
    email: 'ananya@medicaps.ac.in',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ananya&backgroundColor=a3e4d7',
    bio: 'CSE | Hackathon winner | Medicaps University',
    subjects: ['Python', 'Data Analysis', 'TensorFlow'],
    mass: 5200,
    level: 20,
    rank: 'Quasar',
    streak: 28,
    totalQuests: 234,
    orbitStatus: 'High Gravity',
    location: { latitude: 22.6205, longitude: 75.8032, timestamp: Date.now() },
    followersCount: 456,
    followingCount: 134,
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  },

  // ===== PRESTIGE INSTITUTE =====
  {
    id: 'demo-user-7',
    displayName: 'Karan Mehta',
    email: 'karan@prestige.edu.in',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=karan&backgroundColor=ffeaa7',
    bio: 'BBA | Aspiring entrepreneur | Prestige Institute',
    subjects: ['Entrepreneurship', 'Marketing', 'Finance'],
    mass: 2100,
    level: 11,
    rank: 'Star',
    streak: 5,
    totalQuests: 34,
    orbitStatus: 'In Orbit',
    location: { latitude: 22.7618, longitude: 75.8858, timestamp: Date.now() },
    followersCount: 167,
    followingCount: 145,
    createdAt: Date.now() - 35 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  },

  // ===== SVVV (Shri Vaishnav) =====
  {
    id: 'demo-user-8',
    displayName: 'Divya Agarwal',
    email: 'divya@svvv.edu.in',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=divya&backgroundColor=fab1a0',
    bio: 'IT Branch | Web Development | SVVV',
    subjects: ['JavaScript', 'React', 'Node.js'],
    mass: 3450,
    level: 16,
    rank: 'Supernova',
    streak: 11,
    totalQuests: 78,
    orbitStatus: 'In Orbit',
    location: { latitude: 22.8248, longitude: 75.8492, timestamp: Date.now() },
    followersCount: 278,
    followingCount: 89,
    createdAt: Date.now() - 55 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  },

  // ===== ACROPOLIS INSTITUTE =====
  {
    id: 'demo-user-9',
    displayName: 'Vikram Thakur',
    email: 'vikram@acropolis.edu.in',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram2&backgroundColor=74b9ff',
    bio: 'ECE | Robotics Club Lead | Acropolis',
    subjects: ['Embedded Systems', 'IoT', 'Arduino'],
    mass: 2890,
    level: 14,
    rank: 'Nebula',
    streak: 8,
    totalQuests: 56,
    orbitStatus: 'In Orbit',
    location: { latitude: 22.8212, longitude: 75.9430, timestamp: Date.now() },
    followersCount: 198,
    followingCount: 123,
    createdAt: Date.now() - 42 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  },

  // ===== HOLKAR SCIENCE COLLEGE =====
  {
    id: 'demo-user-10',
    displayName: 'Nisha Rathore',
    email: 'nisha@holkar.edu.in',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nisha&backgroundColor=fd79a8',
    bio: 'BSc Physics | Research aspirant | Holkar Science',
    subjects: ['Quantum Physics', 'Mathematics', 'Lab Work'],
    mass: 1950,
    level: 10,
    rank: 'Star',
    streak: 6,
    totalQuests: 28,
    orbitStatus: 'In Orbit',
    location: { latitude: 22.6958, longitude: 75.8706, timestamp: Date.now() },
    followersCount: 134,
    followingCount: 98,
    createdAt: Date.now() - 28 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  },

  // ===== RENAISSANCE COLLEGE =====
  {
    id: 'demo-user-11',
    displayName: 'Amit Dubey',
    email: 'amit@renaissance.edu.in',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit&backgroundColor=a29bfe',
    bio: 'B.Com | CA Aspirant | Renaissance College',
    subjects: ['Accounting', 'Taxation', 'Audit'],
    mass: 2340,
    level: 12,
    rank: 'Nebula',
    streak: 14,
    totalQuests: 67,
    orbitStatus: 'High Gravity',
    location: { latitude: 22.7366, longitude: 75.8940, timestamp: Date.now() },
    followersCount: 187,
    followingCount: 112,
    createdAt: Date.now() - 48 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  },

  // ===== ORIENTAL INSTITUTE =====
  {
    id: 'demo-user-12',
    displayName: 'Pooja Yadav',
    email: 'pooja@oriental.edu.in',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pooja&backgroundColor=55efc4',
    bio: 'Pharmacy student | Research intern | Oriental',
    subjects: ['Pharmacology', 'Chemistry', 'Biology'],
    mass: 1780,
    level: 9,
    rank: 'Star',
    streak: 4,
    totalQuests: 23,
    orbitStatus: 'In Orbit',
    location: { latitude: 22.7565, longitude: 75.8932, timestamp: Date.now() },
    followersCount: 112,
    followingCount: 87,
    createdAt: Date.now() - 22 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  },

  // ===== LNCT INDORE =====
  {
    id: 'demo-user-13',
    displayName: 'Saurabh Pandey',
    email: 'saurabh@lnct.edu.in',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=saurabh&backgroundColor=fdcb6e',
    bio: 'Civil Engineering | AutoCAD expert | LNCT Indore',
    subjects: ['Structural Analysis', 'AutoCAD', 'Surveying'],
    mass: 2560,
    level: 13,
    rank: 'Nebula',
    streak: 10,
    totalQuests: 54,
    orbitStatus: 'In Orbit',
    location: { latitude: 22.7998, longitude: 75.8418, timestamp: Date.now() },
    followersCount: 176,
    followingCount: 134,
    createdAt: Date.now() - 38 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  },

  // ===== SAGE UNIVERSITY =====
  {
    id: 'demo-user-14',
    displayName: 'Riya Choudhary',
    email: 'riya@sage.edu.in',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=riya&backgroundColor=ff7675',
    bio: 'Law student | Moot Court champion | SAGE University',
    subjects: ['Constitutional Law', 'Contract Law', 'Legal Writing'],
    mass: 2980,
    level: 14,
    rank: 'Nebula',
    streak: 13,
    totalQuests: 72,
    orbitStatus: 'High Gravity',
    location: { latitude: 22.6370, longitude: 75.8515, timestamp: Date.now() },
    followersCount: 223,
    followingCount: 156,
    createdAt: Date.now() - 52 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  },

  // ===== CHAMELI DEVI GROUP =====
  {
    id: 'demo-user-15',
    displayName: 'Akash Sharma',
    email: 'akash@cdgi.edu.in',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=akash&backgroundColor=00cec9',
    bio: 'B.Tech CSE | Cloud enthusiast | CDGI',
    subjects: ['AWS', 'DevOps', 'Linux'],
    mass: 2120,
    level: 11,
    rank: 'Star',
    streak: 7,
    totalQuests: 38,
    orbitStatus: 'In Orbit',
    location: { latitude: 22.6652, longitude: 75.8348, timestamp: Date.now() },
    followersCount: 145,
    followingCount: 112,
    createdAt: Date.now() - 32 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  },

  // ===== SANGHVI INSTITUTE =====
  {
    id: 'demo-user-16',
    displayName: 'Neha Gupta',
    email: 'neha@sanghvi.edu.in',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neha&backgroundColor=dfe6e9',
    bio: 'MBA | HR & Marketing | Sanghvi Institute',
    subjects: ['HR Management', 'Marketing', 'OB'],
    mass: 2450,
    level: 12,
    rank: 'Nebula',
    streak: 9,
    totalQuests: 48,
    orbitStatus: 'In Orbit',
    location: { latitude: 22.6202, longitude: 75.7898, timestamp: Date.now() },
    followersCount: 167,
    followingCount: 98,
    createdAt: Date.now() - 36 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  },

  // ===== SIMS INDORE =====
  {
    id: 'demo-user-17',
    displayName: 'Rajat Verma',
    email: 'rajat@sims.edu.in',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajat&backgroundColor=81ecec',
    bio: 'PGDM | Finance geek | SIMS Indore',
    subjects: ['Financial Modeling', 'Valuation', 'Excel'],
    mass: 3120,
    level: 15,
    rank: 'Supernova',
    streak: 16,
    totalQuests: 89,
    orbitStatus: 'High Gravity',
    location: { latitude: 22.7254, longitude: 75.8722, timestamp: Date.now() },
    followersCount: 234,
    followingCount: 145,
    createdAt: Date.now() - 58 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  },

  // ===== IPS ACADEMY =====
  {
    id: 'demo-user-18',
    displayName: 'Shreya Singh',
    email: 'shreya@ipsacademy.edu.in',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shreya&backgroundColor=e17055',
    bio: 'BCA | App Developer | IPS Academy',
    subjects: ['Java', 'Android', 'SQL'],
    mass: 1890,
    level: 10,
    rank: 'Star',
    streak: 6,
    totalQuests: 32,
    orbitStatus: 'In Orbit',
    location: { latitude: 22.7452, longitude: 75.8948, timestamp: Date.now() },
    followersCount: 123,
    followingCount: 89,
    createdAt: Date.now() - 26 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  },

  // ===== DAVV MAIN CAMPUS =====
  {
    id: 'demo-user-19',
    displayName: 'Harsh Jain',
    email: 'harsh@davv.edu.in',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=harsh&backgroundColor=6c5ce7',
    bio: 'MCA | Full Stack Developer | DAVV Campus',
    subjects: ['Python', 'Django', 'PostgreSQL'],
    mass: 2780,
    level: 13,
    rank: 'Nebula',
    streak: 11,
    totalQuests: 62,
    orbitStatus: 'Event Horizon',
    eventHorizonEndTime: Date.now() + 18 * 60 * 1000,
    location: { latitude: 22.7168, longitude: 75.8720, timestamp: Date.now() },
    followersCount: 198,
    followingCount: 112,
    createdAt: Date.now() - 44 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  },

  // ===== IIPS (DAVV) =====
  {
    id: 'demo-user-20',
    displayName: 'Kavya Sharma',
    email: 'kavya@iips.edu.in',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kavya&backgroundColor=00b894',
    bio: 'MBA IT | Product Manager | IIPS DAVV',
    subjects: ['Product Management', 'Agile', 'UX'],
    mass: 3560,
    level: 16,
    rank: 'Supernova',
    streak: 18,
    totalQuests: 95,
    orbitStatus: 'High Gravity',
    location: { latitude: 22.6885, longitude: 75.8768, timestamp: Date.now() },
    followersCount: 289,
    followingCount: 167,
    createdAt: Date.now() - 62 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now()
  }
]

export const DEMO_IMPACT_STATS = {
  hoursThisWeek: 4.5,
  questsCompleted: 18,
  currentStreak: 7,
  totalHoursSaved: 42,
  totalQuestsCompleted: 127,
  longestStreak: 14,
  studyBuddiesConnected: 12,
  gapsOptimized: 89
}
