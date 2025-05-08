'use client'

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { scanSystem, analyzeProblem } from './utils/systemScanner';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMain, setShowMain] = useState(false);
  const [userProblem, setUserProblem] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);
  const apiKeyInputRef = useRef(null);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setIsDarkMode(e.matches);
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Try to load API key from localStorage on mount
    const storedKey = typeof window !== 'undefined' ? localStorage.getItem('GEMINI_API_KEY') : '';
    if (storedKey) setApiKey(storedKey);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  const handleSystemScan = async () => {
    if (!apiKey) {
      setShowApiKeyPrompt(true);
      setTimeout(() => apiKeyInputRef.current?.focus(), 100);
      return;
    }
    setIsLoading(true);
    setError('');
    setAiAnalysis('');
    setScanResult(null);
    try {
      const systemInfo = await scanSystem();
      setScanResult(systemInfo);
      const analysis = await analyzeProblem(userProblem, systemInfo, apiKey);
      setAiAnalysis(analysis);
    } catch (err) {
      setError('Failed to scan system or analyze problem.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setUserProblem('');
    setScanResult(null);
    setAiAnalysis('');
    setError('');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleNewScan = () => {
    setUserProblem('');
    setScanResult(null);
    setAiAnalysis('');
    setError('');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('GEMINI_API_KEY', apiKey.trim());
      setShowApiKeyPrompt(false);
    }
  };

  if (!showMain) {
    return (
      <div style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(to bottom, #f1f5fd 0%, #fff 100%)', position: 'relative' }}>
        {/* Theme Toggle Button */}
        <div style={{ position: 'absolute', top: 24, right: 32, zIndex: 10 }}>
          <div className="theme-toggle" onClick={toggleTheme} style={{ cursor: 'pointer' }} title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            <span className="theme-icon" role="img" aria-label={isDarkMode ? 'Light mode' : 'Dark mode'}>
              {isDarkMode ? '☀️' : '🌙'}
            </span>
          </div>
        </div>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 800,
            background: 'linear-gradient(90deg, #2563eb 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}>
            Welcome to The Quippy
          </h1>
          <p style={{ fontSize: '1.5rem', color: '#475569', marginBottom: '2.5rem', textAlign: 'center', maxWidth: 600 }}>
            Your AI-powered companion for effortless computer diagnostics and optimization.
          </p>
          <button
            style={{
              background: '#2563eb',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1.25rem',
              border: 'none',
              borderRadius: '0.75rem',
              padding: '0.9rem 2.5rem',
              boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onClick={() => setShowMain(true)}
          >
            Start Your Journey
          </button>
        </div>
        {showApiKeyPrompt && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <form onSubmit={handleApiKeySubmit} style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 4px 32px rgba(0,0,0,0.15)', minWidth: 320 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#2563eb' }}>Enter Gemini API Key</h2>
              <input
                ref={apiKeyInputRef}
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Paste your Gemini API key here..."
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid #e5e7eb', marginBottom: 16, fontSize: 16 }}
                required
              />
              <button type="submit" style={{ background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', borderRadius: 8, padding: '0.7rem 2rem', cursor: 'pointer' }}>
                Save Key
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <header className="header">
        <a href="/" className="logo">The Quippy</a>
        <div className="header-actions">
          <button className="header-button" onClick={handleNewScan}>New Scan</button>
          <button className="header-button" onClick={handleClearChat}>Clear Chat</button>
          <div className="theme-toggle" onClick={toggleTheme} style={{ cursor: 'pointer' }} title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            <span className="theme-icon" role="img" aria-label={isDarkMode ? 'Light mode' : 'Dark mode'}>
              {isDarkMode ? '☀️' : '🌙'}
            </span>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div className="hero-tag">AI-Powered Diagnostics</div>
          <h1 className="hero-title">The Quippy</h1>
          <p className="hero-description">
            Instantly diagnose and fix computer issues with our advanced AI
            technology that scans your system and provides expert solutions.
          </p>
        </section>

        <div className="assistant-card">
          <div className="assistant-header">
            <MessageSquare className="assistant-icon" size={24} />
            <h2 className="assistant-title">AI Assistant</h2>
          </div>
          <p className="assistant-description">
            Please describe your computer problem below and our AI will analyze your system and provide solutions.
          </p>
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              ref={inputRef}
              className="input-field"
              type="text"
              placeholder="Describe your computer problem..."
              value={userProblem}
              onChange={e => setUserProblem(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', marginBottom: '0.5rem' }}
              onKeyDown={e => { if (e.key === 'Enter' && !isLoading && userProblem.trim()) handleSystemScan(); }}
            />
            <button
              className="primary-button"
              onClick={handleSystemScan}
              disabled={isLoading || !userProblem.trim()}
              style={{ minWidth: 56, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
              aria-label="Send"
            >
              {isLoading ? (
                <span style={{ fontSize: 16, fontWeight: 600 }}>...</span>
              ) : (
                <Send size={24} />
              )}
            </button>
          </div>
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
          {scanResult && (
            <div className="chat-message" style={{ marginBottom: '1rem' }}>
              <div className="message-content">
                <strong>System Info:</strong><br />
                OS: {scanResult.os}<br />
                CPU Usage: {scanResult.cpu.usage}%<br />
                Memory Usage: {scanResult.memory.usage}%<br />
                Disk Usage: {scanResult.diskSpace.usage}%
              </div>
            </div>
          )}
          {aiAnalysis && (
            <div className="chat-message">
              <div className="message-content" style={{ whiteSpace: 'pre-line' }}>
                {aiAnalysis}
              </div>
            </div>
          )}
        </div>
        {showApiKeyPrompt && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <form onSubmit={handleApiKeySubmit} style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 4px 32px rgba(0,0,0,0.15)', minWidth: 320 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#2563eb' }}>Enter Gemini API Key</h2>
              <input
                ref={apiKeyInputRef}
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Paste your Gemini API key here..."
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid #e5e7eb', marginBottom: 16, fontSize: 16 }}
                required
              />
              <button type="submit" style={{ background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', borderRadius: 8, padding: '0.7rem 2rem', cursor: 'pointer' }}>
                Save Key
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}