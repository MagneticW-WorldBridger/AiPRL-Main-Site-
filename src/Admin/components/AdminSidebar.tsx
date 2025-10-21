import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  Settings, 
  BarChart3,
  Users,
  Image,
  Calendar
} from 'lucide-react';
import { useAdminTheme } from '../hooks/useAdminTheme';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, to, isActive }) => {
  const { theme } = useAdminTheme();

  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-orange-500 text-white'
          : theme === 'light'
          ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          : 'text-gray-400 hover:bg-white/10 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { theme } = useAdminTheme();
  const location = useLocation();

  const menuItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'Dashboard',
      to: '/admin/dashboard',
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'All Blogs',
      to: '/admin/blogs',
    },
    {
      icon: <Plus className="w-5 h-5" />,
      label: 'New Blog',
      to: '/admin/blogs/new',
    },
    {
      icon: <Image className="w-5 h-5" />,
      label: 'Media',
      to: '/admin/media',
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Demo Bookings',
      to: '/admin/demo-bookings',
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: 'Analytics',
      to: '/admin/analytics',
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Users',
      to: '/admin/users',
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
      to: '/admin/settings',
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-16 md:top-16 bottom-0 w-64 border-r transition-all duration-300 z-40 ${
        theme === 'light'
          ? 'bg-white border-gray-200'
          : 'bg-black border-white/10'
      } ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="p-4 md:p-6 overflow-y-auto h-full">
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <div key={index} onClick={onClose}>
              <SidebarItem
                icon={item.icon}
                label={item.label}
                to={item.to}
                isActive={location.pathname === item.to}
              />
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};
