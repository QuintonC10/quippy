'use client'

import { useState, useEffect } from 'react'

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClick = () => {
    setIsVisible(false)
    setTimeout(() => {
      onStart()
    }, 500) // Match the fade-out duration
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-500 to-blue-700">
      <div 
        className={`text-center transition-all duration-500 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="mb-12">
          <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-5xl font-bold text-blue-600">AI</span>
          </div>
        </div>
        
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white">Welcome to Quippy</h1>
          <p className="text-2xl text-white/80 mt-4">Your AI-powered computer assistant</p>
        </div>

        <button
          onClick={handleClick}
          className="px-12 py-4 bg-white text-blue-600 rounded-xl font-bold text-2xl hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Get Started
        </button>
      </div>
    </div>
  )
} 
