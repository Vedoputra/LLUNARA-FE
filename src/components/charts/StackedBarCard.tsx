import { View, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

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
        <BarChart
          stackData={data}
          horizontal
          barBorderRadius={6}
          hideRules
          yAxisColor="transparent"
          xAxisColor="transparent"
          hideYAxisText
          labelWidth={90}
          xAxisLabelTextStyle={{ color: theme.colors.textMuted, fontSize: 12 }}
          height={data.length * 36}
          barWidth={18}
          spacing={20}
        />
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
  chartWrap: { marginVertical: 8 },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendSwatch: { width: 10, height: 10, borderRadius: 5 },
  summary: {},
});
