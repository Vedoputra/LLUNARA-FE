import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Text } from '@/components/ui';
import { useResponsive } from '@/hooks/useResponsive';
import { useTheme } from '@/hooks/useTheme';
import { exportAndShare, type ExportFormat } from '@/services/export';
import { addDaysISO, todayISO } from '@/utils/date';

const RANGE_OPTIONS = [
  { key: '3m', label: '3 bulan terakhir', days: 90 },
  { key: '6m', label: '6 bulan terakhir', days: 182 },
  { key: '1y', label: '1 tahun terakhir', days: 365 },
] as const;

export default function ExportScreen() {
  const theme = useTheme();
  const { contentWidth } = useResponsive();
  const [rangeKey, setRangeKey] = useState<(typeof RANGE_OPTIONS)[number]['key']>('6m');
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const today = todayISO();
    const selectedRange = RANGE_OPTIONS.find((option) => option.key === rangeKey);
    const from = addDaysISO(today, -(selectedRange?.days ?? 182));

    setIsExporting(true);
    try {
      await exportAndShare(format, from, today);
    } catch (err) {
      Alert.alert(
        'Gagal membuat laporan',
        err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.',
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
        >
          <Feather name="chevron-left" size={22} color={theme.colors.text} />
        </Pressable>
        <Text variant="title">Ekspor data</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, contentWidth]}>
        <Text muted>
          Buat laporan untuk dibawa ke dokter, atau simpan sebagai cadangan pribadi.
        </Text>

        <Text variant="subtitle" style={styles.sectionLabel}>
          Rentang waktu
        </Text>
        <Card style={styles.card}>
          {RANGE_OPTIONS.map((option) => (
            <Pressable
              key={option.key}
              accessibilityRole="radio"
              accessibilityState={{ checked: rangeKey === option.key }}
              accessibilityLabel={option.label}
              onPress={() => setRangeKey(option.key)}
              style={styles.radioRow}
            >
              <Feather
                name={rangeKey === option.key ? 'check-circle' : 'circle'}
                size={20}
                color={rangeKey === option.key ? theme.colors.primary : theme.colors.textMuted}
              />
              <Text>{option.label}</Text>
            </Pressable>
          ))}
        </Card>

        <Text variant="subtitle" style={styles.sectionLabel}>
          Format
        </Text>
        <View style={styles.formatRow}>
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ checked: format === 'pdf' }}
            accessibilityLabel="PDF"
            onPress={() => setFormat('pdf')}
            style={[
              styles.formatOption,
              {
                backgroundColor: format === 'pdf' ? theme.colors.primarySoft : theme.colors.surface,
                borderColor: format === 'pdf' ? theme.colors.primary : theme.colors.border,
              },
            ]}
          >
            <Feather
              name="file-text"
              size={22}
              color={format === 'pdf' ? theme.colors.primary : theme.colors.textMuted}
            />
            <Text
              variant="subtitle"
              color={format === 'pdf' ? theme.colors.primary : theme.colors.text}
            >
              PDF
            </Text>
            <Text variant="caption" muted>
              Ringkasan untuk dokter
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ checked: format === 'csv' }}
            accessibilityLabel="CSV"
            onPress={() => setFormat('csv')}
            style={[
              styles.formatOption,
              {
                backgroundColor: format === 'csv' ? theme.colors.primarySoft : theme.colors.surface,
                borderColor: format === 'csv' ? theme.colors.primary : theme.colors.border,
              },
            ]}
          >
            <Feather
              name="file"
              size={22}
              color={format === 'csv' ? theme.colors.primary : theme.colors.textMuted}
            />
            <Text
              variant="subtitle"
              color={format === 'csv' ? theme.colors.primary : theme.colors.text}
            >
              CSV
            </Text>
            <Text variant="caption" muted>
              Data mentah lengkap
            </Text>
          </Pressable>
        </View>

        <Button
          label={isExporting ? 'Menyiapkan laporan…' : 'Buat laporan'}
          onPress={handleExport}
          loading={isExporting}
          style={styles.exportButton}
        />
        <Text variant="caption" muted style={styles.note}>
          Ekspor berkala juga berguna sebagai cadangan datamu, karena tier gratis yang kami pakai
          tidak menyediakan backup otomatis.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 20, gap: 12, paddingBottom: 40 },
  sectionLabel: { marginTop: 8 },
  card: { gap: 4 },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 },
  formatRow: { flexDirection: 'row', gap: 12 },
  formatOption: {
    flex: 1,
    minHeight: 100,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 12,
  },
  exportButton: { marginTop: 8 },
  note: { textAlign: 'center' },
});
