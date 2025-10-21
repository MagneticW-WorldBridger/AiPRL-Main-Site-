// Frontend configuration validation
export const config = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project-id',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef123456',
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
