import { useState } from 'react';
import { TextInput, View, StyleSheet, type TextInputProps } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, style, onFocus, onBlur, ...rest }: InputProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View>
      {label ? (
        <Text variant="caption" muted style={styles.label}>
          {label}
        </Text>
      ) : null}
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={theme.colors.textMuted}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: error
              ? theme.colors.danger
              : isFocused
                ? theme.colors.primary
                : theme.colors.border,
            borderRadius: theme.radius.md,
            color: theme.colors.text,
            fontFamily: theme.fontFamilies.body,
            fontSize: theme.typography.body.fontSize,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <Text variant="caption" color={theme.colors.danger} style={styles.helper}>
          {error}
        </Text>
      ) : helperText ? (
        <Text variant="caption" muted style={styles.helper}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  helper: {
    marginTop: 6,
  },
});
