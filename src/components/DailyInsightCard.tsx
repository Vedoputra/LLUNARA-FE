import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import {
  CONTENT_ICONS,
  DAILY_INSIGHTS,
  INSIGHT_LABELS,
  type InsightKind,
} from '@/constants/dailyContent';
import { useTheme } from '@/hooks/useTheme';
import { pickForDay } from '@/utils/dailyRotation';

export interface DailyInsightCardProps {
  /** Tanggal ISO — konten berganti sekali sehari, bukan tiap render. */
  date: string;
}

export function DailyInsightCard({ date }: DailyInsightCardProps) {
  const theme = useTheme();
  const insight = pickForDay(DAILY_INSIGHTS, date);
  if (!insight) return null;

  const accents: Record<InsightKind, string> = {
    did_you_know: theme.colors.cycle.ovulation,
    fyi: theme.colors.cycle.follicular,
    fun_fact: theme.colors.cycle.luteal,
  };
  const accent = accents[insight.kind];
  const icon = CONTENT_ICONS[insight.icon];

  return (
    <Card style={styles.card}>
      {icon ? <Image source={icon} style={styles.floatingIcon} resizeMode="contain" /> : null}

      <View style={[styles.badge, { backgroundColor: accent }]}>
        <MaterialCommunityIcons name="star-four-points" size={12} color={theme.colors.text} />
        <Text variant="caption">{INSIGHT_LABELS[insight.kind]}</Text>
      </View>

      <Text style={styles.body}>{insight.body}</Text>

      {/* <View style={styles.footerRow}>
        <MaterialCommunityIcons name="heart" size={12} color={theme.colors.textMuted} />
        <Text variant="caption" muted>
          Informasi umum, bukan saran medis.
        </Text>
      </View> */}
    </Card>
  );
}

const ICON_SIZE = 80;

const styles = StyleSheet.create({
  card: { gap: 10 },
  /**
   * Maskot melayang tanpa bubble di pojok kanan atas, sedikit keluar dari tepi
   * kartu supaya terbaca sebagai stiker yang ditempel — bukan bagian isi kartu.
   */
  floatingIcon: {
    position: 'absolute',
    top: -6,
    right: +6,
    width: ICON_SIZE,
    height: ICON_SIZE,
    transform: [{ rotate: '8deg' }],
    zIndex: 1,
  },
  badge: {
    flexDirection: 'row',
    top: +10,
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  /**
   * Digeser turun melewati tepi bawah maskot, bukan diberi `paddingRight`:
   * indentasi kanan akan mempersempit *semua* baris, padahal yang bersinggungan
   * dengan maskot cuma baris pertama.
   */
  body: { marginTop: 14 },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
