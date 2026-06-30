import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useItemsStore } from '@/store';

const API_BASE_URL = 'http://192.168.1.72:3000';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();

  const item = useItemsStore((s) => s.items.find((i) => String(i.id) === id));

  if (!item) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.centered}>
          <ThemedText themeColor="textSecondary">Item no encontrado.</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const discountLabel =
    item.offerType === 'money'
      ? `Descuento: -$${item.discount.toFixed(2)}`
      : `Descuento: -${item.discount}%`;

  const finalPrice =
    item.offerType === 'money'
      ? Math.max(0, item.price - item.discount)
      : item.price * (1 - item.discount / 100);

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Media gallery */}
        {item.media.length > 0 && (
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {item.media.map((m) => (
              <Image
                key={m.filename}
                source={{ uri: `${API_BASE_URL}${m.url}` }}
                style={styles.image}
                contentFit="cover"
              />
            ))}
          </ScrollView>
        )}

        <SafeAreaView edges={['bottom']}>
          <View style={styles.body}>
            {/* Header */}
            <View style={styles.headerRow}>
              <ThemedText type="subtitle" style={styles.name}>{item.name}</ThemedText>
              <View style={[styles.badge, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText type="small">{discountLabel}</ThemedText>
              </View>
            </View>

            {/* Precio */}
            <View style={styles.priceRow}>
              <ThemedText type="title" style={styles.finalPrice}>
                ${finalPrice.toFixed(2)}
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.originalPrice}>
                antes ${item.price.toFixed(2)}
              </ThemedText>
            </View>

            {/* Descripción */}
            <ThemedView type="backgroundElement" style={styles.section}>
              <ThemedText type="smallBold">Descripción</ThemedText>
              <ThemedText themeColor="textSecondary">{item.description}</ThemedText>
            </ThemedView>

            {/* Fechas */}
            <ThemedView type="backgroundElement" style={styles.section}>
              <ThemedText type="smallBold">Vigencia de la oferta</ThemedText>
              <View style={styles.datesRow}>
                <View style={styles.dateBlock}>
                  <ThemedText type="small" themeColor="textSecondary">Inicio</ThemedText>
                  <ThemedText type="smallBold">{formatDate(item.startDate)}</ThemedText>
                </View>
                <ThemedText themeColor="textSecondary">→</ThemedText>
                <View style={styles.dateBlock}>
                  <ThemedText type="small" themeColor="textSecondary">Fin</ThemedText>
                  <ThemedText type="smallBold">{formatDate(item.endDate)}</ThemedText>
                </View>
              </View>
            </ThemedView>
          </View>
        </SafeAreaView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 400,
    height: 280,
  },
  body: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  headerRow: {
    gap: Spacing.two,
  },
  name: {
    flex: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.two,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.two,
  },
  finalPrice: {
    fontSize: 36,
    lineHeight: 40,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    fontSize: 14,
  },
  section: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  datesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  dateBlock: {
    gap: 2,
  },
});
