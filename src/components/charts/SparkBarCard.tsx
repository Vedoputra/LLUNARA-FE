import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export interface SparkBarPoint {
  /** Tanggal ISO, dipakai sebagai key dan untuk label tepi. */
  date: string;
  /** `null` berarti tidak ada catatan di hari itu — bukan nilai nol. */
  value: number | null;
}

export interface SparkBarCardProps {
  title: string;
  data: SparkBarPoint[];
  summaryText: string;
  /** Nilai terakhir yang tercatat, ditampilkan besar di kanan atas. */
  latestLabel?: string;
  color?: string;
  startLabel?: string;
  endLabel?: string;
}

const CHART_HEIGHT = 84;
const MIN_BAR_RATIO = 0.08;

/**
 * Deretan batang vertikal sederhana untuk riwayat harian.
 *
 * Ditulis dengan Flexbox biasa, bukan library grafik: sumbu horizontal di sini
 * hanya perlu proporsi tinggi, dan penempatan label library grafik terbukti
 * tidak bisa diandalkan pada layout serapat ini.
 *
 * Hari tanpa catatan digambar sebagai jalur kosong redup, bukan batang nol —
 * ketidakhadiran tidak boleh terlihat seperti pencapaian nol.
 */
export function SparkBarCard({
  title,
  data,
  summaryText,
  latestLabel,
  color,
  startLabel,
  endLabel,
}: SparkBarCardProps) {
  const theme = useTheme();
  const barColor = color ?? theme.colors.primary;

  const values = data.map((point) => point.value).filter((value): value is number => value != null);
  const maxValue = values.length > 0 ? Math.max(...values) : 0;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="subtitle" style={styles.title}>
          {title}
        </Text>
        {latestLabel ? (
          <Text variant="subtitle" color={barColor}>
            {latestLabel}
          </Text>
        ) : null}
      </View>

      <View accessible accessibilityLabel={summaryText} style={styles.chartWrap}>
        {data.map((point) => {
          const ratio =
            point.value != null && maxValue > 0
              ? Math.max(MIN_BAR_RATIO, point.value / maxValue)
              : 0;
          return (
            <View key={point.date} style={styles.slot}>
              <View
                style={[styles.track, { backgroundColor: theme.colors.surfaceVariant }]}
                pointerEvents="none"
              />
              {ratio > 0 ? (
                <View
                  style={[styles.bar, { backgroundColor: barColor, height: `${ratio * 100}%` }]}
                />
              ) : null}
            </View>
          );
        })}
      </View>

      {startLabel || endLabel ? (
        <View style={styles.axisRow}>
          <Text variant="caption" muted>
            {startLabel ?? ''}
          </Text>
          <Text variant="caption" muted>
            {endLabel ?? ''}
          </Text>
        </View>
      ) : null}

      <Text muted variant="caption" style={styles.summary}>
        {summaryText}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { flexShrink: 1 },
  chartWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: CHART_HEIGHT,
    marginTop: 4,
  },
  slot: { flex: 1, height: '100%', justifyContent: 'flex-end' },
  track: { ...StyleSheet.absoluteFillObject, borderRadius: 3 },
  bar: { width: '100%', borderRadius: 3, minHeight: 3 },
  axisRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summary: {},
});
