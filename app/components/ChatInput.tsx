'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void;
  isDarkMode: boolean;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isDarkMode, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return
    onSend(message)
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`fixed bottom-0 left-0 w-full ${
        isDarkMode 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      } border-t p-4 flex items-end gap-2`}
    >
      <div className="relative flex-grow">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Type your issue here..."
          className={`w-full resize-none rounded-2xl p-4 text-xl font-mono ${
            isDarkMode
              ? 'bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:ring-blue-500'
              : 'bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:ring-blue-500'
          } border shadow-sm focus:outline-none focus:ring-2 focus:border-transparent`}
          disabled={isLoading}
          aria-label="Type your message"
        />
        <div className={`character-counter font-mono ${
          isDarkMode ? 'text-white/50' : 'text-gray-500'
        }`}>
          {message.length}/1000
        </div>
      </div>
      <button 
        type="submit" 
        className={`p-3 rounded-full ${
          isDarkMode
            ? 'bg-blue-600 hover:bg-blue-500 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        } transition-colors disabled:opacity-50`}
        disabled={!message.trim() || isLoading}
        aria-label="Send message"
      >
        {isLoading ? (
          <div className="loading-spinner w-6 h-6" />
        ) : (
          <Send className="w-6 h-6" />
        )}
      </button>
    </form>
  )
} 