import React, { useState, type ReactNode } from 'react';
import { AdminNavbar } from './AdminNavbar';
import { AdminSidebar } from './AdminSidebar';
import { useAdminTheme } from '../hooks/useAdminTheme';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { theme } = useAdminTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'light'
        ? 'bg-gray-50 text-gray-900'
        : 'bg-black text-white'
    }`}>
      <AdminNavbar onMenuClick={toggleSidebar} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 w-full lg:ml-64 p-4 md:p-6 pt-20 md:pt-24">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

