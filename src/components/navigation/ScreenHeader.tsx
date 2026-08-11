import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { useResponsive } from '@/hooks/useResponsive';
import { useTheme } from '@/hooks/useTheme';

export interface ScreenHeaderProps {
  title?: string;
}

export function ScreenHeader({ title = 'LLunara' }: ScreenHeaderProps) {
  const theme = useTheme();
  const { contentWidth } = useResponsive();

  return (
    // Lebar header dibatasi sama seperti konten, supaya judul dan ikon tetap
    // sejajar dengan kartu di bawahnya saat konten ditengahkan di tablet.
    <View style={[styles.container, contentWidth]}>
      <Text variant="heading" color={theme.colors.primary}>
        {title}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Atur pengingat"
        hitSlop={10}
        onPress={() => router.push('/settings')}
      >
        <Feather name="bell" size={22} color={theme.colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
});
