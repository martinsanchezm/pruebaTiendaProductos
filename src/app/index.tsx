import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          Home
        </ThemedText>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, { backgroundColor: theme.backgroundElement }]}
            onPress={() => router.push('/products')}>
            <ThemedText type="smallBold">Ir a Products</ThemedText>
          </Pressable>

          <Pressable
            style={[styles.button, { backgroundColor: theme.text }]}
            onPress={() => router.push('/create-item')}>
            <ThemedText type="smallBold" style={{ color: theme.background }}>
              + Crear item
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  buttonContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
  },
  button: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
});
