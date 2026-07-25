import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

export type TextVariant = 'display' | 'heading' | 'title' | 'subtitle' | 'body' | 'caption';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  muted?: boolean;
}

export function Text({ variant = 'body', color, muted, style, ...rest }: TextProps) {
  const theme = useTheme();
  const variantStyle = theme.typography[variant];

  return (
    <RNText
      style={[
        {
          fontFamily: variantStyle.fontFamily,
          fontSize: variantStyle.fontSize,
          lineHeight: variantStyle.lineHeight,
          color: color ?? (muted ? theme.colors.textMuted : theme.colors.text),
        },
        style,
      ]}
      {...rest}
    />
  );
}
