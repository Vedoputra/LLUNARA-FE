import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Button, Input, Sheet, Text } from '@/components/ui';

export interface MetricInputSheetProps {
  visible: boolean;
  title: string;
  label: string;
  initialValue: number | null;
  onClose: () => void;
  onSave: (value: number) => void;
}

export function MetricInputSheet({
  visible,
  title,
  label,
  initialValue,
  onClose,
  onSave,
}: MetricInputSheetProps) {
  const [text, setText] = useState(initialValue != null ? String(initialValue) : '');

  const handleSave = () => {
    const parsed = Number(text.replace(',', '.'));
    if (!Number.isNaN(parsed) && parsed >= 0) {
      onSave(parsed);
    }
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text variant="subtitle" style={styles.title}>
        {title}
      </Text>
      <Input
        label={label}
        keyboardType="decimal-pad"
        value={text}
        onChangeText={setText}
        autoFocus
        containerStyle={styles.field}
      />
      <Button label="Simpan" onPress={handleSave} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: 12 },
  field: { marginBottom: 16 },
});
