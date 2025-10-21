import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { config } from '../utils/config';

// Initialize Firebase
const app = initializeApp(config.firebase);
export const auth = getAuth(app);

// Sign in with email and password
export const signInAdmin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign out
export const signOutAdmin = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

