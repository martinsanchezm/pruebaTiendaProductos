import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from 'expo-image';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { MediaAsset } from '@/store';

interface MediaPickerProps {
  media: MediaAsset[];
  onAdd: (asset: MediaAsset) => void;
  onRemove: (uri: string) => void;
  error?: string;
}

const HEIC_MIMES = new Set(['image/heic', 'image/heif']);

async function normalizeImageAsset(asset: ImagePicker.ImagePickerAsset): Promise<MediaAsset> {
  const rawMime = asset.mimeType ?? 'image/jpeg';
  if (asset.type !== 'video' && HEIC_MIMES.has(rawMime)) {
    const result = await ImageManipulator.manipulateAsync(
      asset.uri,
      [],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return {
      uri: result.uri,
      type: 'image',
      fileName: asset.fileName?.replace(/\.(heic|heif)$/i, '.jpg') ?? `media_${Date.now()}.jpg`,
      mimeType: 'image/jpeg',
    };
  }
  return {
    uri: asset.uri,
    type: asset.type === 'video' ? 'video' : 'image',
    fileName: asset.fileName ?? `media_${Date.now()}`,
    mimeType: rawMime,
  };
}

async function pickFromGallery(): Promise<MediaAsset | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.');
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images', 'videos'],
    quality: 0.8,
    allowsMultipleSelection: false,
  });

  if (result.canceled || !result.assets[0]) return null;

  return normalizeImageAsset(result.assets[0]);
}

async function pickFromCamera(): Promise<MediaAsset | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Permiso requerido', 'Necesitamos acceso a tu cámara.');
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images', 'videos'],
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0]) return null;

  return normalizeImageAsset(result.assets[0]);
}

export function MediaPicker({ media, onAdd, onRemove, error }: MediaPickerProps) {
  const theme = useTheme();

  function handlePress() {
    Alert.alert('Subir multimedia', 'Elige una fuente', [
      {
        text: 'Cámara',
        onPress: async () => {
          const asset = await pickFromCamera();
          if (asset) onAdd(asset);
        },
      },
      {
        text: 'Galería',
        onPress: async () => {
          const asset = await pickFromGallery();
          if (asset) onAdd(asset);
        },
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  return (
    <View style={styles.wrapper}>
      <ThemedText type="smallBold">Multimedia</ThemedText>

      {media.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.preview}>
          {media.map((item) => (
            <View key={item.uri} style={styles.mediaItem}>
              <Image
                source={{ uri: item.uri }}
                style={styles.thumb}
                contentFit="cover"
              />
              <Pressable
                style={[styles.removeBtn, { backgroundColor: theme.backgroundSelected }]}
                onPress={() => onRemove(item.uri)}>
                <ThemedText style={styles.removeText}>✕</ThemedText>
              </Pressable>
              {item.type === 'video' && (
                <View style={styles.videoBadge}>
                  <ThemedText style={styles.videoBadgeText}>▶</ThemedText>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      <Pressable
        style={[
          styles.addButton,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: error ? '#E53E3E' : theme.backgroundSelected,
          },
        ]}
        onPress={handlePress}>
        <ThemedText themeColor="textSecondary">+ Agregar imagen o vídeo</ThemedText>
      </Pressable>

      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.two,
  },
  preview: {
    flexDirection: 'row',
  },
  mediaItem: {
    marginRight: Spacing.two,
    position: 'relative',
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: Spacing.two,
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    fontSize: 10,
    lineHeight: 14,
  },
  videoBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  videoBadgeText: {
    color: '#fff',
    fontSize: 10,
  },
  addButton: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  error: {
    color: '#E53E3E',
    fontSize: 12,
  },
});
