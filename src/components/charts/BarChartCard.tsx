import { View, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

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

  return (
    <Card style={styles.card}>
      <Text variant="subtitle" style={styles.title}>
        {title}
      </Text>
      <View accessible accessibilityLabel={summaryText} style={styles.chartWrap}>
        <BarChart
          data={data.map((item) => ({ ...item, frontColor: barColor }))}
          horizontal
          barBorderRadius={8}
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
  summary: {},
});
