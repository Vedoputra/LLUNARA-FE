import { View, StyleSheet, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

export function Divider({ style, ...rest }: ViewProps) {
  const theme = useTheme();

  return (
    <View
      style={[{ height: StyleSheet.hairlineWidth, backgroundColor: theme.colors.border }, style]}
      {...rest}
    />
  );
}
