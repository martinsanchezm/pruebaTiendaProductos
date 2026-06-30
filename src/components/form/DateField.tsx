import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface DateFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  error?: string;
}

function formatDate(date: Date | null): string {
  if (!date) return 'Seleccionar fecha';
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function DateField({ label, value, onChange, minimumDate, error }: DateFieldProps) {
  const theme = useTheme();
  const [show, setShow] = useState(false);

  function handleChange(_event: DateTimePickerEvent, selected?: Date) {
    // On Android the picker closes on selection
    if (Platform.OS === 'android') setShow(false);
    if (selected) onChange(selected);
  }

  return (
    <View style={styles.wrapper}>
      <ThemedText type="smallBold" style={styles.label}>
        {label}
      </ThemedText>

      <Pressable
        style={[
          styles.button,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: error ? '#E53E3E' : 'transparent',
          },
        ]}
        onPress={() => setShow(true)}>
        <ThemedText
          style={value ? undefined : styles.placeholder}
          themeColor={value ? 'text' : 'textSecondary'}>
          {formatDate(value)}
        </ThemedText>
      </Pressable>

      {/* iOS: inline picker shown below the button */}
      {show && Platform.OS === 'ios' && (
        <View style={[styles.iosPicker, { backgroundColor: theme.backgroundElement }]}>
          <DateTimePicker
            value={value ?? new Date()}
            mode="date"
            display="inline"
            minimumDate={minimumDate}
            onChange={handleChange}
            locale="es-ES"
          />
          <Pressable style={styles.iosDone} onPress={() => setShow(false)}>
            <ThemedText type="smallBold">Listo</ThemedText>
          </Pressable>
        </View>
      )}

      {/* Android: system dialog */}
      {show && Platform.OS === 'android' && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display="default"
          minimumDate={minimumDate}
          onChange={handleChange}
        />
      )}

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
  button: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: 1.5,
  },
  placeholder: {
    fontSize: 16,
  },
  iosPicker: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
    marginTop: Spacing.one,
  },
  iosDone: {
    padding: Spacing.two,
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.three,
  },
  error: {
    color: '#E53E3E',
    fontSize: 12,
    marginTop: 2,
  },
});
