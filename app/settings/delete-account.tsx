import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { apiClient } from '@/api/client';
import { Button, Card, Input, Sheet, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';

const CONFIRMATION_WORD = 'HAPUS';

export default function DeleteAccountScreen() {
  const theme = useTheme();
  const signOut = useAuthStore((state) => state.signOut);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const canConfirm = confirmationText.trim().toUpperCase() === CONFIRMATION_WORD;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiClient.delete('/api/v1/account');
    } catch (err) {
      setIsDeleting(false);
      Alert.alert(
        'Gagal menghapus akun',
        err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.',
      );
      return;
    }

    await signOut();
    setIsDeleting(false);
    setSheetVisible(false);
    router.replace('/(auth)/login');
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
        <Text variant="title">Hapus akun</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.warningCard}>
          <Text variant="subtitle" color={theme.colors.danger}>
            Tindakan ini permanen
          </Text>
          <Text muted>
            Seluruh catatan siklus, log harian, wellness, dan tag gejala kustommu akan dihapus
            sepenuhnya dan tidak dapat dikembalikan. Login ulang dengan akun ini juga tidak akan
            bisa dilakukan lagi.
          </Text>
        </Card>

        <Text muted style={styles.suggestion}>
          Sebaiknya ekspor datamu terlebih dahulu sebagai cadangan pribadi sebelum melanjutkan.
        </Text>
        <Button
          label="Ekspor data dulu"
          variant="secondary"
          icon={<Feather name="download" size={18} color={theme.colors.primary} />}
          onPress={() => router.push('/settings/export')}
        />

        <Button
          label="Lanjutkan hapus akun"
          variant="danger"
          icon={<Feather name="trash-2" size={18} color={theme.colors.onPrimary} />}
          onPress={() => setSheetVisible(true)}
          style={styles.deleteButton}
        />
      </ScrollView>

      <Sheet
        visible={sheetVisible}
        onClose={() => {
          setSheetVisible(false);
          setConfirmationText('');
        }}
      >
        <Text variant="subtitle" style={styles.sheetTitle}>
          Konfirmasi penghapusan
        </Text>
        <Text muted style={styles.sheetBody}>
          Ketik &quot;{CONFIRMATION_WORD}&quot; untuk memastikan kamu benar-benar ingin menghapus
          akun ini.
        </Text>
        <Input
          label={`Ketik ${CONFIRMATION_WORD}`}
          autoCapitalize="characters"
          value={confirmationText}
          onChangeText={setConfirmationText}
          containerStyle={styles.sheetField}
        />
        <Button
          label="Hapus akun secara permanen"
          variant="danger"
          disabled={!canConfirm}
          loading={isDeleting}
          onPress={handleDelete}
        />
      </Sheet>
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
  warningCard: { gap: 8 },
  suggestion: { marginTop: 8 },
  deleteButton: { marginTop: 16 },
  sheetTitle: { marginBottom: 8 },
  sheetBody: { marginBottom: 16 },
  sheetField: { marginBottom: 16 },
});
