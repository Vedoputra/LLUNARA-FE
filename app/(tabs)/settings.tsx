import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { ReminderSettings } from '@/components/settings/ReminderSettings';
import { SettingsRow } from '@/components/settings/SettingsRow';
import { Button, Card, Divider, Input, Sheet, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useDeleteSymptom, useSymptoms } from '@/hooks/useSymptoms';
import { authenticate, isAppLockAvailable } from '@/services/appLock';
import { seedSampleData, type SeedProgress } from '@/services/devSeed';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore, type ThemePreference } from '@/store/settingsStore';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Ikuti sistem' },
  { value: 'light', label: 'Terang' },
  { value: 'dark', label: 'Gelap' },
];

const REPOSITORY_URL = 'https://github.com/Vedoputra/LLUNARA-FE';

export default function PengaturanScreen() {
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const symptomsQuery = useSymptoms();
  const deleteSymptom = useDeleteSymptom();

  const displayName = useSettingsStore((state) => state.displayName);
  const birthYear = useSettingsStore((state) => state.birthYear);
  const defaultCycleLength = useSettingsStore((state) => state.defaultCycleLength);
  const defaultPeriodLength = useSettingsStore((state) => state.defaultPeriodLength);
  const wellnessEnabled = useSettingsStore((state) => state.wellnessEnabled);
  const themePreference = useSettingsStore((state) => state.themePreference);
  const appLockEnabled = useSettingsStore((state) => state.appLockEnabled);
  const setDisplayName = useSettingsStore((state) => state.setDisplayName);
  const setBirthYear = useSettingsStore((state) => state.setBirthYear);
  const setDefaultCycleLength = useSettingsStore((state) => state.setDefaultCycleLength);
  const setDefaultPeriodLength = useSettingsStore((state) => state.setDefaultPeriodLength);
  const setWellnessEnabled = useSettingsStore((state) => state.setWellnessEnabled);
  const setThemePreference = useSettingsStore((state) => state.setThemePreference);
  const setAppLockEnabled = useSettingsStore((state) => state.setAppLockEnabled);

  const [signingOut, setSigningOut] = useState(false);

  const [nameSheetVisible, setNameSheetVisible] = useState(false);
  const [nameInput, setNameInput] = useState(displayName ?? '');
  const [yearSheetVisible, setYearSheetVisible] = useState(false);
  const [yearInput, setYearInput] = useState(birthYear ? String(birthYear) : '');
  const [cycleLengthSheetVisible, setCycleLengthSheetVisible] = useState(false);
  const [cycleLengthInput, setCycleLengthInput] = useState(String(defaultCycleLength));
  const [periodLengthSheetVisible, setPeriodLengthSheetVisible] = useState(false);
  const [periodLengthInput, setPeriodLengthInput] = useState(String(defaultPeriodLength));
  const [themeSheetVisible, setThemeSheetVisible] = useState(false);
  const [disclaimerSheetVisible, setDisclaimerSheetVisible] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedProgress, setSeedProgress] = useState<SeedProgress | null>(null);

  const customSymptoms = (symptomsQuery.data ?? []).filter((symptom) => symptom.is_custom);

  const handleSeedData = () => {
    Alert.alert(
      'Isi data contoh',
      'Ini akan membuat siklus, log harian, dan wellness contoh secara nyata di akunmu. Cocok untuk menguji fitur, bukan untuk data asli. Lanjutkan?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Isi data',
          onPress: async () => {
            setIsSeeding(true);
            setSeedProgress(null);
            try {
              await seedSampleData(setSeedProgress);
              Alert.alert('Selesai', 'Data contoh berhasil dibuat.');
            } catch (err) {
              Alert.alert(
                'Gagal mengisi data',
                err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.',
              );
            } finally {
              setIsSeeding(false);
              setSeedProgress(null);
            }
          },
        },
      ],
    );
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
  };

  const handleDeleteSymptom = (id: string, name: string) => {
    Alert.alert(
      'Hapus tag gejala',
      `Hapus tag "${name}"? Tag ini tidak akan muncul lagi di pilihan gejala.`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => deleteSymptom.mutate(id) },
      ],
    );
  };

  const handleAppLockToggle = async (next: boolean) => {
    if (next) {
      const available = await isAppLockAvailable();
      if (!available) {
        Alert.alert(
          'Tidak tersedia',
          'Aktifkan biometrik atau PIN perangkat terlebih dahulu di pengaturan sistem sebelum mengaktifkan ini.',
        );
        return;
      }
      const success = await authenticate();
      if (!success) return;
    }
    setAppLockEnabled(next);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScreenHeader title="Pengaturan" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text muted style={styles.subtitle}>
          Masuk sebagai {user?.email}
        </Text>

        <Text variant="caption" muted style={styles.sectionLabel}>
          PROFIL
        </Text>
        <Card style={styles.card}>
          <SettingsRow
            icon="user"
            label="Nama tampilan"
            value={displayName ?? 'Belum diatur'}
            onPress={() => {
              setNameInput(displayName ?? '');
              setNameSheetVisible(true);
            }}
          />
          <Divider />
          <SettingsRow
            icon="calendar"
            label="Tahun lahir"
            value={birthYear ? String(birthYear) : 'Belum diatur'}
            onPress={() => {
              setYearInput(birthYear ? String(birthYear) : '');
              setYearSheetVisible(true);
            }}
          />
        </Card>

        <Text variant="caption" muted style={styles.sectionLabel}>
          SIKLUS
        </Text>
        <Card style={styles.card}>
          <SettingsRow
            icon="refresh-cw"
            label="Panjang siklus default"
            value={`${defaultCycleLength} hari`}
            onPress={() => {
              setCycleLengthInput(String(defaultCycleLength));
              setCycleLengthSheetVisible(true);
            }}
          />
          <Divider />
          <SettingsRow
            icon="droplet"
            label="Durasi menstruasi default"
            value={`${defaultPeriodLength} hari`}
            onPress={() => {
              setPeriodLengthInput(String(defaultPeriodLength));
              setPeriodLengthSheetVisible(true);
            }}
          />
        </Card>

        <Text variant="caption" muted style={styles.sectionLabel}>
          PENGINGAT
        </Text>
        <Card style={styles.card}>
          <ReminderSettings />
        </Card>

        <Text variant="caption" muted style={styles.sectionLabel}>
          GEJALA
        </Text>
        <Card style={styles.card}>
          {customSymptoms.length === 0 ? (
            <Text muted>Belum ada tag gejala kustom. Tambahkan dari layar Catat hari ini.</Text>
          ) : (
            customSymptoms.map((symptom) => (
              <View key={symptom.id} style={styles.symptomRow}>
                <Text>{symptom.name}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Hapus tag ${symptom.name}`}
                  onPress={() => handleDeleteSymptom(symptom.id, symptom.name)}
                  hitSlop={8}
                >
                  <Feather name="trash-2" size={18} color={theme.colors.danger} />
                </Pressable>
              </View>
            ))
          )}
        </Card>

        <Text variant="caption" muted style={styles.sectionLabel}>
          WELLNESS
        </Text>
        <Card style={styles.card}>
          <SettingsRow
            icon="droplet"
            label="Air minum"
            switchValue={wellnessEnabled.water}
            onSwitchChange={(value) => setWellnessEnabled('water', value)}
          />
          <Divider />
          <SettingsRow
            icon="moon"
            label="Tidur"
            switchValue={wellnessEnabled.sleep}
            onSwitchChange={(value) => setWellnessEnabled('sleep', value)}
          />
          <Divider />
          <SettingsRow
            icon="activity"
            label="Berat badan"
            switchValue={wellnessEnabled.weight}
            onSwitchChange={(value) => setWellnessEnabled('weight', value)}
          />
        </Card>

        <Text variant="caption" muted style={styles.sectionLabel}>
          TAMPILAN
        </Text>
        <Card style={styles.card}>
          <SettingsRow
            icon="eye"
            label="Tema"
            value={THEME_OPTIONS.find((option) => option.value === themePreference)?.label}
            onPress={() => setThemeSheetVisible(true)}
          />
        </Card>

        <Text variant="caption" muted style={styles.sectionLabel}>
          KEAMANAN
        </Text>
        <Card style={styles.card}>
          <SettingsRow
            icon="lock"
            label="Kunci aplikasi"
            switchValue={appLockEnabled}
            onSwitchChange={handleAppLockToggle}
          />
        </Card>

        <Text variant="caption" muted style={styles.sectionLabel}>
          DATA
        </Text>
        <Card style={styles.card}>
          <SettingsRow
            icon="download"
            label="Ekspor data"
            onPress={() => router.push('/settings/export')}
          />
          <Divider />
          <SettingsRow
            icon="user-x"
            label="Hapus akun"
            danger
            onPress={() => router.push('/settings/delete-account')}
          />
        </Card>

        <Text variant="caption" muted style={styles.sectionLabel}>
          TENTANG
        </Text>
        <Card style={styles.card}>
          <SettingsRow icon="info" label="Versi" value="1.0.0" />
          <Divider />
          <SettingsRow
            icon="file-text"
            label="Disclaimer"
            onPress={() => setDisclaimerSheetVisible(true)}
          />
          <Divider />
          <SettingsRow
            icon="github"
            label="Repository"
            onPress={() => Linking.openURL(REPOSITORY_URL)}
          />
        </Card>

        {__DEV__ ? (
          <>
            <Text variant="caption" muted style={styles.sectionLabel}>
              PENGEMBANGAN
            </Text>
            <Card style={styles.card}>
              <Text muted variant="caption">
                Mengisi ~6 siklus riwayat, log harian tersebar di seluruh fase (bukan cuma hari
                menstruasi), dan wellness 14 hari terakhir — supaya Kalender, Statistik, dan Taman
                punya data untuk ditampilkan.
              </Text>
              {seedProgress ? (
                <Text variant="caption" color={theme.colors.primary}>
                  {seedProgress.step} ({seedProgress.current}/{seedProgress.total})
                </Text>
              ) : null}
              <Button
                label="Isi data contoh"
                variant="secondary"
                loading={isSeeding}
                onPress={handleSeedData}
              />
            </Card>
          </>
        ) : null}

        <Button
          label="Keluar"
          variant="ghost"
          loading={signingOut}
          onPress={handleSignOut}
          style={styles.button}
        />
      </ScrollView>

      <Sheet visible={nameSheetVisible} onClose={() => setNameSheetVisible(false)}>
        <Text variant="subtitle" style={styles.sheetTitle}>
          Nama tampilan
        </Text>
        <Input
          label="Nama"
          value={nameInput}
          onChangeText={setNameInput}
          containerStyle={styles.sheetField}
        />
        <Button
          label="Simpan"
          onPress={() => {
            setDisplayName(nameInput.trim() || null);
            setNameSheetVisible(false);
          }}
        />
      </Sheet>

      <Sheet visible={yearSheetVisible} onClose={() => setYearSheetVisible(false)}>
        <Text variant="subtitle" style={styles.sheetTitle}>
          Tahun lahir
        </Text>
        <Input
          label="Tahun lahir"
          keyboardType="number-pad"
          value={yearInput}
          onChangeText={setYearInput}
          containerStyle={styles.sheetField}
        />
        <Button
          label="Simpan"
          onPress={() => {
            const parsed = parseInt(yearInput, 10);
            setBirthYear(Number.isNaN(parsed) ? null : parsed);
            setYearSheetVisible(false);
          }}
        />
      </Sheet>

      <Sheet visible={cycleLengthSheetVisible} onClose={() => setCycleLengthSheetVisible(false)}>
        <Text variant="subtitle" style={styles.sheetTitle}>
          Panjang siklus default
        </Text>
        <Input
          label="Jumlah hari"
          keyboardType="number-pad"
          value={cycleLengthInput}
          onChangeText={setCycleLengthInput}
          containerStyle={styles.sheetField}
        />
        <Button
          label="Simpan"
          onPress={() => {
            const parsed = parseInt(cycleLengthInput, 10);
            if (!Number.isNaN(parsed) && parsed > 0) setDefaultCycleLength(parsed);
            setCycleLengthSheetVisible(false);
          }}
        />
      </Sheet>

      <Sheet visible={periodLengthSheetVisible} onClose={() => setPeriodLengthSheetVisible(false)}>
        <Text variant="subtitle" style={styles.sheetTitle}>
          Durasi menstruasi default
        </Text>
        <Input
          label="Jumlah hari"
          keyboardType="number-pad"
          value={periodLengthInput}
          onChangeText={setPeriodLengthInput}
          containerStyle={styles.sheetField}
        />
        <Button
          label="Simpan"
          onPress={() => {
            const parsed = parseInt(periodLengthInput, 10);
            if (!Number.isNaN(parsed) && parsed > 0) setDefaultPeriodLength(parsed);
            setPeriodLengthSheetVisible(false);
          }}
        />
      </Sheet>

      <Sheet visible={themeSheetVisible} onClose={() => setThemeSheetVisible(false)}>
        <Text variant="subtitle" style={styles.sheetTitle}>
          Tema
        </Text>
        {THEME_OPTIONS.map((option) => (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: themePreference === option.value }}
            accessibilityLabel={option.label}
            onPress={() => {
              setThemePreference(option.value);
              setThemeSheetVisible(false);
            }}
            style={styles.themeOptionRow}
          >
            <Feather
              name={themePreference === option.value ? 'check-circle' : 'circle'}
              size={20}
              color={
                themePreference === option.value ? theme.colors.primary : theme.colors.textMuted
              }
            />
            <Text>{option.label}</Text>
          </Pressable>
        ))}
      </Sheet>

      <Sheet visible={disclaimerSheetVisible} onClose={() => setDisclaimerSheetVisible(false)}>
        <Text variant="subtitle" style={styles.sheetTitle}>
          Disclaimer
        </Text>
        <Text muted style={styles.sheetField}>
          LLunara adalah teman pencatatan pribadimu. Prediksi dan insight yang ditampilkan adalah
          perkiraan dari data yang kamu catat sendiri — bukan alat kontrasepsi, bukan diagnosis
          medis, dan bukan pengganti konsultasi dengan tenaga kesehatan profesional.
        </Text>
      </Sheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 12, paddingBottom: 40 },
  subtitle: { marginBottom: 8 },
  sectionLabel: { marginTop: 8 },
  card: { gap: 8 },
  symptomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  button: { marginTop: 4 },
  sheetTitle: { marginBottom: 12 },
  sheetField: { marginBottom: 16 },
  themeOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
  },
});
