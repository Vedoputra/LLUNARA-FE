import { View, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { Card, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export interface LineChartCardProps {
  title: string;
  data: { value: number; label?: string }[];
  summaryText: string;
  color?: string;
}

export function LineChartCard({ title, data, summaryText, color }: LineChartCardProps) {
  const theme = useTheme();
  const lineColor = color ?? theme.colors.primary;

  return (
    <Card style={styles.card}>
      <Text variant="subtitle" style={styles.title}>
        {title}
      </Text>
      <View accessible accessibilityLabel={summaryText} style={styles.chartWrap}>
        <LineChart
          data={data}
          color={lineColor}
          thickness={2.5}
          curved
          dataPointsColor={lineColor}
          hideRules
          yAxisColor="transparent"
          xAxisColor={theme.colors.border}
          yAxisTextStyle={{ color: theme.colors.textMuted, fontSize: 11 }}
          xAxisLabelTextStyle={{ color: theme.colors.textMuted, fontSize: 11 }}
          initialSpacing={16}
          endSpacing={16}
          height={140}
          noOfSections={3}
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
