import { UserProfile } from '@/types/user';

export interface MatchingResult {
  score: number;
  reasons: string[];
  badges: string[];
  icebreaker?: string;
}

const SUBJECT_PROMPTS: Record<string, string> = {
  'Data Structures': "Do you understand Red-Black Trees? Because I'm stuck.",
  'Calculus': "How are you finding the derivatives? I'm trying to wrap my head around the Chain Rule.",
  'Physics': "Got any tips for torque? My brain is spinning faster than a flywheel.",
  'Chemistry': "Still trying to balance these equations. Want to check each other's work?",
  'History': "Is that also the World War II section? Some of these dates are a blur.",
  'Algorithms': "Dynamic Programming is destroying me. Have you done the knapsack problem yet?",
  'Psychology': "Fascinating stuff, right? What's your take on the latest theory we covered?",
  'Biology': "Cell division is more complex than I thought. Mitosis vs Meiosis, anyone?",
};

const getIcebreaker = (user: UserProfile, matchType: 'skill' | 'subject', subject: string): string => {
  const customPrompt = SUBJECT_PROMPTS[subject];
  if (matchType === 'skill') {
    return `Hey ${user.displayName}! I saw you're teaching ${subject}. Could you help me out with a quick question?`;
  }
  return customPrompt ? `Ask ${user.displayName}: "${customPrompt}"` : `Hey ${user.displayName}! I saw we're both studying ${subject}. Want to compare notes?`;
};

export const calculateGravityPull = (
  user1: UserProfile,
  user2: UserProfile
): MatchingResult => {
  let score = 0;
  const reasons: string[] = [];
  const badges: string[] = [];
  let icebreaker: string | undefined;

  if (user2.teachingSubjects && user1.learningSubjects) {
    const skillMatch = user2.teachingSubjects.find(s => user1.learningSubjects?.includes(s));
    if (skillMatch) {
      score += 40;
      reasons.push(`Can learn from them: ${skillMatch}`);
      badges.push('Apprentice');
      icebreaker = getIcebreaker(user2, 'skill', skillMatch);
    }
  }

  if (user1.teachingSubjects && user2.learningSubjects) {
    const skillMatch = user1.teachingSubjects.find(s => user2.learningSubjects?.includes(s));
    if (skillMatch) {
      score += 40;
      reasons.push(`Can help you with: ${skillMatch}`);
      if (!badges.includes('Apprentice')) badges.push('Guide');
    }
  }

  if (user1.subjects && user2.subjects) {
    const shared = user1.subjects.filter(s => user2.subjects.includes(s));
    if (shared.length > 0) {
      const matchPoint = Math.min(shared.length * 15, 45);
      score += matchPoint;
      reasons.push(`${shared.length} shared interests`);
      if (shared.length >= 3) badges.push('Twin Stars');
      
      if (!icebreaker) {
        icebreaker = getIcebreaker(user2, 'subject', shared[0]);
      }
    }
  }

  if (user1.orbitStatus === user2.orbitStatus && user1.orbitStatus === 'In Orbit') {
    score += 15;
    reasons.push('Both ready to collide');
  }

  score = Math.min(score, 100);

  return {
    score,
    reasons,
    badges: [...new Set(badges)],
    icebreaker
  };
};

export const calculateLevelInfo = (mass: number = 0) => {
  const level = Math.floor(Math.sqrt(mass / 50)) + 1;
  const ranks = [
    'Stellar Dust',      // Level 1
    'Cosmic Particle',   // Level 2
    'Asteroid',          // Level 3
    'Comet',             // Level 4
    'Moon',              // Level 5
    'Planet',            // Level 6
    'Gas Giant',         // Level 7
    'Protostar',         // Level 8
    'Red Dwarf',         // Level 9
    'Main Sequence',     // Level 10
    'Blue Giant',        // Level 11
    'Red Giant',         // Level 12
    'White Dwarf',       // Level 13
    'Supernova',         // Level 14
    'Neutron Star',      // Level 15
    'Pulsar',            // Level 16
    'Magnetar',          // Level 17
    'Quasar',            // Level 18
    'Black Hole',        // Level 19
    'Multiverse Entity'  // Level 20
  ];
  
  const rankIndex = Math.min(level - 1, ranks.length - 1);
  return {
    level,
    rank: ranks[rankIndex],
    nextLevelExp: Math.pow(level, 2) * 50,
    progress: (mass % (Math.pow(level, 2) * 50)) / (Math.pow(level, 2) * 50)
  };
};
