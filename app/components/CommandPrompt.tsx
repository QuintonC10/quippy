"use client";

import React, { useState, useEffect, useRef } from 'react';
import { scanSystem, analyzeProblem } from '../lib/system/scanner';
import ChatInput from './ChatInput';
import { Message } from './Message';
import { ThemeToggle } from './ThemeToggle';
import { LoadingIndicator } from './LoadingIndicator';
import { Message as MessageType, ThemeState } from '../types';
import { THEME } from '../constants/theme';

export default function CommandPrompt() {
  const [messages, setMessages] = useState<MessageType[]>([
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

  useEffect(() => {
    setIsMounted(true);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');

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
    
    try {
      const systemInfo = await scanSystem();
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
                New Scan
              </button>
              {isMounted && (
                <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
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
            <div className={`message w-full max-w-2xl p-8 rounded-xl transform transition-all duration-300 animate-fade-in ${
              isDarkMode
                ? 'bg-gray-800 border-l-4 border-blue-400 shadow-lg'
                : 'bg-white border-l-4 border-blue-500 shadow-sm'
            }`}>
              <div className="flex flex-col items-center justify-center">
                <pre className={`font-mono whitespace-pre-wrap leading-relaxed text-2xl text-center ${
                  isDarkMode ? 'text-white/90' : 'text-gray-800'
                }`}>
                  {messages[0].content}
                </pre>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-2xl space-y-4">
              {messages.map((message, index) => (
                <Message key={index} message={message} isDarkMode={isDarkMode} />
              ))}
              {isLoading && <LoadingIndicator isDarkMode={isDarkMode} />}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <ChatInput onSend={handleSendMessage} isDarkMode={isDarkMode} isLoading={isLoading} />
      </div>
    </div>
  );
}