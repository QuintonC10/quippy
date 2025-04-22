'use client'

import { useState, useEffect } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import CommandPrompt from './components/CommandPrompt'

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true)

  return (
    <main className="min-h-screen w-full">
      {showWelcome ? (
        <WelcomeScreen onStart={() => setShowWelcome(false)} />
      ) : (
        <CommandPrompt />
      )}
    </main>
  )
}