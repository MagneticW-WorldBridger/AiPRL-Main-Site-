import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { signInAdmin, signOutAdmin, onAuthStateChange, getCurrentUser } from '../services/firebaseAuth';

interface User {
  uid: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    console.log('AdminAuthContext: Initializing auth check');

    // Failsafe: Force loading to false after 10 seconds
    const failsafeTimeout = setTimeout(() => {
      console.warn('AdminAuthContext: Failsafe timeout triggered - forcing loading to false');
      setLoading(false);
    }, 10000);

    const checkAuth = async () => {
      try {
        // Check for existing token in localStorage
        const existingToken = localStorage.getItem('admin_token');
        console.log('AdminAuthContext: Existing token found:', !!existingToken);

        if (existingToken) {
          // Verify the token with backend
          console.log('AdminAuthContext: Verifying token with backend');
          await verifyToken(existingToken);
        } else {
          console.log('AdminAuthContext: No token found, setting loading to false');
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setLoading(false);
      } finally {
        clearTimeout(failsafeTimeout);
      }
    };

    checkAuth();

    return () => clearTimeout(failsafeTimeout);
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: tokenToVerify }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(tokenToVerify);
      } else {
        console.warn('Token verification failed, clearing auth');
        localStorage.removeItem('admin_token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('admin_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const getCustomToken = async (uid: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/auth/custom-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        localStorage.setItem('admin_token', data.token);
      } else {
        console.error('Failed to get custom token:', response.status);
        // Create a simple token for now
        const simpleToken = `admin-token-${uid}-${Date.now()}`;
        setToken(simpleToken);
        localStorage.setItem('admin_token', simpleToken);
      }
    } catch (error) {
      console.error('Error getting custom token:', error);
      // Create a simple token for now
      const simpleToken = `admin-token-${uid}-${Date.now()}`;
      setToken(simpleToken);
      localStorage.setItem('admin_token', simpleToken);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Direct login to backend
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser({
            uid: 'admin-user',
            email: email,
            isAdmin: true
          });
          setToken(data.token);
          localStorage.setItem('admin_token', data.token);
        } else {
          throw new Error(data.message || 'Login failed');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear local state
      setUser(null);
      setToken(null);
      localStorage.removeItem('admin_token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getFirebaseToken = async (email: string, password: string): Promise<string> => {
    // For now, we'll use a simple mock token
    // In production, you would implement proper Firebase Auth here
    return 'mock-firebase-token';
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
