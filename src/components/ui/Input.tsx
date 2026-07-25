import { useState } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({
  label,
  error,
  helperText,
  leftElement,
  rightElement,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={containerStyle}>
      {label ? (
        <Text variant="caption" muted style={styles.label}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.fieldBox,
          {
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: error
              ? theme.colors.danger
              : isFocused
                ? theme.colors.primary
                : theme.colors.border,
            borderRadius: theme.radius.md,
          },
        ]}
      >
        {leftElement ? <View style={styles.iconSlot}>{leftElement}</View> : null}
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
              color: theme.colors.text,
              fontFamily: theme.fontFamilies.body,
              fontSize: theme.typography.body.fontSize,
            },
            style,
          ]}
          {...rest}
        />
        {rightElement ? <View style={styles.iconSlot}>{rightElement}</View> : null}
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
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 54,
    borderWidth: 1,
    paddingHorizontal: 16,
    gap: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  iconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  helper: {
    marginTop: 6,
  },
});
