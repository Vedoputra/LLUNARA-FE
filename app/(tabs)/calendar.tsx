import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/feedback';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { useTheme } from '@/hooks/useTheme';

export default function KalenderScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScreenHeader title="Kalender" />
      <View style={styles.content}>
        <EmptyState
          title="Kalender siklus segera hadir"
          message="Tandai hari menstruasi dan lihat prediksi siklusmu di sini pada tahap pengembangan berikutnya."
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});
