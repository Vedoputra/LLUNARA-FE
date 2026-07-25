import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { hexToRgba } from '@/utils/color';

export function CalendarLegend() {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <View style={[styles.swatch, { backgroundColor: theme.colors.cycle.menstrual }]} />
        <Text variant="caption" muted>
          Menstruasi
        </Text>
      </View>
      <View style={styles.item}>
        <View
          style={[
            styles.swatch,
            { borderWidth: 1.5, borderStyle: 'dashed', borderColor: theme.colors.cycle.predicted },
          ]}
        />
        <Text variant="caption" muted>
          Prediksi
        </Text>
      </View>
      <View style={styles.item}>
        <View
          style={[
            styles.swatch,
            { backgroundColor: hexToRgba(theme.colors.cycle.ovulation, 0.25) },
          ]}
        />
        <Text variant="caption" muted>
          Masa subur
        </Text>
      </View>
      <View style={styles.item}>
        <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
        <Text variant="caption" muted>
          Ada catatan
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
