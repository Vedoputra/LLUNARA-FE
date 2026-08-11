import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

const PETAL_ANGLES = [-90, -18, 54, 126, 198] as const;
const BADGE_SIZE = 44;

export interface SeasonCollectionProps {
  /** Musim yang sudah dituntaskan. Musim berjalan tidak ikut ditampilkan. */
  completedSeasons: number;
  /** Musim yang sedang berjalan, untuk menandai posisi berikutnya. */
  currentSeasonIndex: number;
}

/**
 * Rak koleksi musim yang sudah selesai.
 *
 * Musim yang tuntas tidak hilang saat kebun dimulai ulang — ia pindah ke sini
 * sebagai bunga permanen, jadi pergantian musim terasa sebagai tambahan, bukan
 * kehilangan progres.
 */
export function SeasonCollection({ completedSeasons, currentSeasonIndex }: SeasonCollectionProps) {
  const theme = useTheme();
  const seasons = theme.colors.gardenSeasons;

  if (completedSeasons === 0) {
    const next = seasons[currentSeasonIndex % seasons.length];
    return (
      <Text variant="caption" muted>
        Selesaikan {next.name} untuk menyimpan bunga pertamamu di sini.
      </Text>
    );
  }

  return (
    <View style={styles.row}>
      {Array.from({ length: completedSeasons }, (_, index) => {
        const season = seasons[index % seasons.length];
        const cycleNumber = Math.floor(index / seasons.length) + 1;
        return (
          <View key={index} style={styles.item}>
            <View style={[styles.badge, { backgroundColor: theme.colors.surface }]}>
              <SeasonBloom
                petalColor={season.blooms[0]}
                centerColor={theme.colors.garden.blossomCenter}
              />
            </View>
            <Text variant="caption" muted style={styles.label} numberOfLines={1}>
              {season.name.replace('Musim ', '')}
              {cycleNumber > 1 ? ` ${cycleNumber}` : ''}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function SeasonBloom({ petalColor, centerColor }: { petalColor: string; centerColor: string }) {
  const size = 28;
  const center = size / 2;
  const radius = 7;

  return (
    <Svg width={size} height={size}>
      {PETAL_ANGLES.map((angle) => {
        const radians = (angle * Math.PI) / 180;
        return (
          <Circle
            key={angle}
            cx={center + Math.cos(radians) * radius}
            cy={center + Math.sin(radians) * radius}
            r={radius * 0.74}
            fill={petalColor}
          />
        );
      })}
      <Circle cx={center} cy={center} r={radius * 0.52} fill={centerColor} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  item: { alignItems: 'center', gap: 4, width: 56 },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { textAlign: 'center' },
});
