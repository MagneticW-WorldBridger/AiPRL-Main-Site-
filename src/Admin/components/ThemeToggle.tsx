import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAdminTheme } from '../hooks/useAdminTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useAdminTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-all duration-200 ${
        theme === 'light'
          ? 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          : 'hover:bg-white/10 text-gray-400 hover:text-white'
      }`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};

