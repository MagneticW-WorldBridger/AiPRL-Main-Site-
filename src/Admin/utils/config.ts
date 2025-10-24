// Frontend configuration validation
export const config = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  firebase: {
    apiKey: 'disabled',
    authDomain: 'disabled',
    projectId: 'disabled',
    storageBucket: 'disabled',
    messagingSenderId: 'disabled',
    appId: 'disabled',
  }
};

// Validate required configuration
export const validateConfig = () => {
  console.log('✅ Configuration loaded successfully');
  console.log(`   - Backend URL: ${config.backendUrl}`);
  console.log(`   - Firebase Project: ${config.firebase.projectId}`);
  
  // Configuration is now optional with defaults
  // No errors will be thrown, just warnings
  if (config.backendUrl === 'http://localhost:5000') {
    console.warn('⚠️ Using default backend URL. Consider setting VITE_BACKEND_URL in .env.local');
  }
};

export default config;
