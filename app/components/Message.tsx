import React from 'react';
import { Message as MessageType } from '../types';
import { formatTimestamp } from '../lib/formatting/date';
import { THEME } from '../constants/theme';

interface MessageProps {
  message: MessageType;
  isDarkMode: boolean;
}

export const Message: React.FC<MessageProps> = ({ message, isDarkMode }) => {
  const theme = isDarkMode ? THEME.DARK : THEME.LIGHT;

  return (
    <div
      className={`message p-4 rounded-xl ${
        message.type === 'user'
          ? isDarkMode
            ? 'bg-blue-600 text-white ml-auto'
            : 'bg-blue-500 text-white ml-auto'
          : isDarkMode
            ? 'bg-gray-800 text-white/90'
            : 'bg-white text-gray-800'
      }`}
    >
      <div className="flex items-start space-x-2">
        <div
          className={`w-8 h-8 rounded-full ${
            message.type === 'user'
              ? isDarkMode
                ? 'bg-white/20'
                : 'bg-white/30'
              : isDarkMode
                ? 'bg-white/20'
                : 'bg-blue-100'
          } flex items-center justify-center flex-shrink-0`}
        >
          <span className="text-sm font-bold">
            {message.type === 'user' ? 'U' : 'AI'}
          </span>
        </div>
        <div className="flex-1">
          <pre className="font-mono whitespace-pre-wrap leading-relaxed">
            {message.content}
          </pre>
          <div
            className={`text-xs mt-2 ${
              message.type === 'user'
                ? 'text-white/70'
                : isDarkMode
                  ? 'text-white/50'
                  : 'text-gray-500'
            }`}
          >
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
}; 