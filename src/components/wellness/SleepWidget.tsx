import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Card, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

import { MetricInputSheet } from './MetricInputSheet';

export interface SleepWidgetProps {
  hours: number | null;
  onChange: (hours: number) => void;
}

export function SleepWidget({ hours, onChange }: SleepWidgetProps) {
  const theme = useTheme();
  const [sheetVisible, setSheetVisible] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ubah jam tidur"
        onPress={() => setSheetVisible(true)}
        style={styles.pressable}
      >
        <Card style={styles.card} padding={12}>
          <Feather name="moon" size={18} color={theme.colors.primary} />
          <Text variant="subtitle">{hours ?? '—'}</Text>
          <Text variant="caption" muted>
            jam
          </Text>
        </Card>
      </Pressable>
      <MetricInputSheet
        visible={sheetVisible}
        title="Jam tidur"
        label="Jam tidur malam ini"
        initialValue={hours}
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
