import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Eye, 
  EyeOff,
  Upload,
  Trash2,
  Bell,
  Shield,
  Palette,
  Globe,
  Database
} from 'lucide-react';
import { useAdminTheme } from '../hooks/useAdminTheme';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useAdminTheme();
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'appearance' | 'notifications' | 'backup'>('general');
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'AiprlAssist',
    siteDescription: 'AI-powered assistant for your business needs',
    siteUrl: 'https://aiprlassist.com',
    adminEmail: 'admin@aiprlassist.com',
    timezone: 'UTC',
    language: 'en',
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordMinLength: 8,
    loginAttempts: 5,
    ipWhitelist: '',
    
    // Appearance Settings
    primaryColor: '#f97316',
    secondaryColor: '#1f2937',
    logo: '',
    favicon: '',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    blogPublishNotification: true,
    userRegistrationNotification: true,
    systemAlerts: true,
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30,
    cloudBackup: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success message
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'backup', label: 'Backup', icon: Database }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white border-gray-200'
          : 'bg-white/[0.03] border-white/10'
      }`}>
        <h3 className={`text-xl font-semibold mb-6 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          Site Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleInputChange('siteName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl transition-colors duration-200 ${
                theme === 'light'
                  ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                  : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
              } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Site URL
            </label>
            <input
              type="url"
              value={settings.siteUrl}
              onChange={(e) => handleInputChange('siteUrl', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl transition-colors duration-200 ${
                theme === 'light'
                  ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                  : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
              } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Site Description
          </label>
          <textarea
            value={settings.siteDescription}
            onChange={(e) => handleInputChange('siteDescription', e.target.value)}
            rows={3}
            className={`w-full px-4 py-3 border rounded-xl transition-colors duration-200 ${
              theme === 'light'
                ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
            } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
          />
        </div>
      </div>
      
      <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white border-gray-200'
          : 'bg-white/[0.03] border-white/10'
      }`}>
        <h3 className={`text-xl font-semibold mb-6 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          Regional Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl transition-colors duration-200 ${
                theme === 'light'
                  ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                  : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
              } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl transition-colors duration-200 ${
                theme === 'light'
                  ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                  : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
              } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Admin Email
            </label>
            <input
              type="email"
              value={settings.adminEmail}
              onChange={(e) => handleInputChange('adminEmail', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl transition-colors duration-200 ${
                theme === 'light'
                  ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                  : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
              } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white border-gray-200'
          : 'bg-white/[0.03] border-white/10'
      }`}>
        <h3 className={`text-xl font-semibold mb-6 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          Authentication
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`font-medium ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Two-Factor Authentication
              </h4>
              <p className={`text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                Add an extra layer of security to your account
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                className={`w-full px-4 py-3 border rounded-xl transition-colors duration-200 ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                    : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Password Minimum Length
              </label>
              <input
                type="number"
                value={settings.passwordMinLength}
                onChange={(e) => handleInputChange('passwordMinLength', parseInt(e.target.value))}
                className={`w-full px-4 py-3 border rounded-xl transition-colors duration-200 ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                    : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white border-gray-200'
          : 'bg-white/[0.03] border-white/10'
      }`}>
        <h3 className={`text-xl font-semibold mb-6 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          Theme Settings
        </h3>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`font-medium ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Dark Mode
            </h4>
            <p className={`text-sm ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Toggle between light and dark themes
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
          </button>
        </div>
      </div>
      
      <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white border-gray-200'
          : 'bg-white/[0.03] border-white/10'
      }`}>
        <h3 className={`text-xl font-semibold mb-6 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          Brand Colors
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Primary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                className={`flex-1 px-4 py-3 border rounded-xl transition-colors duration-200 ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                    : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
              />
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Secondary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.secondaryColor}
                onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={settings.secondaryColor}
                onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                className={`flex-1 px-4 py-3 border rounded-xl transition-colors duration-200 ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                    : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white border-gray-200'
          : 'bg-white/[0.03] border-white/10'
      }`}>
        <h3 className={`text-xl font-semibold mb-6 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          Notification Preferences
        </h3>
        
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
            { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser push notifications' },
            { key: 'blogPublishNotification', label: 'Blog Publish Alerts', description: 'Get notified when blogs are published' },
            { key: 'userRegistrationNotification', label: 'User Registration Alerts', description: 'Get notified when new users register' },
            { key: 'systemAlerts', label: 'System Alerts', description: 'Receive important system notifications' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <h4 className={`font-medium ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {item.label}
                </h4>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {item.description}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[item.key as keyof typeof settings] as boolean}
                  onChange={(e) => handleInputChange(item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white border-gray-200'
          : 'bg-white/[0.03] border-white/10'
      }`}>
        <h3 className={`text-xl font-semibold mb-6 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          Backup Configuration
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`font-medium ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Automatic Backups
              </h4>
              <p className={`text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                Automatically backup your data
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) => handleInputChange('autoBackup', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Backup Frequency
              </label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl transition-colors duration-200 ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                    : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Backup Retention (days)
              </label>
              <input
                type="number"
                value={settings.backupRetention}
                onChange={(e) => handleInputChange('backupRetention', parseInt(e.target.value))}
                className={`w-full px-4 py-3 border rounded-xl transition-colors duration-200 ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                    : 'border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black/40 text-white'}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Settings
          </h1>
          <p className={`text-lg mt-2 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Configure your application settings
          </p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
            isSaving
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          <Save className="w-4 h-4 mr-2 inline" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className={`lg:w-64 p-6 rounded-3xl border transition-colors duration-300 ${
          theme === 'light'
            ? 'bg-white border-gray-200'
            : 'bg-white/[0.03] border-white/10'
        }`}>
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-orange-500 text-white'
                      : theme === 'light'
                      ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'appearance' && renderAppearanceSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'backup' && renderBackupSettings()}
        </div>
      </div>
    </div>
  );
};

