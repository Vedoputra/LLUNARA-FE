import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

import { apiClient, setUnauthorizedHandler } from '@/api/client';
import { queryClient } from '@/api/queryClient';
import { supabase } from '@/api/supabase';
import { ApiError, type MeResponse } from '@/types/api';

interface AuthResult {
  error: string | null;
}

interface SignUpResult extends AuthResult {
  needsEmailConfirmation: boolean;
}

type SignOutReason = 'manual' | 'expired';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  sessionMessage: string | null;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  signOut: (reason?: SignOutReason) => Promise<void>;
  clearSessionMessage: () => void;
}

function mapSignUpError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('already registered') || lower.includes('already exists')) {
    return 'Email ini sudah terdaftar. Silakan masuk.';
  }
  if (lower.includes('rate limit')) {
    return 'Terlalu banyak percobaan pendaftaran. Coba lagi dalam beberapa menit.';
  }
  if (lower.includes('password')) {
    return 'Kata sandi tidak memenuhi syarat minimal 8 karakter.';
  }
  if (lower.includes('email') && (lower.includes('invalid') || lower.includes('format'))) {
    return 'Format email tidak valid.';
  }
  return 'Registrasi gagal. Silakan coba lagi.';
}

export const useAuthStore = create<AuthState>((set, get) => {
  supabase.auth.onAuthStateChange((_event, session) => {
    set({ session, user: session?.user ?? null });
  });

  setUnauthorizedHandler(() => {
    get().signOut('expired');
  });

  return {
    session: null,
    user: null,
    isLoading: false,
    isInitialized: false,
    sessionMessage: null,

    async initialize() {
      const { data } = await supabase.auth.getSession();
      set({ session: data.session, user: data.session?.user ?? null });

      if (data.session) {
        try {
          await apiClient.get<MeResponse>('/api/v1/me');
        } catch (err) {
          // Only a confirmed 401 means the session is actually invalid — a cold-start
          // timeout or network hiccup here must not sign the user out.
          if (err instanceof ApiError && err.code === 'UNAUTHORIZED') {
            await get().signOut('expired');
          }
        }
      }

      set({ isInitialized: true });
    },

    async signIn(email, password) {
      set({ isLoading: true });
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data.session) {
          return { error: 'Email atau kata sandi salah.' };
        }
        set({ session: data.session, user: data.session.user });
        return { error: null };
      } catch {
        return { error: 'Tidak dapat terhubung ke server. Periksa koneksimu.' };
      } finally {
        set({ isLoading: false });
      }
    },

    async signUp(email, password) {
      set({ isLoading: true });
      try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          return { error: mapSignUpError(error.message), needsEmailConfirmation: false };
        }
        if (data.session) {
          set({ session: data.session, user: data.session.user });
          return { error: null, needsEmailConfirmation: false };
        }
        return { error: null, needsEmailConfirmation: true };
      } catch {
        return {
          error: 'Tidak dapat terhubung ke server. Periksa koneksimu.',
          needsEmailConfirmation: false,
        };
      } finally {
        set({ isLoading: false });
      }
    },

    async signOut(reason = 'manual') {
      try {
        await supabase.auth.signOut();
      } catch {
        // Local state is cleared below regardless — e.g. the account may have
        // just been hard-deleted server-side, or the device may be offline.
      }
      queryClient.clear();
      set({
        session: null,
        user: null,
        sessionMessage: reason === 'expired' ? 'Sesi berakhir, silakan masuk kembali.' : null,
      });
    },

    clearSessionMessage() {
      set({ sessionMessage: null });
    },
  };
});
