import { View, StyleSheet, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

export interface CardProps extends ViewProps {
  padding?: number;
}

export function Card({ padding, style, children, ...rest }: CardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          padding: padding ?? theme.spacing[16],
          shadowColor: theme.colors.primary,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
});
