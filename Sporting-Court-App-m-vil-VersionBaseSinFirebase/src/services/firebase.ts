import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  User,
  UserCredential,
  OAuthProvider,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const firebaseConfig = {
  apiKey: "AIzaSyDJDdtpg40VafcpF12FWxr4sz2xCJQyioE",
  authDomain: "unab-sporting-court.firebaseapp.com",
  projectId: "unab-sporting-court",
  storageBucket: "unab-sporting-court.firebasestorage.app",
  messagingSenderId: "616387990630",
  appId: "1:616387990630:web:e46ba9cefc5a656fb4c9a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

class FirebaseService {
  /**
   * Login with Google usando expo-auth-session
   * Necesita el ID Token de Google para crear credenciales de Firebase
   */
  async loginWithGoogle(idToken: string): Promise<UserCredential> {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      return result;
    } catch (error: any) {
      console.error('Error en login con Google:', error);
      throw new Error(error.message || 'Error al iniciar sesión con Google');
    }
  }

  /**
   * Login with GitHub usando expo-auth-session
   * Necesita el access token de GitHub
   */
  async loginWithGithub(accessToken: string): Promise<UserCredential> {
    try {
      const credential = GithubAuthProvider.credential(accessToken);
      const result = await signInWithCredential(auth, credential);
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
