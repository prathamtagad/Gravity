import { QuestActivity } from './geminiService'

const TOPICS = [
  // Tech & Coding
  'Quantum Physics', 'React Hooks', 'Machine Learning', 'Data Structures', 'Cybersecurity', 'Blockchain',
  'Typography', 'Mobile Photography', 'Podcasting', 'Digital Marketing', 'SEO Basics', 'Cloud Computing',
  'Docker Containers', 'Rust Programming', 'Python Scriptures', 'UI Design Patterns', 'UX Research',
  'SQL Databases', 'GraphQL APIs', 'WebAssembly', 'Linux Commands', 'Git Workflows', 'Prompt Engineering',
  'Game Development', 'Arduino Projects', 'Raspberry Pi', '3D Modeling', 'Video Editing', 'Sound Design',
  
  // Humanities & History
  'Roman History', 'Greek Mythology', 'Renaissance Art', 'World War II', 'Ancient Egypt', 'Feudal Japan',
  'Psychology 101', 'Philosophy of Stoicism', 'Cognitive Bias', 'Macroeconomics', 'Microeconomics',
  'Political Science', 'Sociology', 'Anthropology', 'Archeology', 'Linguistics', 'Creative Writing',
  
  // Science & Nature
  'Plant Care', 'Sustainable Living', 'Astronomy', 'Gardening', 'Neuroscience', 'Biology Basics',
  'Chemistry Experiments', 'Geology', 'Oceanography', 'Climate Change', 'Renewable Energy', 'Zoology',
  'Botany', 'Genetics', 'Physics of Music', 'Meteorology', 'Urban Planning',
  
  // Arts & Culture
  'Jazz Theory', 'Minimalism', 'Interior Design', 'Abstract Art', 'Origami', 'Calligraphy',
  'Film Theory', 'Electronic Music', 'Classical Music', 'Impressionism', 'Surrealism', 'Fashion History',
  'Ceramics', 'Watercolor Painting', 'Digital Art', 'Stand-up Comedy', 'Improv Acting',
  
  // Lifestyle & Skills
  'Meditation', 'Yoga', 'Cooking Science', 'Coffee Brewing', 'Time Management', 'Personal Finance',
  'Public Speaking', 'Negotiation', 'Leadership', 'Emotional Intelligence', 'Critical Thinking',
  'Speed Reading', 'Note Taking', 'Memory Palaces', 'Chess Tactics', 'Poker Strategy', 'Scrabble',
  'Nutrition Basics', 'Calisthenics', 'Marathon Training', 'First Aid', 'Survival Skills', 'DIY Repairs',
  'Woodworking', 'Knitting', 'Sewing', 'Baking Sourdough', 'Tea Culture', 'Wine Tasting', 'Mixology',
  
  // Niche Interests
  'Mechanical Keyboards', 'Fountain Pens', 'Vinyl Records', 'Retro Gaming', 'Sneaker Culture',
  'Watches', 'Perfumes', 'Board Games', 'Card Magic', 'Juggling', 'Lockpicking', 'Cryptocurrency',
  'NFTs', 'Virtual Reality', 'Augmented Reality', 'Space Travel', 'Electric Vehicles', 'Tiny Homes',
  'Van Life', 'Digital Nomadism', 'Remote Work', 'Side Hustles', 'Passive Income', 'Investing',
  'Real Estate', 'Stock Market', 'Venture Capital', 'Crowdfunding', 'Social Entrepreneurship'
]

const LEARNING_ACTIONS = [
  { title: 'Review {topic} Notes', desc: 'Go over your key takeaways for {topic}.' },
  { title: 'Flashcards: {topic}', desc: 'Test your memory on 5 key {topic} concepts.' },
  { title: '{topic} Deep Dive', desc: 'Read one in-depth article about {topic}.' },
  { title: '{topic} Video Summary', desc: 'Watch a 5-min explainer video on {topic}.' },
  { title: 'Explain {topic}', desc: 'Record yourself explaining a {topic} concept simply.' },
  { title: '{topic} History', desc: 'Read a quick timeline of {topic} history.' },
  { title: '{topic} Trends', desc: 'Research current trends in {topic}.' },
  { title: '{topic} Experts', desc: 'Find and follow 3 experts in {topic}.' }
]

const CREATION_ACTIONS = [
  { title: 'Sketch {topic} Concept', desc: 'Draw a diagram explaining {topic}.' },
  { title: 'Write {topic} Haiku', desc: 'Summarize {topic} in a creative 3-line poem.' },
  { title: 'Brainstorm {topic} Ideas', desc: 'List 10 new ideas related to {topic}.' },
  { title: 'Draft {topic} Post', desc: 'Write a short social media post sharing a {topic} fact.' },
  { title: '{topic} Mind Map', desc: 'Create a visual map connecting {topic} concepts.' },
  { title: '{topic} Checklist', desc: 'Create a "How-To" checklist for {topic}.' },
  { title: '{topic} Analogy', desc: 'Write an analogy to explain {topic} to a child.' },
  { title: '{topic} Quiz', desc: 'Create a 3-question quiz about {topic}.' }
]

const SOCIAL_ACTIONS = [
  { title: 'Discuss {topic}', desc: 'Call a friend and ask their opinion on {topic}.' },
  { title: 'Share {topic} Fact', desc: 'Send an interesting {topic} fact to a group chat.' },
  { title: '{topic} Study Buddy', desc: 'Find someone to review {topic} with for 10 mins.' },
  { title: 'Teach {topic}', desc: 'Explain a cool {topic} trick to a peer.' },
  { title: '{topic} Q&A', desc: 'Post a question about {topic} on a forum.' },
  { title: 'Debate {topic}', desc: 'Find a counter-argument to a {topic} theory.' },
  { title: '{topic} Meme', desc: 'Find or create a meme about {topic} and share it.' }
]

const WELLNESS_ACTIONS = [
  { title: 'Mindful Breathing', desc: 'Focus on your breath for 5 minutes.' },
  { title: 'Drink Water', desc: 'Hydrate yourself with a full glass of water.' },
  { title: 'Stretch Break', desc: 'Stand up and do a full body stretch.' },
  { title: 'Screen-Free Moment', desc: 'Look out the window for 2 minutes.' },
  { title: 'Gratitude List', desc: 'Write down 3 things happened today.' },
  { title: 'Quick Walk', desc: 'Take a brisk walk around the block.' },
  { title: 'Power Nap', desc: 'Rest your eyes for 15 minutes.' },
  { title: 'Declutter Desk', desc: 'Clear your workspace for better focus.' },
  { title: 'Digital Detox', desc: 'Turn off notifications for 20 minutes.' },
  { title: 'Positive Affirmation', desc: 'Repeat a positive statement to yourself.' }
]

const GENERATED_QUESTS: QuestActivity[] = []

// Generate Learning, Creation, Social Quests
// 30 topics * 5 actions * 3 categories = 450 combinations (approx)
// We will generate a mix

let idCounter = 1

const getRandomDuration = () => {
    const durations = [5, 10, 15, 20, 30, 45, 60]
    return durations[Math.floor(Math.random() * durations.length)]
}

// Generate Topic-based Quests
TOPICS.forEach(topic => {
    // Learning
    LEARNING_ACTIONS.forEach(action => {
        GENERATED_QUESTS.push({
            id: `mq-${idCounter++}`,
            title: action.title.replace('{topic}', topic),
            description: action.desc.replace('{topic}', topic),
            category: 'Learning',
            duration: getRandomDuration(),
            xpReward: 0, 
            googleTool: Math.random() > 0.6 ? 'Google Keep' : (Math.random() > 0.5 ? 'YouTube' : undefined)
        })
    })

    // Creation
    CREATION_ACTIONS.forEach(action => {
        GENERATED_QUESTS.push({
            id: `mq-${idCounter++}`,
            title: action.title.replace('{topic}', topic),
            description: action.desc.replace('{topic}', topic),
            category: 'Creation',
            duration: getRandomDuration(),
            xpReward: 0,
            googleTool: Math.random() > 0.6 ? 'Google Docs' : (Math.random() > 0.5 ? 'Google Slides' : undefined)
        })
    })
    
     // Social (Select fewer)
     SOCIAL_ACTIONS.forEach(action => {
         if (Math.random() > 0.5) return // diverse selection
        GENERATED_QUESTS.push({
            id: `mq-${idCounter++}`,
            title: action.title.replace('{topic}', topic),
            description: action.desc.replace('{topic}', topic),
            category: 'Social',
            duration: getRandomDuration(),
            xpReward: 0,
            googleTool: 'Google Meet'
        })
    })
})

// Generate Wellness Quests (Multiplied for variety in duration)
for (let i = 0; i < 5; i++) {
    WELLNESS_ACTIONS.forEach(action => {
        const duration = [5, 10, 15][Math.floor(Math.random() * 3)]
        GENERATED_QUESTS.push({
            id: `mq-${idCounter++}`,
            title: action.title,
            description: action.desc,
            category: 'Wellness',
            duration: duration,
            xpReward: 0,
            googleTool: 'Digital Wellbeing'
        })
    })
}

// Final pass to fix XP and verify count
GENERATED_QUESTS.forEach(q => {
    q.xpReward = q.duration * 10
})

export const MOCK_QUESTS = GENERATED_QUESTS

export const getRandomMockQuests = (minutes: number, count: number = 3): QuestActivity[] => {
    // Filter by duration (allow slightly shorter quests)
    const candidates = MOCK_QUESTS.filter(q => q.duration <= minutes)
    
    // Shuffle
    for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    
    return candidates.slice(0, count)
}
