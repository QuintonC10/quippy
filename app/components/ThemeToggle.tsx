import React from 'react';
import { ThemeState } from '../types';

interface ThemeToggleProps extends ThemeState {}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className={`button px-4 py-2 rounded-lg ${
        isDarkMode ? 'bg-white/20' : 'bg-white/30'
      } hover:bg-white/40 transition-colors font-medium`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}; 