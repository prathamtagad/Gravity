import React, { useState, useRef, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { findMockResponse, getTotalQACount } from '@services/ai/mockResponses'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface StudyBuddyProps {
  onClose: () => void
}

const StudyBuddy: React.FC<StudyBuddyProps> = ({ onClose }) => {
  const totalQA = getTotalQACount()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi! I'm your AI Study Buddy! 🤖 I can help with ${totalQA}+ topics across CS, Math, Physics, Chemistry, Biology, Economics, and study techniques. What would you like to learn today?`,
      timestamp: Date.now()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    }

    const userQuery = input.trim()
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY

      if (!apiKey) {
        // Use comprehensive mock responses when API key is missing
        const mockResponse = findMockResponse(userQuery)
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: mockResponse,
            timestamp: Date.now()
          }])
          setIsLoading(false)
        }, 500 + Math.random() * 500) // Simulate thinking time
        return
      }

      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

      const prompt = `You are a friendly and helpful AI study buddy for college students. You help with:
- Explaining complex concepts in simple terms
- Providing study tips and techniques
- Answering academic questions
- Motivating students to stay focused
- Suggesting study resources

Keep responses concise (2-4 sentences max) and encouraging. Use emojis occasionally to be friendly.

Student's question: ${userQuery}`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: text,
        timestamp: Date.now()
      }])
    } catch (error) {
      console.error('Study Buddy error:', error)
      // Fallback to mock responses on API error
      const mockResponse = findMockResponse(userQuery)
      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: mockResponse,
        timestamp: Date.now()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickQuestions = [
    "Explain Pomodoro technique",
    "Tips for exam prep",
    "How to stay focused?",
    "Best note-taking methods"
  ]

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-[2000] flex items-end sm:items-center justify-center animate-reveal-up">
      <div className="w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[600px]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🤖</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">AI Study Buddy</h2>
              <p className="text-xs text-neutral-400 font-medium">Powered by Gemini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-all"
          >
            <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-neutral-900 text-white rounded-br-md'
                    : 'bg-neutral-100 text-neutral-800 rounded-bl-md'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-neutral-100 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 2 && (
          <div className="px-6 pb-3">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Quick Questions</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(q); inputRef.current?.focus() }}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs font-medium rounded-full transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-6 py-4 border-t border-neutral-100">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 bg-neutral-100 border-0 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 placeholder:text-neutral-400"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 bg-neutral-900 hover:bg-black text-white rounded-2xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyBuddy
