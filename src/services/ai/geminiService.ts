import { GoogleGenerativeAI } from '@google/generative-ai'
import { getRandomMockQuests } from './mockQuestData'

export interface QuestActivity {
  id: string
  title: string
  description: string
  category: 'Learning' | 'Social' | 'Wellness' | 'Creation'
  duration: number
  xpReward: number
  googleTool?: string
}

const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

export const generateGapActivities = async (
  minutes: number,
  subjects: string[] = []
): Promise<QuestActivity[]> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  
  if (!apiKey) {
    console.warn('Gemini API Key missing, using fallback data')
    return getRandomMockQuests(minutes, subjects)
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const timeOfDay = getTimeOfDay()
    const subjectContext = subjects.length > 0 
      ? `The student is studying: ${subjects.join(', ')}.` 
      : 'The student has general academic interests.'

    const prompt = `You are an AI productivity coach for a college student who has unexpected free time between classes.

CONTEXT:
- Available time: Exactly ${minutes} minutes
- Time of day: ${timeOfDay}
- ${subjectContext}
- Setting: On a college campus with access to library, quiet study spots, and peers

TASK:
Generate 3-4 "Micro-Quests" - short, actionable activities that transform this gap into productive time.

REQUIREMENTS:
1. Activities MUST fit within ${minutes} minutes
2. At least one quest should relate to their study subjects if provided
3. Include at least one social/collaborative option (study groups, peer review)
4. Each quest should leverage a Google technology when relevant
5. Make activities campus-specific and immediately actionable
6. ${timeOfDay === 'morning' ? 'Focus on high-energy learning tasks' : timeOfDay === 'afternoon' ? 'Include options for both focused work and breaks' : 'Suggest lighter review or planning activities'}

GOOGLE TOOLS TO SUGGEST:
- Google Docs/Slides for note organization
- YouTube for quick tutorial videos
- Google Scholar for research
- Google Keep for quick notes
- Google Calendar for planning
- Google Colab for coding practice
- Gemini for study help

Return ONLY a valid JSON array. No markdown, no explanation.
Schema:
[{
  "id": "unique-string",
  "title": "Catchy 3-5 word title",
  "description": "One sentence action to take right now",
  "category": "Learning" | "Social" | "Wellness" | "Creation",
  "duration": number (minutes, must be <= ${minutes}),
  "xpReward": number (50-500, based on difficulty),
  "googleTool": "optional Google tool name"
}]`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim()
    const activities = JSON.parse(jsonStr) as QuestActivity[]

    return activities
  } catch (error) {
    console.error('Gemini API call failed:', error)
    return getRandomMockQuests(minutes, subjects)
  }
}

