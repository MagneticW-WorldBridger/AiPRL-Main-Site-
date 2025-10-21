import React, { useState } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useAdminTheme } from '../hooks/useAdminTheme';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login, loading } = useAdminAuth();
  const { theme } = useAdminTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      theme === 'light' ? 'bg-gray-50' : 'bg-black'
    }`}>
      <div className={`max-w-md w-full mx-4 p-8 rounded-3xl border transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white border-gray-200 shadow-lg'
          : 'bg-white/[0.03] border-white/10 shadow-black/10'
      }`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
          </div>
          <h1 className={`text-2xl font-bold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Admin Login
          </h1>
          <p className={`text-sm mt-2 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Sign in to manage your blog content
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className={`w-5 h-5 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-colors duration-200 ${
                  theme === 'light'
                    ? 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                    : 'border-white/20 bg-black/40 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                }`}
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className={`w-5 h-5 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-12 py-3 border rounded-xl transition-colors duration-200 ${
                  theme === 'light'
                    ? 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                    : 'border-white/20 bg-black/40 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                  theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
              loading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className={`text-xs ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            AiprlAssist Blog Management System
          </p>
        </div>
      </div>
    </div>
  );
};

