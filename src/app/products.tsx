import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { fetchItems } from '@/services/items.service';
import { useItemsStore } from '@/store';
import type { Item } from '@/store';

const API_BASE_URL = 'http://192.168.1.72:3000';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function ItemCard({ item, onPress }: { item: Item; onPress: () => void }) {
  const theme = useTheme();
  const firstMedia = item.media?.[0];

  const discountLabel =
    item.offerType === 'money'
      ? `-$${item.discount.toFixed(2)}`
      : `-${item.discount}%`;

  return (
    <Pressable onPress={onPress}>
    <ThemedView type="backgroundElement" style={styles.card}>
      {firstMedia && (
        <Image
          source={{ uri: `${API_BASE_URL}${firstMedia.url}` }}
          style={styles.cardImage}
          contentFit="cover"
        />
      )}
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <ThemedText type="smallBold" style={styles.cardName}>{item.name}</ThemedText>
          <View style={[styles.discountBadge, { backgroundColor: theme.backgroundSelected }]}>
            <ThemedText type="small">{discountLabel}</ThemedText>
          </View>
        </View>

        <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
          {item.description}
        </ThemedText>

        <View style={styles.cardFooter}>
          <ThemedText type="smallBold">${item.price.toFixed(2)}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {formatDate(item.startDate)} → {formatDate(item.endDate)}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
    </Pressable>
  );
}

export default function ProductsScreen() {
  const router = useRouter();
  const theme = useTheme();

  const items = useItemsStore((s) => s.items);
  const isLoading = useItemsStore((s) => s.isLoading);
  const error = useItemsStore((s) => s.error);
  const setItems = useItemsStore((s) => s.setItems);
  const setLoading = useItemsStore((s) => s.setLoading);
  const setError = useItemsStore((s) => s.setError);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar items');
    } finally {
      setLoading(false);
    }
  }, [setItems, setLoading, setError]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ItemCard item={item} onPress={() => router.push({ pathname: '/detail', params: { id: String(item.id) } })} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={load}
          refreshing={isLoading}
          ListEmptyComponent={
            isLoading ? null : (
              <View style={styles.empty}>
                {error ? (
                  <>
                    <ThemedText themeColor="textSecondary">{error}</ThemedText>
                    <Pressable
                      style={[styles.retryBtn, { backgroundColor: theme.backgroundElement }]}
                      onPress={load}>
                      <ThemedText type="smallBold">Reintentar</ThemedText>
                    </Pressable>
                  </>
                ) : (
                  <ThemedText themeColor="textSecondary">
                    No hay items aún. Crea el primero.
                  </ThemedText>
                )}
              </View>
            )
          }
          ListHeaderComponent={
            isLoading && items.length === 0 ? (
              <ActivityIndicator style={styles.loader} color={theme.text} />
            ) : null
          }
        />

        <Pressable
          style={[styles.fab, { backgroundColor: theme.text }]}
          onPress={() => router.push('/create-item')}>
          <ThemedText type="smallBold" style={{ color: theme.background }}>
            + Crear item
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  list: {
    padding: Spacing.four,
    gap: Spacing.three,
    paddingBottom: 100,
  },
  card: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardBody: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  cardName: {
    flex: 1,
  },
  discountBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.two,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing.six,
    gap: Spacing.three,
  },
  retryBtn: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.two,
  },
  loader: {
    marginVertical: Spacing.four,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.four,
    right: Spacing.four,
    left: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
});
