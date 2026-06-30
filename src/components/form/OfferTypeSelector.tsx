import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { OfferType } from '@/store';

const OPTIONS: { value: OfferType; label: string }[] = [
  { value: 'money', label: 'Descuento en dinero' },
  { value: 'percentage', label: 'Descuento en porcentaje' },
];

interface OfferTypeSelectorProps {
  value: OfferType | '';
  onChange: (value: OfferType) => void;
  error?: string;
}

export function OfferTypeSelector({ value, onChange, error }: OfferTypeSelectorProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <ThemedText type="smallBold" style={styles.label}>
        Tipo de oferta
      </ThemedText>
      <View style={[styles.row, error ? styles.rowError : null]}>
        {OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <Pressable
              key={opt.value}
              style={[
                styles.option,
                {
                  backgroundColor: selected ? theme.backgroundSelected : theme.backgroundElement,
                  borderColor: error && !selected ? '#E53E3E' : 'transparent',
                },
              ]}
              onPress={() => onChange(opt.value)}>
              <ThemedText
                type={selected ? 'smallBold' : 'default'}
                style={selected ? styles.selectedText : undefined}>
                {opt.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
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
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  rowError: {
    borderWidth: 1.5,
    borderColor: '#E53E3E',
    borderRadius: Spacing.two,
    padding: Spacing.one,
  },
  option: {
    flex: 1,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  selectedText: {
    textAlign: 'center',
  },
  error: {
    color: '#E53E3E',
    fontSize: 12,
    marginTop: 2,
  },
});
