import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DateField } from '@/components/form/DateField';
import { FormInput } from '@/components/form/FormInput';
import { MediaPicker } from '@/components/form/MediaPicker';
import { OfferTypeSelector } from '@/components/form/OfferTypeSelector';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { submitItem } from '@/services/items.service';
import { useItemFormStore, useItemsStore } from '@/store';
import type { OfferType } from '@/store';

export default function CreateItemScreen() {
  const router = useRouter();
  const theme = useTheme();

  const form = useItemFormStore((s) => s.form);
  const errors = useItemFormStore((s) => s.errors);
  const isSubmitting = useItemFormStore((s) => s.isSubmitting);
  const setField = useItemFormStore((s) => s.setField);
  const addMedia = useItemFormStore((s) => s.addMedia);
  const removeMedia = useItemFormStore((s) => s.removeMedia);
  const validate = useItemFormStore((s) => s.validate);
  const reset = useItemFormStore((s) => s.reset);
  const setSubmitting = useItemFormStore((s) => s.setSubmitting);
  const setSubmitSuccess = useItemFormStore((s) => s.setSubmitSuccess);
  const prependItem = useItemsStore((s) => s.prependItem);

  const discountLabel =
    form.offerType === 'money'
      ? 'Cantidad a descontar ($)'
      : form.offerType === 'percentage'
        ? 'Porcentaje de descuento (%)'
        : 'Valor de descuento';

  async function handleSubmit() {
    const isValid = validate();
    if (!isValid) return;

    setSubmitting(true);
    try {
      const result = await submitItem(form);
      if (result.ok) {
        setSubmitSuccess(true);
        if (result.data?.item) prependItem(result.data.item);
        Alert.alert('¡Listo!', 'El item fue creado correctamente.', [
          {
            text: 'OK',
            onPress: () => {
              reset();
              router.back();
            },
          },
        ]);
      } else {
        const message = result.errors.map((e) => `• ${e.message}`).join('\n');
        Alert.alert('Error de validación', message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      Alert.alert('Error de red', `No se pudo conectar con el servidor.\n\n${message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['bottom']}>
          <View style={styles.fields}>
            <FormInput
              label="Nombre"
              placeholder="Ej: Hamburguesa especial"
              value={form.name}
              onChangeText={(v) => setField('name', v)}
              error={errors.name}
              autoCapitalize="sentences"
              returnKeyType="next"
            />

            <FormInput
              label="Descripción"
              placeholder="Describe el item..."
              value={form.description}
              onChangeText={(v) => setField('description', v)}
              error={errors.description}
              multiline
              numberOfLines={3}
              style={styles.textarea}
              returnKeyType="next"
            />

            <FormInput
              label="Precio ($)"
              placeholder="0.00"
              value={form.price}
              onChangeText={(v) => setField('price', v)}
              error={errors.price}
              keyboardType="decimal-pad"
              returnKeyType="next"
            />

            <OfferTypeSelector
              value={form.offerType}
              onChange={(v: OfferType) => {
                setField('offerType', v);
                setField('discountValue', '');
              }}
              error={errors.offerType}
            />

            <FormInput
              label={discountLabel}
              placeholder={form.offerType === 'percentage' ? '0 – 100' : '0.00'}
              value={form.discountValue}
              onChangeText={(v) => setField('discountValue', v)}
              error={errors.discountValue}
              keyboardType="decimal-pad"
              returnKeyType="done"
              editable={!!form.offerType}
            />

            <MediaPicker
              media={form.media}
              onAdd={addMedia}
              onRemove={removeMedia}
              error={errors.media}
            />

            <DateField
              label="Fecha de inicio"
              value={form.startDate}
              onChange={(d) => {
                setField('startDate', d);
                // If endDate is before new startDate, clear it
                if (form.endDate && d >= form.endDate) {
                  setField('endDate', null);
                }
              }}
              error={errors.startDate}
            />

            <DateField
              label="Fecha de fin"
              value={form.endDate}
              onChange={(d) => setField('endDate', d)}
              minimumDate={form.startDate ?? undefined}
              error={errors.endDate}
            />
          </View>

          <Pressable
            style={[
              styles.submitButton,
              { backgroundColor: isSubmitting ? theme.backgroundSelected : theme.text },
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}>
            <ThemedText
              style={[styles.submitText, { color: isSubmitting ? theme.textSecondary : theme.background }]}>
              {isSubmitting ? 'Enviando...' : 'Crear item'}
            </ThemedText>
          </Pressable>
        </SafeAreaView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
  },
  fields: {
    gap: Spacing.four,
    marginBottom: Spacing.five,
  },
  textarea: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: Spacing.two,
  },
  submitButton: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
