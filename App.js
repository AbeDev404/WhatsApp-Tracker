import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, KeyboardAvoidingView, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
const Stack = createStackNavigator();
import app from '@react-native-firebase/app';

import SignIn from './pages/Auth/SignIn'
import SignUp from './pages/Auth/SignUp'
import WhatsAppConnect from './pages/Auth/WA_Connect'
import Dashboard from './pages/App';
import History from './pages/App/history'

import Config from './config'

const App = () => { 
  useEffect(() => {
    if(app.apps.length == 0) {
      const _app = app.initializeApp(Config.firebaseConfig);
      Config.firebaseApp = _app;
    }
  }, [])

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen name="SignIn" options={{ headerShown: false }} component={SignIn} />
          <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUp} />
          <Stack.Screen name="WAConnect" options={{ headerShown: false }} component={WhatsAppConnect} />
          <Stack.Screen name="Dashboard" options={{ headerShown: false }} component={Dashboard} />
          <Stack.Screen name="History" options={{ headerShown: false }} component={History} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;