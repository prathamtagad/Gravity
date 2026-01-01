import { GoogleGenerativeAI } from '@google/generative-ai'
import { getRandomMockQuests } from './mockQuestData'

export interface QuestActivity {
  id: string
  title: string
  description: string
  category: 'Learning' | 'Social' | 'Wellness' | 'Creation'
  duration: number // in minutes
  xpReward: number
  googleTool?: string // e.g. "Google Colab", "YouTube", "Generative AI"
}

export const generateGapActivities = async (
  minutes: number,
  interests: string[] = []
): Promise<QuestActivity[]> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  
  if (!apiKey) {
    console.warn('Gemini API Key missing, using fallback data')
    return getRandomMockQuests(minutes)
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    // Using gemini-2.0-flash as per user request
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `
      You are an AI productivity coach for students. 
      The user has exactly ${minutes} minutes of free time.
      Generate 3 to 4 "Micro-Quests" (short, actionable activities) that fit this timeframe.
      
      Interests: ${interests.join(', ') || 'General productivity, tech, wellness'}.
      
      Return ONLY a valid JSON array of objects. No markdown formatting.
      Each object must match this schema:
      {
        "id": "string (unique)",
        "title": "string (short & catchy)",
        "description": "string (actionable)",
        "category": "Learning" | "Social" | "Wellness" | "Creation",
        "duration": number (must be <= ${minutes}),
        "xpReward": number (between 50 and 500),
        "googleTool": "string (optional, e.g. Google Maps, Youtube, Colab, Keep)"
      }
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Clean up markdown code blocks if present
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim()
    const activities = JSON.parse(jsonStr) as QuestActivity[]

    return activities
  } catch (error) {
    console.error('Gemini API call failed:', error)
    return getRandomMockQuests(minutes)
  }
}
