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
    
    // Check for "thank you" message and respond without scanning
    if (input.toLowerCase().includes('thank you')) {
      setMessages(prev => [...prev, {
        type: 'system',
        content: "You're welcome"
      }]);
      setInput('');
      return;
    }
    
    try {
      // Show scanning message
      setMessages(prev => [...prev, {
        type: 'system',
        content: 'Scanning your system...'
      }]);

      // Get real system info
      const systemInfo = await scanSystem();
      console.log('System Info:', systemInfo); // Debug log

      // Get the AI-generated solution
      const analysis = await analyzeProblem(input, systemInfo);

      // Combine system info and solution in one message
      setMessages(prev => [
        ...prev,
        {
          type: 'system',
          content:
            `OS: ${systemInfo.os}\n` +
            `CPU Usage: ${systemInfo.cpu.usage}%\n` +
            `Memory Usage: ${systemInfo.memory.usage}%\n` +
            `Disk Usage: ${systemInfo.diskSpace.usage}%\n\n` +
            analysis
        }
      ]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'system',
        content: 'Error scanning system: ' + (error instanceof Error ? error.message : 'Unknown error')
      }]);
    }
    
    setInput('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-0">
      <div className="command-prompt w-screen">
        {/* Modern Header */}
        <div className="bg-[#1a1a1a] text-white px-8 py-6 w-full shadow-xl">
          <div className="flex items-baseline">
            <h1 className="text-4xl font-bold tracking-tight text-[#00ff9d]">The Quippy</h1>
            <span className="ml-4 text-gray-300 font-medium"></span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-[60vh] overflow-auto bg-[#0a0a0a]">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${
                message.type === 'system' 
                  ? 'border-l-4 border-[#00ff9d]' 
                  : 'border-l-4 border-[#ff00ff]'
              }`}
            >
              <div className="flex items-start">
                <span className={`font-mono font-bold ${
                  message.type === 'system' 
                    ? 'text-[#00ff9d]' 
                    : 'text-[#ff00ff]'
                }`}>
                  {message.type === 'system' ? '>' : '$'}
                </span>
                <pre className="ml-4 font-mono whitespace-pre-line text-white">
                  {message.content}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="input-area w-full fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#333333]">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-center gap-0 w-full">
              <span className="text-[#00ff9d] font-mono font-bold text-2xl px-6">$</span>
              <div className="flex-1 flex items-center input-field">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-6 py-8 bg-transparent border-none focus:outline-none text-2xl w-full min-h-[80px] text-white placeholder-gray-500"
                  placeholder="Type your problem here..."
                />
                <button 
                  type="submit" 
                  className="px-10 py-6 bg-[#00ff9d] text-black hover:bg-[#00cc7d] transition-colors font-medium text-xl"
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