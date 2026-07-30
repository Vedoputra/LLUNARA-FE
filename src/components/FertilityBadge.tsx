import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Sheet, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import type { FertilityLevel } from '@/utils/fertility';

export interface FertilityBadgeProps {
  level: FertilityLevel;
  label: string;
}

export function FertilityBadge({ level, label }: FertilityBadgeProps) {
  const theme = useTheme();
  const [sheetVisible, setSheetVisible] = useState(false);

  if (level === 'unknown') return null;

  const backgroundColor =
    level === 'peak'
      ? theme.colors.cycle.ovulation
      : level === 'high'
        ? theme.colors.primarySoft
        : theme.colors.surfaceVariant;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Tentang perkiraan peluang hamil ini"
        onPress={() => setSheetVisible(true)}
        style={[styles.pill, { backgroundColor }]}
      >
        <Feather name="info" size={12} color={theme.colors.textMuted} />
        <Text variant="caption">{label}</Text>
      </Pressable>

      <Sheet visible={sheetVisible} onClose={() => setSheetVisible(false)}>
        <Text variant="subtitle" style={styles.sheetTitle}>
          Bagaimana peluang ini dihitung?
        </Text>
        <Text style={styles.sheetBody}>
          Sel telur hanya bertahan sekitar 12–24 jam setelah ovulasi, sementara sperma bisa bertahan
          hingga sekitar 5 hari. Karena itu peluang hamil meningkat di beberapa hari sebelum ovulasi
          sampai hari ovulasi itu sendiri (jendela subur), dan menurun di hari-hari lain dalam
          siklus.
        </Text>
        <View style={[styles.disclaimer, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text variant="caption" muted>
            Ini perkiraan berdasarkan pola siklus, bukan alat kontrasepsi, bukan diagnosis, dan
            bukan pengganti konsultasi dokter.
          </Text>
        </View>
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  // Tanpa `alignSelf`: badge ini duduk di kolom ber-`alignItems: 'flex-end'`
  // bersama badge fase, jadi perataannya harus ikut induknya.
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sheetTitle: { marginBottom: 8 },
  sheetBody: { marginBottom: 16 },
  disclaimer: { borderRadius: 12, padding: 12, marginBottom: 8 },
});
