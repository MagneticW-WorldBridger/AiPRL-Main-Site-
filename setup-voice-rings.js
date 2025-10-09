import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Setting up voice rings dependencies...');

try {
  // Install dependencies for standalone-voice-rings
  execSync('npm install', { 
    cwd: path.join(__dirname, 'standalone-voice-rings'),
    stdio: 'inherit'
  });
  
  console.log('✅ Voice rings dependencies installed successfully!');
  console.log('You can now run "npm run dev" to start both the frontend and voice rings server.');
} catch (error) {
  console.error('❌ Error installing voice rings dependencies:', error.message);
  process.exit(1);
}
