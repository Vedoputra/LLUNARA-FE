import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Sheet, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import type { PredictionConfidence } from '@/types/api';

const CONFIDENCE_LABELS: Record<PredictionConfidence, string> = {
  low: 'Perkiraan awal — akurasi meningkat setelah beberapa siklus tercatat',
  medium: 'Perkiraan cukup akurat',
  high: 'Perkiraan akurat berdasarkan siklus yang teratur',
};

export interface ConfidenceBadgeProps {
  confidence: PredictionConfidence;
  basedOnCycles: number;
}

export function ConfidenceBadge({ confidence, basedOnCycles }: ConfidenceBadgeProps) {
  const theme = useTheme();
  const [sheetVisible, setSheetVisible] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Tentang tingkat keyakinan prediksi ini"
        onPress={() => setSheetVisible(true)}
        style={[styles.badge, { backgroundColor: theme.colors.surfaceVariant }]}
      >
        <Feather name="info" size={14} color={theme.colors.textMuted} />
        <Text variant="caption" muted style={styles.badgeText}>
          {CONFIDENCE_LABELS[confidence]}
        </Text>
      </Pressable>

      <Sheet visible={sheetVisible} onClose={() => setSheetVisible(false)}>
        <Text variant="subtitle" style={styles.sheetTitle}>
          Bagaimana perkiraan ini dihitung?
        </Text>
        <Text style={styles.sheetBody}>
          Perkiraan dihitung dari rata-rata panjang siklus yang sudah kamu catat sebelumnya
          {basedOnCycles > 0 ? ` (berdasarkan ${basedOnCycles} siklus terakhir)` : ''}. Semakin
          banyak dan semakin konsisten siklus yang tercatat, semakin tinggi tingkat keyakinannya.
        </Text>
        <View style={[styles.disclaimer, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text variant="caption" muted>
            Perkiraan ini bukan alat kontrasepsi, bukan diagnosis, dan bukan pengganti konsultasi
            dokter.
          </Text>
        </View>
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: { flexShrink: 1 },
  sheetTitle: { marginBottom: 8 },
  sheetBody: { marginBottom: 16 },
  disclaimer: { borderRadius: 12, padding: 12, marginBottom: 8 },
});
