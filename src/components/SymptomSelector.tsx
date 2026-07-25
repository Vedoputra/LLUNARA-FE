import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Chip, Input, Sheet, Text } from '@/components/ui';
import { useCreateSymptom, useSymptoms } from '@/hooks/useSymptoms';
import type { SymptomCategory } from '@/types/api';

const CATEGORY_LABELS: Record<SymptomCategory, string> = {
  physical: 'Fisik',
  emotional: 'Emosional',
  other: 'Lainnya',
};

const CATEGORIES: SymptomCategory[] = ['physical', 'emotional', 'other'];

export interface SymptomSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function SymptomSelector({ selectedIds, onChange }: SymptomSelectorProps) {
  const { data: symptoms, isLoading } = useSymptoms();
  const createSymptom = useCreateSymptom();
  const [addSheetVisible, setAddSheetVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<SymptomCategory>('physical');
  const [addError, setAddError] = useState<string | null>(null);

  const toggle = (id: string) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((existing) => existing !== id)
        : [...selectedIds, id],
    );
  };

  const closeSheet = () => {
    setAddSheetVisible(false);
    setNewName('');
    setAddError(null);
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setAddError(null);
    try {
      const created = await createSymptom.mutateAsync({
        name: newName.trim(),
        category: newCategory,
      });
      onChange([...selectedIds, created.id]);
      closeSheet();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Gagal menambahkan gejala.');
    }
  };

  if (isLoading) {
    return <Text muted>Memuat daftar gejala...</Text>;
  }

  const groups = CATEGORIES.map((category) => ({
    category,
    items: (symptoms ?? []).filter((symptom) => symptom.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <View style={styles.container}>
      {groups.map((group) => (
        <View key={group.category} style={styles.group}>
          <Text variant="caption" muted style={styles.groupLabel}>
            {CATEGORY_LABELS[group.category].toUpperCase()}
          </Text>
          <View style={styles.chipRow}>
            {group.items.map((symptom) => (
              <Chip
                key={symptom.id}
                label={symptom.name}
                selected={selectedIds.includes(symptom.id)}
                onPress={() => toggle(symptom.id)}
              />
            ))}
          </View>
        </View>
      ))}

      <Chip
        label="+ Tambah gejala lain"
        onPress={() => setAddSheetVisible(true)}
        style={styles.addChip}
      />

      <Sheet visible={addSheetVisible} onClose={closeSheet}>
        <Text variant="subtitle" style={styles.sheetTitle}>
          Tambah gejala
        </Text>
        <Input
          label="Nama gejala"
          placeholder="misal: Nyeri pinggang"
          value={newName}
          onChangeText={setNewName}
          error={addError ?? undefined}
          containerStyle={styles.sheetField}
        />
        <Text variant="caption" muted style={styles.categoryLabel}>
          Kategori
        </Text>
        <View style={styles.categoryRow}>
          {CATEGORIES.map((category) => (
            <Chip
              key={category}
              label={CATEGORY_LABELS[category]}
              selected={newCategory === category}
              onPress={() => setNewCategory(category)}
            />
          ))}
        </View>
        <Button label="Simpan" onPress={handleCreate} loading={createSymptom.isPending} />
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  group: { gap: 8 },
  groupLabel: { letterSpacing: 0.5 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  addChip: { borderStyle: 'dashed', alignSelf: 'flex-start' },
  sheetTitle: { marginBottom: 12 },
  sheetField: { marginBottom: 12 },
  categoryLabel: { marginBottom: 8 },
  categoryRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
});
