import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useColorScheme } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function FormInput({ label, error, style, ...props }: FormInputProps) {
  const theme = useTheme();
  const scheme = useColorScheme() ?? 'light';

  return (
    <View style={styles.wrapper}>
      <ThemedText type="smallBold" style={styles.label}>
        {label}
      </ThemedText>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.backgroundElement,
            color: theme.text,
            borderColor: error ? '#E53E3E' : 'transparent',
          },
          style,
        ]}
        placeholderTextColor={theme.textSecondary}
        {...props}
      />
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.one,
  },
  label: {
    marginBottom: 2,
  },
  input: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    fontSize: 16,
    borderWidth: 1.5,
  },
  error: {
    color: '#E53E3E',
    fontSize: 12,
    marginTop: 2,
  },
});
