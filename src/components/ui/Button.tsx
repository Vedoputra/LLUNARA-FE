import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  label,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const backgroundColor = {
    primary: theme.colors.primary,
    secondary: theme.colors.primarySoft,
    ghost: 'transparent',
    danger: theme.colors.danger,
  }[variant];

  const textColor = {
    primary: theme.colors.onPrimary,
    secondary: theme.colors.primary,
    ghost: theme.colors.primary,
    danger: theme.colors.onPrimary,
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={(state) => [
        styles.base,
        {
          backgroundColor,
          borderRadius: 18,
          opacity: isDisabled ? 0.5 : state.pressed ? 0.85 : 1,
          transform: [{ scale: state.pressed && !isDisabled ? 0.98 : 1 }],
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon}
          <Text variant="subtitle" color={textColor}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 54,
    minWidth: 44,
    paddingHorizontal: 24,
  },
});
