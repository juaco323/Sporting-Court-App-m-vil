import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider } from './src/contexts/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Limpiar datos al iniciar para forzar login
    const initializeApp = async () => {
      try {
        // Limpiar todo al inicio para forzar nueva autenticación
        await AsyncStorage.clear();
      } catch (error) {
        console.error('Error clearing storage:', error);
      } finally {
        setIsReady(true);
      }
    };
    initializeApp();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <RootNavigator />
    </AuthProvider>
  );
}
