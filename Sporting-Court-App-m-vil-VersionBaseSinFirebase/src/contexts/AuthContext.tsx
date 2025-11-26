import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import ApiService from '../services/api';
import { User, LoginCredentials, RegisterData } from '../types';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  loginWithFirebase: (firebaseToken: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await ApiService.getCurrentUser();
      setUser(storedUser);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await ApiService.login(credentials);
      setUser(response.user);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
        throw new Error('No se pudo conectar al servidor. Verifica tu conexión.');
      }
      throw new Error(error.response?.data?.detail || error.message || 'Error al iniciar sesión');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await ApiService.register(data);
      setUser(response.user);
    } catch (error: any) {
      console.error('Register error:', error);
      if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
        throw new Error('No se pudo conectar al servidor. Verifica tu conexión.');
      }
      const errorMessage = error.response?.data?.detail;
      if (typeof errorMessage === 'string') {
        throw new Error(errorMessage);
      } else if (Array.isArray(errorMessage)) {
        throw new Error(errorMessage[0]?.msg || 'Error al registrarse');
      }
      throw new Error(error.message || 'Error al registrarse');
    }
  };

  const loginWithFirebase = async (firebaseToken: string, email: string) => {
    try {
      const response = await ApiService.loginWithFirebase(firebaseToken, email);
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Error con Firebase');
    }
  };

  const logout = async () => {
    await ApiService.logout();
    setUser(null);
  };

  const setToken = async (token: string) => {
    await ApiService.setAuthToken(token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithFirebase,
        logout,
        setUser,
        setToken,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
