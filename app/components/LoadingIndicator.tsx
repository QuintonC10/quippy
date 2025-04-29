import React from 'react';
import { THEME } from '../constants/theme';

interface LoadingIndicatorProps {
  isDarkMode: boolean;
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  isDarkMode,
  message = 'Scanning your system...',
}) => {
  return (
    <div
      className={`message p-4 rounded-xl ${
        isDarkMode ? 'bg-gray-800 text-white/90' : 'bg-white text-gray-800'
      }`}
    >
      <div className="flex items-center space-x-2">
        <div className="loading-spinner w-5 h-5" />
        <span>{message}</span>
      </div>
    </div>
  );
}; 