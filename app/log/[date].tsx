import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SymptomSelector } from '@/components/SymptomSelector';
import { Card, Text } from '@/components/ui';
import { LoadingState } from '@/components/feedback';
import { useCycles } from '@/hooks/useCycles';
import { useDailyLogs, useDeleteDailyLog, useSaveDailyLog } from '@/hooks/useDailyLogs';
import { useSymptoms } from '@/hooks/useSymptoms';
import { useTheme } from '@/hooks/useTheme';
import type { FlowIntensity } from '@/types/api';
import { diffInDays, formatLongDate } from '@/utils/date';

const FLOW_OPTIONS: { value: FlowIntensity; label: string; opacity: number }[] = [
  { value: 'light', label: 'Ringan', opacity: 0.4 },
  { value: 'medium', label: 'Sedang', opacity: 0.7 },
  { value: 'heavy', label: 'Berat', opacity: 1 },
];

const MOOD_OPTIONS: { value: string; emoji: string }[] = [
  { value: 'senang', emoji: '😊' },
  { value: 'tenang', emoji: '😌' },
  { value: 'biasa', emoji: '😐' },
  { value: 'sensitif', emoji: '😳' },
  { value: 'cemas', emoji: '😟' },
  { value: 'sedih', emoji: '😢' },
  { value: 'mudah marah', emoji: '😠' },
];

const AUTOSAVE_DELAY_MS = 800;
const NOTES_MAX_LENGTH = 500;

interface SaveOverrides {
  flow_intensity?: FlowIntensity | undefined;
  mood?: string | undefined;
  symptom_ids?: string[];
  notes?: string;
}

export default function DailyLogScreen() {
  const theme = useTheme();
  const { date } = useLocalSearchParams<{ date: string }>();

  const logQuery = useDailyLogs(date, date);
  const cyclesQuery = useCycles();
  const symptomsQuery = useSymptoms();
  const saveLog = useSaveDailyLog();
  const deleteLog = useDeleteDailyLog();

  const [flowIntensity, setFlowIntensity] = useState<FlowIntensity | undefined>(undefined);
  const [mood, setMood] = useState<string | undefined>(undefined);
  const [symptomIds, setSymptomIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  const initializedRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (initializedRef.current || !logQuery.data) return;
    const existing = logQuery.data[0];
    if (existing) {
      setFlowIntensity(existing.flow_intensity ?? undefined);
      setMood(existing.mood ?? undefined);
      setSymptomIds(existing.symptom_ids);
      setNotes(existing.notes ?? '');
    }
    initializedRef.current = true;
  }, [logQuery.data]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const scheduleSave = (overrides: SaveOverrides) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveLog.mutate(
        {
          date,
          flow_intensity: overrides.flow_intensity ?? flowIntensity,
          mood: overrides.mood ?? mood,
          symptom_ids: overrides.symptom_ids ?? symptomIds,
          notes: overrides.notes ?? notes,
        },
        {
          onSuccess: () => {
            setJustSaved(true);
            setTimeout(() => setJustSaved(false), 2500);
          },
        },
      );
    }, AUTOSAVE_DELAY_MS);
  };

  const dayOfCycle = (() => {
    const cycles = cyclesQuery.data ?? [];
    const relevant = cycles
      .filter((cycle) => cycle.start_date <= date)
      .sort((a, b) => (a.start_date < b.start_date ? 1 : -1))[0];
    if (!relevant) return null;
    return diffInDays(relevant.start_date, date) + 1;
  })();

  const symptoms = symptomsQuery.data ?? [];
  const hasKram = symptomIds.some((id) =>
    symptoms
      .find((symptom) => symptom.id === id)
      ?.name.toLowerCase()
      .includes('kram'),
  );

  const handleDelete = () => {
    Alert.alert('Hapus catatan hari ini', 'Catatan untuk hari ini akan dihapus permanen.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          deleteLog.mutate(date, { onSuccess: () => router.back() });
        },
      },
    ]);
  };

  if (logQuery.isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
        >
          <Feather name="chevron-left" size={22} color={theme.colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text variant="title">{formatLongDate(date)}</Text>
          {dayOfCycle ? (
            <Text variant="caption" muted>
              Hari ke-{dayOfCycle}
            </Text>
          ) : null}
        </View>
        {justSaved ? (
          <View style={[styles.savedPill, { backgroundColor: theme.colors.success }]}>
            <Feather name="check" size={14} color="#FFFFFF" />
            <Text variant="caption" color="#FFFFFF">
              Tersimpan
            </Text>
          </View>
        ) : (
          <View style={styles.savedPillPlaceholder} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="subtitle" style={styles.sectionLabel}>
          Intensitas
        </Text>
        <View style={styles.flowRow}>
          {FLOW_OPTIONS.map((option) => {
            const selected = flowIntensity === option.value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityLabel={option.label}
                accessibilityState={{ selected }}
                onPress={() => {
                  setFlowIntensity(option.value);
                  scheduleSave({ flow_intensity: option.value });
                }}
                style={[
                  styles.flowOption,
                  {
                    backgroundColor: selected ? theme.colors.primarySoft : theme.colors.surface,
                    borderColor: selected ? theme.colors.primary : theme.colors.border,
                  },
                ]}
              >
                <Feather
                  name="droplet"
                  size={22}
                  color={selected ? theme.colors.primary : theme.colors.textMuted}
                  style={{ opacity: option.opacity }}
                />
                <Text variant="body" color={selected ? theme.colors.primary : theme.colors.text}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text variant="subtitle" style={styles.sectionLabel}>
          Suasana hati
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moodRow}
        >
          {MOOD_OPTIONS.map((option) => {
            const selected = mood === option.value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityLabel={option.value}
                accessibilityState={{ selected }}
                onPress={() => {
                  setMood(option.value);
                  scheduleSave({ mood: option.value });
                }}
                style={[
                  styles.moodChip,
                  {
                    backgroundColor: selected ? theme.colors.primarySoft : theme.colors.surface,
                    borderColor: selected ? theme.colors.primary : theme.colors.border,
                  },
                ]}
              >
                <Text variant="body">{option.emoji}</Text>
                <Text variant="body" color={selected ? theme.colors.primary : theme.colors.text}>
                  {option.value}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text variant="subtitle" style={styles.sectionLabel}>
          Gejala
        </Text>
        <SymptomSelector
          selectedIds={symptomIds}
          onChange={(ids) => {
            setSymptomIds(ids);
            scheduleSave({ symptom_ids: ids });
          }}
        />

        {hasKram ? (
          <Card style={styles.empathyCard}>
            <Image
              source={require('../../assets/mascot/luna-cozy.png')}
              style={styles.empathyImage}
              resizeMode="contain"
            />
            <View style={styles.empathyText}>
              <Text variant="subtitle" color={theme.colors.primary}>
                Semoga kramnya cepat reda.
              </Text>
              <Text muted>Istirahat ya.</Text>
            </View>
          </Card>
        ) : null}

        <Text variant="subtitle" style={styles.sectionLabel}>
          Catatan
        </Text>
        <View
          style={[
            styles.notesBox,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <TextInput
            multiline
            maxLength={NOTES_MAX_LENGTH}
            placeholder="Tulis apa pun yang ingin kamu ingat…"
            placeholderTextColor={theme.colors.textMuted}
            value={notes}
            onChangeText={(text) => {
              setNotes(text);
              scheduleSave({ notes: text });
            }}
            style={[
              styles.notesInput,
              { color: theme.colors.text, fontFamily: theme.fontFamilies.body },
            ]}
          />
        </View>
        <Text variant="caption" muted style={styles.notesCounter}>
          {notes.length}/{NOTES_MAX_LENGTH}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Hapus catatan hari ini"
          onPress={handleDelete}
          style={styles.deleteButton}
        >
          <Feather name="trash-2" size={16} color={theme.colors.danger} />
          <Text variant="body" color={theme.colors.danger}>
            Hapus catatan hari ini
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerCenter: { alignItems: 'center' },
  savedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  savedPillPlaceholder: { width: 40 },
  content: { padding: 20, gap: 12, paddingBottom: 40 },
  sectionLabel: { marginTop: 8 },
  flowRow: { flexDirection: 'row', gap: 8 },
  flowOption: {
    flex: 1,
    minHeight: 80,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  moodRow: { gap: 8, paddingVertical: 4 },
  moodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  empathyCard: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  empathyImage: { width: 56, height: 56 },
  empathyText: { flex: 1, gap: 2 },
  notesBox: {
    minHeight: 100,
    borderRadius: 16,
    borderWidth: 1,
    padding: 4,
  },
  notesInput: {
    minHeight: 92,
    padding: 12,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  notesCounter: { textAlign: 'right' },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 44,
    marginTop: 8,
  },
});
