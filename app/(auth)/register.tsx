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

import { Button, Card, Input, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';

const registerSchema = z
  .object({
    email: z.email('Format email tidak valid'),
    password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
    confirmPassword: z.string().min(1, 'Konfirmasi kata sandi wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak cocok',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const theme = useTheme();
  const signUp = useAuthStore((state) => state.signUp);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: RegisterForm) => {
    setFormError(null);
    setConfirmationMessage(null);
    const { error, needsEmailConfirmation } = await signUp(values.email.trim(), values.password);
    if (error) {
      setFormError(error);
      return;
    }
    if (needsEmailConfirmation) {
      setConfirmationMessage('Cek emailmu untuk verifikasi akun, lalu masuk kembali.');
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
          <Text color={theme.colors.primary}>Ayo mulai perjalananmu</Text>
        </View>

        <Card style={styles.card}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="contoh@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                style={styles.field}
                leftElement={<Feather name="mail" size={18} color={theme.colors.textMuted} />}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Kata sandi"
                placeholder="Minimal 8 karakter"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                helperText={errors.password ? undefined : 'Minimal 8 karakter'}
                style={styles.field}
                leftElement={<Feather name="lock" size={18} color={theme.colors.textMuted} />}
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

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Ulangi kata sandi"
                placeholder="Ulangi kata sandi"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
                style={styles.field}
                leftElement={<Feather name="shield" size={18} color={theme.colors.textMuted} />}
                rightElement={
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      showConfirmPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
                    }
                    onPress={() => setShowConfirmPassword((prev) => !prev)}
                    hitSlop={8}
                  >
                    <Feather
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
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

          {confirmationMessage ? (
            <Text variant="caption" color={theme.colors.success} style={styles.formError}>
              {confirmationMessage}
            </Text>
          ) : null}

          <Button
            label="Daftar"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            style={styles.submitButton}
          />

          <View style={styles.footerRow}>
            <Text muted>Sudah punya akun? </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable accessibilityRole="button" accessibilityLabel="Masuk">
                <Text color={theme.colors.primary}>Masuk</Text>
              </Pressable>
            </Link>
          </View>
        </Card>

        <View style={styles.footerNote}>
          <View style={[styles.heartBadge, { backgroundColor: theme.colors.primarySoft }]}>
            <Feather name="heart" size={16} color={theme.colors.primary} />
          </View>
          <Text variant="caption" muted style={styles.tagline}>
            Luna akan menemanimu di setiap fase siklusmu dengan penuh cinta.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 24, gap: 4 },
  mascot: { width: 88, height: 88, marginBottom: 8 },
  card: { gap: 4 },
  field: { marginBottom: 16 },
  formError: { marginBottom: 8 },
  submitButton: { marginTop: 8 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerNote: { alignItems: 'center', marginTop: 24, gap: 8 },
  heartBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: { textAlign: 'center', fontStyle: 'italic', paddingHorizontal: 24 },
});
