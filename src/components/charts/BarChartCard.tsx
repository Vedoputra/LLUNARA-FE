import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export interface BarChartCardProps {
  title: string;
  data: { value: number; label: string }[];
  summaryText: string;
  color?: string;
}

export function BarChartCard({ title, data, summaryText, color }: BarChartCardProps) {
  const theme = useTheme();
  const barColor = color ?? theme.colors.primary;
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <Card style={styles.card}>
      <Text variant="subtitle" style={styles.title}>
        {title}
      </Text>
      <View accessible accessibilityLabel={summaryText} style={styles.chartWrap}>
        {data.map((item) => (
          <View key={item.label} style={styles.row}>
            <Text variant="caption" muted numberOfLines={1} style={styles.label}>
              {item.label}
            </Text>
            <View style={[styles.track, { backgroundColor: theme.colors.surfaceVariant }]}>
              <View
                style={[
                  styles.bar,
                  {
                    backgroundColor: barColor,
                    width: `${Math.max(6, (item.value / maxValue) * 100)}%`,
                  },
                ]}
              />
            </View>
            <Text variant="caption" muted style={styles.value}>
              {item.value}×
            </Text>
          </View>
        ))}
      </View>
      <Text muted variant="caption" style={styles.summary}>
        {summaryText}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 8 },
  title: {},
  chartWrap: { gap: 12, marginVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { width: 92 },
  track: { flex: 1, height: 16, borderRadius: 8, overflow: 'hidden' },
  bar: { height: '100%', borderRadius: 8 },
  value: { width: 30, textAlign: 'right' },
  summary: {},
});
