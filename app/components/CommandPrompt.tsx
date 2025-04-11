"use client";

import React, { useState } from 'react';
import { scanSystem, analyzeProblem } from '../utils/systemScanner';

interface Message {
  type: 'user' | 'system';
  content: string;
}

export default function CommandPrompt() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'system',
      content: 'Hello! What problem are you experiencing with your machine?'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: input }]);
    
    try {
      // Show scanning message
      setMessages(prev => [...prev, {
        type: 'system',
        content: 'Scanning your system...'
      }]);

      // Get real system info
      const systemInfo = await scanSystem();
      const analysis = await analyzeProblem(input, systemInfo);

      // Add the analysis to messages
      setMessages(prev => [...prev, {
        type: 'system',
        content: analysis
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'system',
        content: 'Error scanning system: ' + (error instanceof Error ? error.message : 'Unknown error')
      }]);
    }
    
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-0">
      <div className="command-prompt w-screen">
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-5 w-full">
          <div className="flex items-baseline">
            <h1 className="text-4xl font-bold tracking-tight">The Quippy</h1>
            <span className="ml-4 text-blue-100 font-medium"></span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-[60vh] overflow-auto bg-white">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${
                message.type === 'system' 
                  ? 'border-l-4 border-blue-500' 
                  : 'border-l-4 border-green-500'
              }`}
            >
              <div className="flex items-start">
                <span className={`font-mono font-bold ${
                  message.type === 'system' 
                    ? 'text-blue-500' 
                    : 'text-green-500'
                }`}>
                  {message.type === 'system' ? '>' : '$'}
                </span>
                <span className="ml-4 whitespace-pre-wrap">
                  {message.content}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="input-area w-full">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-center gap-0 w-full">
              <span className="text-blue-600 font-mono font-bold text-lg px-4">$</span>
              <div className="flex-1 flex items-center input-field">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-4 py-5 bg-transparent border-none focus:outline-none text-lg w-full"
                  placeholder="Type your problem here..."
                />
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
                >
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}