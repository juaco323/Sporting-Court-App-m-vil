import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import FirebaseService from '../services/firebase';
import ApiService from '../services/api';
import { config } from '../config';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }: any) {
  const { login, setUser, setToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  // Configurar Google Auth con el Client ID de Android
  // En Development Build, solo se necesita el androidClientId
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: config.GOOGLE_OAUTH.androidClientId,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        handleGoogleLogin(id_token);
      }
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (idToken: string) => {
    setLoadingGoogle(true);
    try {
      // Autenticar con Firebase
      const firebaseResult = await FirebaseService.loginWithGoogle(idToken);
      const firebaseUser = firebaseResult.user;

      // Registrar/Login en el backend
      try {
        // Intentar login primero
        const backendResult = await ApiService.loginWithFirebase({
          firebase_uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          full_name: firebaseUser.displayName || 'Usuario Google',
        });
        
        setToken(backendResult.access_token);
        setUser(backendResult.user);
      } catch (error: any) {
        // Si no existe, registrar
        if (error.response?.status === 404 || error.response?.status === 401) {
          const registerResult = await ApiService.registerWithFirebase({
            firebase_uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            full_name: firebaseUser.displayName || 'Usuario Google',
            rut: `GOOGLE-${firebaseUser.uid.substring(0, 8)}`,
          });
          
          setToken(registerResult.access_token);
          setUser(registerResult.user);
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      console.error('Error en login con Google:', error);
      Alert.alert('Error', 'No se pudo iniciar sesión con Google');
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>UNAB Sporting Court</Text>
          <Text style={styles.subtitle}>Reserva tu cancha deportiva</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="ejemplo@mail.cl"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />

            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o continúa con</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[styles.button, styles.buttonGoogle]}
              onPress={() => promptAsync()}
              disabled={loading || loadingGoogle || !request}
            >
              {loadingGoogle ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.socialIcon}>🔵</Text>
                  <Text style={styles.buttonText}>Continuar con Google</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => navigation.navigate('Register')}
              disabled={loading}
            >
              <Text style={styles.buttonSecondaryText}>Crear Cuenta Nueva</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    color: '#1a1a1a',
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
    marginBottom: 16,
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonGoogle: {
    backgroundColor: '#4285F4',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 14,
  },
});
