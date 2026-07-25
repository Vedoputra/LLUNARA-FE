import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';

const SPLASH_BACKGROUND = '#FFF6F4';
const WORDMARK_COLOR = '#A1385E';
const DOT_COLORS = ['#F2789F', '#FDAF87', '#A895D6'];
const HOLD_DURATION_MS = 1400;

export interface SplashIntroProps {
  onFinish: () => void;
}

export function SplashIntro({ onFinish }: SplashIntroProps) {
  const translateY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 7,
        tension: 60,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(onFinish, HOLD_DURATION_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.group, { opacity, transform: [{ translateY }] }]}>
        <View style={styles.circle}>
          <Image
            source={require('../../assets/mascot/luna-waving.png')}
            style={styles.mascot}
            resizeMode="contain"
          />
        </View>
        <Text variant="display" color={WORDMARK_COLOR}>
          LLunara
        </Text>
        <View style={styles.dotsRow}>
          {DOT_COLORS.map((color) => (
            <View key={color} style={[styles.dot, { backgroundColor: color }]} />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SPLASH_BACKGROUND,
  },
  group: { alignItems: 'center', gap: 16 },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F2789F',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  mascot: { width: 100, height: 100 },
  dotsRow: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
