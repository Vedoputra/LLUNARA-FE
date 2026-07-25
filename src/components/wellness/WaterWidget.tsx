import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export interface WaterWidgetProps {
  glasses: number | null;
  onChange: (glasses: number) => void;
}

export function WaterWidget({ glasses, onChange }: WaterWidgetProps) {
  const theme = useTheme();
  const value = glasses ?? 0;

  return (
    <Card style={styles.card} padding={12}>
      <Feather name="droplet" size={18} color={theme.colors.primary} />
      <View style={styles.stepperRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kurangi gelas air"
          onPress={() => onChange(Math.max(0, value - 1))}
          hitSlop={8}
          style={styles.stepperButton}
        >
          <Feather name="minus" size={14} color={theme.colors.textMuted} />
        </Pressable>
        <Text variant="subtitle">{value}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tambah gelas air"
          onPress={() => onChange(value + 1)}
          hitSlop={8}
          style={styles.stepperButton}
        >
          <Feather name="plus" size={14} color={theme.colors.primary} />
        </Pressable>
      </View>
      <Text variant="caption" muted>
        gelas
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, alignItems: 'center', gap: 4 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepperButton: { minWidth: 28, minHeight: 28, alignItems: 'center', justifyContent: 'center' },
});
