import { useState } from 'react';
import { TextInput, View, StyleSheet, type TextInputProps } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  leftElement,
  rightElement,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View>
      {label ? (
        <Text variant="caption" muted style={styles.label}>
          {label}
        </Text>
      ) : null}
      <View style={styles.inputWrapper}>
        {leftElement ? <View style={styles.leftElement}>{leftElement}</View> : null}
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
              paddingLeft: leftElement ? 44 : 16,
              paddingRight: rightElement ? 44 : 16,
            },
            style,
          ]}
          {...rest}
        />
        {rightElement ? <View style={styles.rightElement}>{rightElement}</View> : null}
      </View>
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
  inputWrapper: {
    justifyContent: 'center',
  },
  input: {
    minHeight: 54,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftElement: {
    position: 'absolute',
    left: 12,
    minHeight: 44,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  rightElement: {
    position: 'absolute',
    right: 12,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helper: {
    marginTop: 6,
  },
});
