import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Edit,
  Trash2
} from 'lucide-react';
import { useAdminTheme } from '../hooks/useAdminTheme';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  joinDate: string;
  avatar?: string;
}

export const UserManagement: React.FC = () => {
  const { theme } = useAdminTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'editor' | 'viewer'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-01-15T10:30:00Z',
        joinDate: '2023-06-15T09:00:00Z',
        avatar: '/api/placeholder/40/40'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'editor',
        status: 'active',
        lastLogin: '2024-01-14T15:45:00Z',
        joinDate: '2023-08-20T14:30:00Z',
        avatar: '/api/placeholder/40/40'
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        role: 'viewer',
        status: 'inactive',
        lastLogin: '2024-01-10T08:20:00Z',
        joinDate: '2023-11-10T11:15:00Z',
        avatar: '/api/placeholder/40/40'
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        role: 'editor',
        status: 'pending',
        lastLogin: '2024-01-12T16:30:00Z',
        joinDate: '2024-01-12T16:30:00Z',
        avatar: '/api/placeholder/40/40'
      },
      {
        id: '5',
        name: 'David Brown',
        email: 'david@example.com',
        role: 'viewer',
        status: 'active',
        lastLogin: '2024-01-13T12:15:00Z',
        joinDate: '2023-09-05T10:45:00Z',
        avatar: '/api/placeholder/40/40'
      }
    ];
    setUsers(mockUsers);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleRoleChange = (userId: string, newRole: User['role']) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedUsers.length === 0) return;
    
    const actionText = action === 'delete' ? 'delete' : 
                     action === 'activate' ? 'activate' : 'deactivate';
    
    if (window.confirm(`Are you sure you want to ${actionText} ${selectedUsers.length} selected users?`)) {
      if (action === 'delete') {
        setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
        setSelectedUsers([]);
      } else {
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, status: action === 'activate' ? 'active' : 'inactive' }
            : user
        ));
        setSelectedUsers([]);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'inactive':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'editor':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'viewer':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            User Management
          </h1>
          <p className={`text-lg mt-2 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Manage user accounts and permissions
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            <Users className="w-4 h-4 mr-2 inline" />
            Add User
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white border-gray-200'
          : 'bg-white/[0.03] border-white/10'
      }`}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-xl transition-colors duration-200 ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                    : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className={`px-4 py-2 border rounded-xl transition-colors duration-200 ${
                theme === 'light'
                  ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                  : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
              } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className={`px-4 py-2 border rounded-xl transition-colors duration-200 ${
                theme === 'light'
                  ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                  : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
              } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className={`p-4 rounded-2xl border transition-colors duration-300 ${
          theme === 'light'
            ? 'bg-orange-50 border-orange-200'
            : 'bg-orange-500/10 border-orange-500/20'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${
              theme === 'light' ? 'text-orange-800' : 'text-orange-200'
            }`}>
              {selectedUsers.length} user(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className={`rounded-3xl border transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white border-gray-200'
          : 'bg-white/[0.03] border-white/10'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${
                theme === 'light' ? 'border-gray-200' : 'border-white/10'
              }`}>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                  />
                </th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  User
                </th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Role
                </th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Status
                </th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Last Login
                </th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`border-b ${
                  theme === 'light' ? 'border-gray-100' : 'border-white/5'
                } hover:${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'} transition-colors duration-200`}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        <img
                          src={user.avatar || '/api/placeholder/40/40'}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${
                          theme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>
                          {user.name}
                        </p>
                        <p className={`text-sm ${
                          theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors duration-200 ${getRoleColor(user.role)}`}
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user.id, e.target.value as User['status'])}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors duration-200 ${getStatusColor(user.status)}`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm ${
                      theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {formatDate(user.lastLogin)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        className={`p-1 rounded transition-colors duration-200 ${
                          theme === 'light'
                            ? 'text-gray-600 hover:bg-gray-100'
                            : 'text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className={`p-1 rounded transition-colors duration-200 ${
                          theme === 'light'
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-red-400 hover:bg-red-500/10'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className={`p-12 text-center rounded-3xl border transition-colors duration-300 ${
          theme === 'light'
            ? 'bg-white border-gray-200'
            : 'bg-white/[0.03] border-white/10'
        }`}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            No users found
          </h3>
          <p className={`${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

