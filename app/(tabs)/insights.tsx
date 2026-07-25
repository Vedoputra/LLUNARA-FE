import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/feedback';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { useTheme } from '@/hooks/useTheme';

export default function StatistikScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScreenHeader title="Statistik" />
      <View style={styles.content}>
        <EmptyState
          title="Statistik siklus segera hadir"
          message="Pola siklus, gejala paling sering, dan tren akan tampil di sini pada tahap pengembangan berikutnya."
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});
