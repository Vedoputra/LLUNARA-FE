import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { z } from 'zod';

import { supabase } from '@/api/supabase';
import { Button, Card, Input, Sheet, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';

const loginSchema = z.object({
  email: z.email('Format email tidak valid'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const theme = useTheme();
  const signIn = useAuthStore((state) => state.signIn);
  const sessionMessage = useAuthStore((state) => state.sessionMessage);
  const clearSessionMessage = useAuthStore((state) => state.clearSessionMessage);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [resetSheetVisible, setResetSheetVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginForm) => {
    setFormError(null);
    clearSessionMessage();
    const { error } = await signIn(values.email.trim(), values.password);
    if (error) {
      setFormError(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image source={require('../../assets/mascot/luna-waving.png')} style={styles.mascot} />
          <Text variant="display" color={theme.colors.primary}>
            LLunara
          </Text>
          <Text muted>Senang kamu kembali!</Text>
        </View>

        {sessionMessage ? (
          <View style={[styles.sessionBanner, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text variant="caption" color={theme.colors.danger}>
              {sessionMessage}
            </Text>
          </View>
        ) : null}

        <Card style={styles.card}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="nama@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                containerStyle={styles.field}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Kata sandi"
                placeholder="Masukkan kata sandi"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                containerStyle={styles.field}
                rightElement={
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
                    }
                    onPress={() => setShowPassword((prev) => !prev)}
                    hitSlop={8}
                  >
                    <Feather
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={theme.colors.textMuted}
                    />
                  </Pressable>
                }
              />
            )}
          />

          {formError ? (
            <Text variant="caption" color={theme.colors.danger} style={styles.formError}>
              {formError}
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Lupa kata sandi?"
            onPress={() => setResetSheetVisible(true)}
            style={styles.forgotPassword}
          >
            <Text variant="caption" color={theme.colors.primary}>
              Lupa kata sandi?
            </Text>
          </Pressable>

          <Button
            label="Masuk"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            style={styles.submitButton}
          />

          <View style={styles.footerRow}>
            <Text muted>Belum punya akun? </Text>
            <Link href="/(auth)/register" asChild>
              <Pressable accessibilityRole="button" accessibilityLabel="Daftar">
                <Text color={theme.colors.primary}>Daftar</Text>
              </Pressable>
            </Link>
          </View>
        </Card>

        <Text variant="caption" muted style={styles.tagline}>
          Dibuat dengan cinta untuk setiap bagian dari siklusmu ✨
        </Text>
      </ScrollView>

      <ResetPasswordSheet visible={resetSheetVisible} onClose={() => setResetSheetVisible(false)} />
    </KeyboardAvoidingView>
  );
}

function ResetPasswordSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSend = async () => {
    if (!email.trim()) return;
    setStatus('sending');
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    setStatus(error ? 'error' : 'sent');
  };

  const handleClose = () => {
    onClose();
    setStatus('idle');
    setEmail('');
  };

  return (
    <Sheet visible={visible} onClose={handleClose}>
      <Text variant="subtitle" style={styles.sheetTitle}>
        Reset kata sandi
      </Text>
      {status === 'sent' ? (
        <Text muted>Kalau email tersebut terdaftar, tautan reset kata sandi sudah kami kirim.</Text>
      ) : (
        <>
          <Text muted style={styles.sheetBody}>
            Masukkan email akunmu, kami kirimkan tautan untuk membuat kata sandi baru.
          </Text>
          <Input
            label="Email"
            placeholder="nama@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          {status === 'error' ? (
            <Text variant="caption" color={theme.colors.danger} style={styles.formError}>
              Gagal mengirim tautan. Coba lagi.
            </Text>
          ) : null}
          <Button
            label="Kirim tautan reset"
            onPress={handleSend}
            loading={status === 'sending'}
            style={styles.submitButton}
          />
        </>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 24, gap: 4 },
  mascot: { width: 88, height: 88, marginBottom: 8 },
  sessionBanner: { borderRadius: 12, padding: 12, marginBottom: 16 },
  card: { gap: 4 },
  field: { marginBottom: 16 },
  formError: { marginBottom: 8 },
  forgotPassword: { alignSelf: 'flex-end', minHeight: 44, justifyContent: 'center' },
  submitButton: { marginTop: 16 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  tagline: { textAlign: 'center', marginTop: 24, fontStyle: 'italic' },
  sheetTitle: { marginBottom: 8 },
  sheetBody: { marginBottom: 16 },
});
