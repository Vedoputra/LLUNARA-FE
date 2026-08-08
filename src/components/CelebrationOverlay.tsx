import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Modal, Pressable, StyleSheet, View } from 'react-native';

import { Button, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

const PETAL_COUNT = 14;
const RISE_DISTANCE = 320;

export interface CelebrationOverlayProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

/**
 * Perayaan singkat untuk pencapaian yang layak dirayakan (mis. satu periode
 * menstruasi selesai dicatat).
 *
 * Sifatnya murni apresiasi — tidak ada skor, tidak ada evaluasi, dan tidak
 * pernah muncul untuk hal yang *tidak* dilakukan user.
 */
export function CelebrationOverlay({ visible, title, message, onClose }: CelebrationOverlayProps) {
  const theme = useTheme();
  const cardScale = useRef(new Animated.Value(0.85)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const petalProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      cardScale.setValue(0.85);
      cardOpacity.setValue(0);
      petalProgress.setValue(0);
      return;
    }

    Animated.parallel([
      Animated.spring(cardScale, { toValue: 1, friction: 6, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(petalProgress, {
        toValue: 1,
        duration: 2600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, cardScale, cardOpacity, petalProgress]);

  const petalColors = theme.colors.gardenSeasons[0].blooms;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={[StyleSheet.absoluteFill, styles.backdrop]}
        accessibilityRole="button"
        accessibilityLabel="Tutup perayaan"
        onPress={onClose}
      />

      <View style={styles.petalLayer} pointerEvents="none">
        {Array.from({ length: PETAL_COUNT }, (_, index) => {
          // Sebaran deterministik per indeks — bukan Math.random, supaya tiap
          // petal tetap di jalurnya sendiri sepanjang animasi berjalan.
          const lane = (index + 0.5) / PETAL_COUNT;
          const delay = (index % 5) / 5;
          const drift = index % 2 === 0 ? 18 : -18;
          const size = 10 + (index % 3) * 4;

          const translateY = petalProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [RISE_DISTANCE * (0.4 + delay), -RISE_DISTANCE],
          });
          const translateX = petalProgress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, drift, 0],
          });
          const opacity = petalProgress.interpolate({
            inputRange: [0, 0.15, 0.75, 1],
            outputRange: [0, 1, 1, 0],
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.petal,
                {
                  left: `${lane * 100}%`,
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor: petalColors[index % petalColors.length],
                  opacity,
                  transform: [{ translateY }, { translateX }],
                },
              ]}
            />
          );
        })}
      </View>

      <View style={styles.centerWrap} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              opacity: cardOpacity,
              transform: [{ scale: cardScale }],
            },
          ]}
        >
          <Image
            source={require('../../assets/mascot/luna10.png')}
            style={styles.mascot}
            resizeMode="contain"
          />
          <Text variant="title" style={styles.title}>
            {title}
          </Text>
          <Text muted style={styles.message}>
            {message}
          </Text>
          <Button label="Terima kasih, Luna" onPress={onClose} style={styles.button} />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(36, 24, 30, 0.45)' },
  petalLayer: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  petal: { position: 'absolute', top: '50%' },
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  card: {
    alignItems: 'center',
    alignSelf: 'stretch',
    // Dibatasi supaya kartu perayaan tidak melebar penuh di layar tablet.
    maxWidth: 420,
    borderRadius: 32,
    padding: 24,
    gap: 6,
  },
  mascot: { width: 120, height: 120, marginBottom: 4 },
  title: { textAlign: 'center' },
  message: { textAlign: 'center' },
  button: { alignSelf: 'stretch', marginTop: 16 },
});
