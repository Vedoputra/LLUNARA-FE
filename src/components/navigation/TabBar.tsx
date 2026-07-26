import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

type IconRenderer = (color: string, size: number) => React.ReactNode;

const ICONS: Record<string, IconRenderer> = {
  index: (color, size) => <Feather name="home" size={size} color={color} />,
  calendar: (color, size) => <Feather name="calendar" size={size} color={color} />,
  insights: (color, size) => <Feather name="bar-chart-2" size={size} color={color} />,
  garden: (color, size) => <MaterialCommunityIcons name="flower" size={size} color={color} />,
  settings: (color, size) => <Feather name="settings" size={size} color={color} />,
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingBottom: insets.bottom + 4,
        },
      ]}
    >
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
            <View style={[styles.pill, isFocused && { backgroundColor: theme.colors.primarySoft }]}>
              {renderIcon?.(color, 18)}
              <Text
                variant="caption"
                color={color}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
                style={styles.label}
              >
                {label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 4,
    paddingHorizontal: 4,
  },
  item: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    alignItems: 'center',
    gap: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    minWidth: 56,
  },
  label: {
    fontSize: 10,
    maxWidth: 68,
  },
});
