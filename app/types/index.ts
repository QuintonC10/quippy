export interface Message {
  type: 'user' | 'system';
  content: string;
  timestamp: Date;
}

export interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export interface SystemInfo {
  os: string;
  cpu: {
    usage: number;
  };
  memory: {
    usage: number;
  };
  diskSpace: {
    usage: number;
  };
}

export interface ChatInputProps {
  onSend: (message: string) => void;
  isDarkMode: boolean;
  isLoading: boolean;
} 