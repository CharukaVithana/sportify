import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProvider } from '@/contexts/AppContext';
import { store } from '@/store';
import { loadUser } from '@/store/slices/authSlice';
import { loadFavourites } from '@/store/slices/favouritesSlice';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Load persisted data on app start
    store.dispatch(loadUser() as any);
    store.dispatch(loadFavourites() as any);
  }, []);

  return (
    <Provider store={store}>
      <AppProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen name="splash" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="details" options={{ headerShown: true, title: 'Details' }} />
            <Stack.Screen name="edit-profile" options={{ headerShown: true, title: 'Edit Profile' }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
          <Toast />
        </ThemeProvider>
      </AppProvider>
    </Provider>
  );
}
