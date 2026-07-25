import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Card, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

import { MetricInputSheet } from './MetricInputSheet';

export interface WeightWidgetProps {
  weightKg: number | null;
  onChange: (weightKg: number) => void;
}

export function WeightWidget({ weightKg, onChange }: WeightWidgetProps) {
  const theme = useTheme();
  const [sheetVisible, setSheetVisible] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ubah berat badan"
        onPress={() => setSheetVisible(true)}
        style={styles.pressable}
      >
        <Card style={styles.card} padding={12}>
          <MaterialCommunityIcons name="scale-bathroom" size={18} color={theme.colors.primary} />
          <Text variant="subtitle">{weightKg ?? '—'}</Text>
          <Text variant="caption" muted>
            berat
          </Text>
        </Card>
      </Pressable>
      <MetricInputSheet
        visible={sheetVisible}
        title="Berat badan"
        label="Berat badan (kg) — tidak perlu diisi tiap hari"
        initialValue={weightKg}
        onClose={() => setSheetVisible(false)}
        onSave={onChange}
      />
    </>
  );
}

const styles = StyleSheet.create({
  pressable: { flex: 1 },
  card: { alignItems: 'center', gap: 4 },
});
