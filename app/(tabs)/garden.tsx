import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/feedback';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { useTheme } from '@/hooks/useTheme';

export default function TamanScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScreenHeader title="Taman Luna" />
      <View style={styles.content}>
        <EmptyState
          title="Taman Luna segera hadir"
          message="Setiap catatan yang kamu simpan nanti akan membuat tamanmu makin semarak."
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});
