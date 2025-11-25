import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  User,
  UserCredential,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAhoywGRKhZ1WAJx4sOOd0xXUjUinjZIII",
  authDomain: "unab-sporting-court-b5294.firebaseapp.com",
  projectId: "unab-sporting-court-b5294",
  storageBucket: "unab-sporting-court-b5294.firebasestorage.app",
  messagingSenderId: "955105231764",
  appId: "1:955105231764:web:c4ab8c75ff9b3136870581",
  measurementId: "G-KN2KLY1N6L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

class FirebaseService {
  /**
   * Login with Google
   */
  async loginWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    try {
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (error: any) {
      console.error('Error en login con Google:', error);
      throw new Error(error.message || 'Error al iniciar sesión con Google');
    }
  }

  /**
   * Login with GitHub
   */
  async loginWithGithub(): Promise<UserCredential> {
    const provider = new GithubAuthProvider();
    provider.addScope('user:email');
    
    try {
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (error: any) {
      console.error('Error en login con GitHub:', error);
      throw new Error(error.message || 'Error al iniciar sesión con GitHub');
    }
  }

  /**
   * Get current Firebase user
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Get Firebase ID token
   */
  async getIdToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;
    
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return null;
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void) {
    return auth.onAuthStateChanged(callback);
  }
}

export default new FirebaseService();
