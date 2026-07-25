import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export interface StackedBarDatum {
  label: string;
  stacks: { value: number; color: string }[];
}

export interface StackedBarLegendItem {
  label: string;
  color: string;
}

export interface StackedBarCardProps {
  title: string;
  data: StackedBarDatum[];
  legend: StackedBarLegendItem[];
  summaryText: string;
}

export function StackedBarCard({ title, data, legend, summaryText }: StackedBarCardProps) {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <Text variant="subtitle" style={styles.title}>
        {title}
      </Text>
      <View accessible accessibilityLabel={summaryText} style={styles.chartWrap}>
        {data.map((item) => {
          const total = item.stacks.reduce((sum, stack) => sum + stack.value, 0);
          return (
            <View key={item.label} style={styles.row}>
              <Text variant="caption" muted numberOfLines={1} style={styles.label}>
                {item.label}
              </Text>
              <View style={[styles.track, { backgroundColor: theme.colors.surfaceVariant }]}>
                {total === 0
                  ? null
                  : item.stacks.map((stack, index) =>
                      stack.value > 0 ? (
                        <View
                          key={index}
                          style={{
                            flex: stack.value,
                            backgroundColor: stack.color,
                            height: '100%',
                          }}
                        />
                      ) : null,
                    )}
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.legendRow}>
        {legend.map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: item.color }]} />
            <Text variant="caption" muted>
              {item.label}
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
  track: { flex: 1, height: 16, borderRadius: 8, flexDirection: 'row', overflow: 'hidden' },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendSwatch: { width: 10, height: 10, borderRadius: 5 },
  summary: {},
});
