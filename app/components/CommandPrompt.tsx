"use client";

import React, { useState, useEffect, useRef } from 'react';
import { scanSystem, analyzeProblem } from '../utils/systemScanner';
import ChatInput from './ChatInput';
import { Copy, Trash2, Sun, Moon } from 'lucide-react';

interface Message {
  type: 'user' | 'system';
  content: string;
  timestamp: Date;
}

export default function CommandPrompt() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'system',
      content: 'Hello! What problem are you experiencing with your machine?',
      timestamp: new Date()
    }
  ]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle theme initialization after mount
  useEffect(() => {
    setIsMounted(true);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  const handleNewScan = async () => {
    setIsLoading(true);
    setMessages([{
      type: 'system',
      content: 'Hello! What problem are you experiencing with your machine?',
      timestamp: new Date()
    }]);
    
    setMessages(prev => [...prev, {
      type: 'system',
      content: 'Scanning your system...',
      timestamp: new Date()
    }]);

    try {
      const systemInfo = await scanSystem();
      console.log('System Info:', systemInfo);

      setMessages(prev => [
        ...prev,
        {
          type: 'system',
          content:
            `OS: ${systemInfo.os}\n` +
            `CPU Usage: ${systemInfo.cpu.usage}%\n` +
            `Memory Usage: ${systemInfo.memory.usage}%\n` +
            `Disk Usage: ${systemInfo.diskSpace.usage}%`,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'system',
        content: 'Error scanning system: ' + (error instanceof Error ? error.message : 'Unknown error'),
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    setMessages(prev => [...prev, { 
      type: 'user', 
      content: message,
      timestamp: new Date()
    }]);
    
    if (message.toLowerCase().includes('thank you')) {
      setMessages(prev => [...prev, {
        type: 'system',
        content: "You're welcome",
        timestamp: new Date()
      }]);
      return;
    }
    
    setIsLoading(true);
    try {
      setMessages(prev => [...prev, {
        type: 'system',
        content: 'Scanning your system...',
        timestamp: new Date()
      }]);

      const systemInfo = await scanSystem();
      const analysis = await analyzeProblem(message, systemInfo);

      setMessages(prev => [
        ...prev,
        {
          type: 'system',
          content:
            `OS: ${systemInfo.os}\n` +
            `CPU Usage: ${systemInfo.cpu.usage}%\n` +
            `Memory Usage: ${systemInfo.memory.usage}%\n` +
            `Disk Usage: ${systemInfo.diskSpace.usage}%\n\n` +
            analysis,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'system',
        content: 'Error scanning system: ' + (error instanceof Error ? error.message : 'Unknown error'),
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      type: 'system',
      content: 'Hello! What problem are you experiencing with your machine?',
      timestamp: new Date()
    }]);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen">
      <div className="command-prompt">
        {/* Header */}
        <div className={`${
          isDarkMode 
            ? 'bg-gray-800 text-white' 
            : 'bg-blue-600 text-white'
        } px-8 py-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full ${
                isDarkMode ? 'bg-white/20' : 'bg-white/30'
              } flex items-center justify-center animate-pulse`}>
                <span className="text-xl font-bold">AI</span>
              </div>
              <h1 className={`text-2xl font-bold ${
                isDarkMode 
                  ? 'bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100' 
                  : 'text-white'
              }`}>The Quippy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={clearChat}
                className={`button px-4 py-2 rounded-lg ${
                  isDarkMode ? 'bg-white/20' : 'bg-white/30'
                } hover:bg-white/40 transition-colors font-medium`}
                aria-label="Clear chat"
              >
                Clear Chat
              </button>
              <button 
                onClick={handleNewScan}
                className={`button px-4 py-2 rounded-lg ${
                  isDarkMode ? 'bg-white/20' : 'bg-white/30'
                } hover:bg-white/40 transition-colors font-medium`}
                aria-label="New scan"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner w-5 h-5" />
                ) : (
                  'New Scan'
                )}
              </button>
              {isMounted && (
                <button 
                  onClick={toggleTheme}
                  className={`button px-4 py-2 rounded-lg ${
                    isDarkMode ? 'bg-white/20' : 'bg-white/30'
                  } hover:bg-white/40 transition-colors font-medium`}
                  aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className={`h-[70vh] overflow-auto p-6 ${
          isDarkMode 
            ? 'bg-gray-900' 
            : 'bg-gray-50'
        } flex flex-col justify-center items-center`}>
          {messages.length === 1 ? (
            <div className={`message p-8 rounded-xl transform transition-all duration-300 animate-fade-in ${
              isDarkMode
                ? 'bg-gray-800 border-l-4 border-blue-400 shadow-lg'
                : 'bg-white border-l-4 border-blue-500 shadow-sm'
            }`}>
              <div className="flex items-center justify-center">
                <pre className={`font-mono whitespace-pre-wrap leading-relaxed text-2xl text-center ${
                  isDarkMode ? 'text-white/90' : 'text-gray-800'
                }`}>
                  {messages[0].content}
                </pre>
              </div>
              <div className={`message-timestamp text-center ${
                isDarkMode ? 'text-white/50' : 'text-gray-500'
              }`}>
                {formatTimestamp(messages[0].timestamp)}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`message mb-4 p-4 rounded-xl transform transition-all duration-300 hover:scale-[1.02] w-full max-w-3xl ${
                  message.type === 'system' 
                    ? isDarkMode
                      ? 'bg-gray-800 border-l-4 border-blue-400 shadow-lg hover:shadow-blue-500/20' 
                      : 'bg-white border-l-4 border-blue-500 shadow-sm hover:shadow-md'
                    : isDarkMode
                      ? 'bg-gray-800 border-l-4 border-purple-400 shadow-lg hover:shadow-purple-500/20'
                      : 'bg-white border-l-4 border-gray-300 shadow-sm hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => copyToClipboard(message.content)}
                  className={`copy-button p-1 rounded-full ${
                    isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                  aria-label="Copy message"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <div className="flex items-start">
                  <pre className={`font-mono whitespace-pre-wrap leading-relaxed text-lg ${
                    isDarkMode ? 'text-white/90' : 'text-gray-800'
                  }`}>
                    {message.content}
                  </pre>
                </div>
                <div className={`message-timestamp ${
                  isDarkMode ? 'text-white/50' : 'text-gray-500'
                }`}>
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <ChatInput onSend={handleSendMessage} isDarkMode={isDarkMode} isLoading={isLoading} />
      </div>
    </div>
  );
}