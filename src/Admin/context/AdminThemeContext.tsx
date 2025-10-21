import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const AdminThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useAdminTheme = () => {
  const context = useContext(AdminThemeContext);
  if (context === undefined) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  return context;
};

interface AdminThemeProviderProps {
  children: ReactNode;
}

export const AdminThemeProvider: React.FC<AdminThemeProviderProps> = ({ children }) => {
  console.log('AdminThemeProvider: Initializing');

  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('admin_theme');
    const initialTheme = (stored as Theme) || 'dark';
    console.log('AdminThemeProvider: Initial theme:', initialTheme);
    return initialTheme;
  });

  useEffect(() => {
    console.log('AdminThemeProvider: Applying theme:', theme);
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);

    // Add/remove theme classes
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }

    // Store theme preference
    localStorage.setItem('admin_theme', theme);
    console.log('AdminThemeProvider: Theme applied successfully');
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <AdminThemeContext.Provider value={value}>
      {children}
    </AdminThemeContext.Provider>
  );
};

