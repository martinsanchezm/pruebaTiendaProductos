import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="products" options={{ title: 'Products' }} />
        <Stack.Screen name="detail" options={{ title: 'Detail' }} />
        <Stack.Screen name="create-item" options={{ title: 'Crear item', presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
