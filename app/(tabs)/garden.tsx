import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConsistencyRing } from '@/components/ConsistencyRing';
import { ErrorState, LoadingState } from '@/components/feedback';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { Card, Text } from '@/components/ui';
import { useGarden } from '@/hooks/useGarden';
import { useTheme } from '@/hooks/useTheme';

const MOOD_PRESETS = ['senang', 'tenang', 'biasa', 'sensitif', 'cemas', 'sedih', 'mudah marah'];

const MOOD_ICONS: Record<string, number> = {
  senang: require('../../assets/moods/senang.png'),
  tenang: require('../../assets/moods/tenang.png'),
  biasa: require('../../assets/moods/biasa.png'),
  cemas: require('../../assets/moods/cemas.png'),
  sedih: require('../../assets/moods/sedih.png'),
  'mudah marah': require('../../assets/moods/mudah-marah.png'),
};

export default function TamanScreen() {
  const theme = useTheme();
  const gardenQuery = useGarden();

  if (gardenQuery.isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <ScreenHeader title="Taman Luna" />
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (gardenQuery.isError || !gardenQuery.data) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <ScreenHeader title="Taman Luna" />
        <ErrorState onRetry={() => gardenQuery.refetch()} />
      </SafeAreaView>
    );
  }

  const garden = gardenQuery.data;
  const daysElapsedThisMonth = new Date().getDate();
  const consistencyProgress = garden.logged_days_this_month / Math.max(1, daysElapsedThisMonth);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScreenHeader title="Taman Luna" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text muted>Tumbuh bersama setiap catatanmu.</Text>

        <Card style={styles.gardenSceneCard} padding={0}>
          <Image
            source={require('../../assets/mascot/luna-watering.png')}
            style={styles.gardenScene}
            resizeMode="cover"
          />
          <View style={styles.gardenBadge}>
            <View style={[styles.gardenBadgeIcon, { backgroundColor: theme.colors.primarySoft }]}>
              <MaterialCommunityIcons name="sprout" size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.gardenBadgeText}>
              <Text variant="subtitle">Kebunmu sedang mekar</Text>
              <Text variant="caption" muted>
                {garden.new_this_week} bunga baru minggu ini
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.consistencyCard}>
          <ConsistencyRing value={garden.logged_days_this_month} progress={consistencyProgress} />
          <View style={styles.consistencyText}>
            <Text variant="subtitle">
              Bulan ini kamu sudah mencatat {garden.logged_days_this_month} hari
            </Text>
            <Text muted variant="caption">
              Setiap catatan membantu Luna merawat tanaman di kebunmu.
            </Text>
          </View>
        </Card>

        <Text variant="subtitle" style={styles.sectionLabel}>
          Stiker suasana
        </Text>
        <View style={styles.stickerRow}>
          {MOOD_PRESETS.map((mood) => {
            const collected = garden.collected_moods.includes(mood);
            const icon = MOOD_ICONS[mood];
            return (
              <View key={mood} style={styles.stickerItem}>
                <View
                  style={[
                    styles.stickerCircle,
                    collected
                      ? { backgroundColor: theme.colors.surface }
                      : {
                          backgroundColor: 'transparent',
                          borderWidth: 1.5,
                          borderStyle: 'dashed',
                          borderColor: theme.colors.border,
                        },
                  ]}
                >
                  {collected && icon ? (
                    <Image source={icon} style={styles.stickerImage} />
                  ) : collected ? (
                    <Text variant="subtitle">🙂</Text>
                  ) : (
                    <Text variant="subtitle" muted>
                      ?
                    </Text>
                  )}
                </View>
                <Text variant="caption" muted style={styles.stickerLabel}>
                  {collected ? mood : '???'}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.quoteRow}>
          <MaterialCommunityIcons name="heart" size={16} color={theme.colors.primary} />
          <Text variant="body" style={styles.quoteText}>
            {garden.message}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  gardenSceneCard: { overflow: 'hidden' },
  gardenScene: { width: '100%', height: 180 },
  gardenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  gardenBadgeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gardenBadgeText: { flex: 1, gap: 2 },
  consistencyCard: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  consistencyText: { flex: 1, gap: 4 },
  sectionLabel: {},
  stickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  stickerItem: { alignItems: 'center', gap: 4, width: 64 },
  stickerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickerImage: { width: 56, height: 56, borderRadius: 28 },
  stickerLabel: { textAlign: 'center' },
  quoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  quoteText: { fontStyle: 'italic', textAlign: 'center' },
});
