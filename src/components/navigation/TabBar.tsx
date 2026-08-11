import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import { useResponsive } from '@/hooks/useResponsive';
import { useTheme } from '@/hooks/useTheme';

type IconRenderer = (color: string, size: number) => React.ReactNode;

const ICONS: Record<string, IconRenderer> = {
  index: (color, size) => <Feather name="home" size={size} color={color} />,
  calendar: (color, size) => <Feather name="calendar" size={size} color={color} />,
  insights: (color, size) => <Feather name="bar-chart-2" size={size} color={color} />,
  garden: (color, size) => <MaterialCommunityIcons name="flower" size={size} color={color} />,
  settings: (color, size) => <Feather name="settings" size={size} color={color} />,
};

/** Ruang minimum di bawah label, dipakai kalau perangkat tidak punya inset. */
const MIN_BOTTOM_PADDING = 10;

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { isTablet, contentWidth } = useResponsive();

  const iconSize = isTablet ? 22 : 20;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          // Sebelumnya `insets.bottom - 20`, yang jadi NEGATIF di perangkat
          // tanpa gesture bar (banyak tablet) sehingga tab bar terlihat gepeng
          // dan labelnya terpotong. Inset dipakai kalau ada, kalau tidak pakai
          // padding minimum — tidak pernah dikurangi.
          paddingBottom: Math.max(insets.bottom, MIN_BOTTOM_PADDING),
        },
      ]}
    >
      {/* Baris tab dibatasi lebarnya di tablet supaya kelima tab tidak
          terpencar sejauh lebar layar. */}
      <View style={[styles.row, contentWidth]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = typeof options.title === 'string' ? options.title : route.name;
          const isFocused = state.index === index;
          const color = isFocused ? theme.colors.primary : theme.colors.textMuted;
          const renderIcon = ICONS[route.name];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={label}
              onPress={onPress}
              style={styles.item}
            >
              <View
                style={[styles.pill, isFocused && { backgroundColor: theme.colors.primarySoft }]}
              >
                {renderIcon?.(color, iconSize)}
                <Text
                  variant="caption"
                  color={color}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.85}
                  style={styles.label}
                >
                  {label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  row: { flexDirection: 'row' },
  item: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignSelf: 'stretch',
  },
  label: { fontSize: 11, textAlign: 'center' },
});
