import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export interface ScreenHeaderProps {
  title?: string;
}

export function ScreenHeader({ title = 'LLunara' }: ScreenHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="heading" color={theme.colors.primary}>
        {title}
      </Text>
      <Feather name="bell" size={22} color={theme.colors.text} />
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
