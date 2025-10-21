import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useAdminTheme } from '../hooks/useAdminTheme';
import { ThemeToggle } from './ThemeToggle';

interface AdminNavbarProps {
  onMenuClick?: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAdminAuth();
  const { theme } = useAdminTheme();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${
      theme === 'light'
        ? 'bg-white border-gray-200'
        : 'bg-black border-white/10'
    }`}>
      <div className="px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Menu button (mobile) + Logo */}
          <div className="flex items-center space-x-3">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
                theme === 'light'
                  ? 'hover:bg-gray-100 text-gray-600'
                  : 'hover:bg-white/10 text-gray-400'
              }`}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className={`text-lg md:text-xl font-bold hidden sm:block ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                AiprlAssist Admin
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className={`text-sm font-medium ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {user?.email}
                  </p>
                  <p className={`text-xs ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Admin
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  theme === 'light'
                    ? 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                    : 'hover:bg-white/10 text-gray-400 hover:text-white'
                }`}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

