import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { isOffline, useNetworkStatus } from '@/hooks/useNetworkStatus';

export function OfflineBanner() {
  const theme = useTheme();
  const status = useNetworkStatus();
  const insets = useSafeAreaInsets();

  if (!isOffline(status)) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: theme.colors.surfaceVariant,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <Feather name="wifi-off" size={14} color={theme.colors.textMuted} />
      <Text variant="caption" muted>
        Kamu sedang offline
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
});
