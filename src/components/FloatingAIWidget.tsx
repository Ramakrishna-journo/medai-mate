'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Send, Bot, User, Loader2 } from 'lucide-react'

export function FloatingAIWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Hi! I am MedAI Mate. How can I assist you with your editorial workflows today?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'API Error')

      setMessages(prev => [...prev, { role: 'ai', content: data.response }])
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'ai', content: `Error: ${err.message}. Please check if GEMINI_API_KEY is configured correctly.` }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-[#0071e3] to-[#42a1f5] rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center z-40 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <Sparkles className="w-7 h-7 text-white" />
      </button>

      {/* Chat Window overlay */}
      <div 
        className={`fixed bottom-8 right-8 w-[400px] h-[600px] bg-white/95 backdrop-blur-3xl rounded-3xl shadow-2xl border border-[#f1f1f4] flex flex-col overflow-hidden z-50 transition-all duration-500 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="h-16 bg-gradient-to-r from-[#0071e3] to-[#42a1f5] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-white" />
            <h3 className="text-white font-medium">MedAI Mate Assistant</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fafafc]">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#1d1d1f]' : 'bg-[#0071e3]'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`p-4 rounded-2xl max-w-[80%] text-[14px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-white text-[#1d1d1f] rounded-tr-none' : 'bg-white text-[#1d1d1f] rounded-tl-none border border-[#f1f1f4]'}`}>
                {/* Parse simple newlines to breaks */}
                {msg.content.split('\n').map((line, j) => (
                  <span key={j}>
                    {line}
                    {j < msg.content.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0071e3] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="p-4 rounded-2xl bg-white text-[#86868b] rounded-tl-none border border-[#f1f1f4] flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-[13px]">Analyzing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-[#f1f1f4]">
          <form onSubmit={handleSend} className="relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="w-full h-12 bg-[#f5f5f7] rounded-full pl-5 pr-14 outline-none focus:bg-white focus:ring-2 focus:ring-[#0071e3] transition-all text-[15px]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#0071e3] hover:bg-[#0077ED] text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
