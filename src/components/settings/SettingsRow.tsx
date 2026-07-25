import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export interface SettingsRowProps {
  icon: ComponentProps<typeof Feather>['name'];
  label: string;
  value?: string;
  danger?: boolean;
  onPress?: () => void;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

export function SettingsRow({
  icon,
  label,
  value,
  danger,
  onPress,
  switchValue,
  onSwitchChange,
}: SettingsRowProps) {
  const theme = useTheme();
  const hasSwitch = onSwitchChange !== undefined;

  const content = (
    <View style={styles.row}>
      <Feather
        name={icon}
        size={18}
        color={danger ? theme.colors.danger : theme.colors.textMuted}
      />
      <Text style={styles.label} color={danger ? theme.colors.danger : undefined}>
        {label}
      </Text>
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ true: theme.colors.primary }}
        />
      ) : (
        <>
          {value ? (
            <Text muted variant="caption">
              {value}
            </Text>
          ) : null}
          {onPress ? (
            <Feather name="chevron-right" size={18} color={theme.colors.textMuted} />
          ) : null}
        </>
      )}
    </View>
  );

  if (hasSwitch || !onPress) {
    return content;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.pressable}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
  },
  label: { flex: 1 },
});
