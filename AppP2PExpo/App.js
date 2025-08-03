import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar 
        style="auto" 
        backgroundColor={Platform.OS === 'android' ? '#ffffff' : undefined}
        translucent={false}
      />
      <AppNavigator />
    </AuthProvider>
  );
}
