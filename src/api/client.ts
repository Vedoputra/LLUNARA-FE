import { env } from '@/constants/env';
import { ApiError, type ApiErrorBody } from '@/types/api';

import { supabase } from './supabase';

const TIMEOUT_MS = 60_000;
const MAX_RETRIES = 2;

type JsonBody = object;

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseJsonError(response: Response): Promise<ApiErrorBody['error']> {
  try {
    const body = (await response.json()) as ApiErrorBody;
    if (body?.error?.code) {
      return body.error;
    }
  } catch {
    // response had no JSON body — fall through to generic error below
  }
  return { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan tak terduga di server.' };
}

async function requestRaw(path: string, init: RequestInit = {}, attempt = 0): Promise<Response> {
  const method = (init.method ?? 'GET').toUpperCase();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${env.apiUrl}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { ...authHeader, ...init.headers },
    });

    if (response.status === 401) {
      if (attempt === 0) {
        const { data, error } = await supabase.auth.refreshSession();
        if (!error && data.session) {
          return requestRaw(path, init, attempt + 1);
        }
      }
      unauthorizedHandler?.();
    }

    return response;
  } catch (err) {
    const isAbort = err instanceof Error && err.name === 'AbortError';
    const isNetworkError = isAbort || err instanceof TypeError;

    if (isNetworkError && method === 'GET' && attempt < MAX_RETRIES) {
      await sleep(2 ** attempt * 500);
      return requestRaw(path, init, attempt + 1);
    }

    if (isAbort) {
      throw new ApiError(
        'TIMEOUT',
        'Waktu permintaan habis. Server mungkin sedang aktif kembali dari kondisi idle.',
        0,
      );
    }
    throw new ApiError('NETWORK_ERROR', 'Tidak dapat terhubung ke server.', 0);
  } finally {
    clearTimeout(timeout);
  }
}

async function requestJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await requestRaw(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });

  if (response.status === 401) {
    throw new ApiError('UNAUTHORIZED', 'Sesi berakhir, silakan masuk kembali.', 401);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  if (!response.ok) {
    const error = await parseJsonError(response);
    throw new ApiError(error.code, error.message, response.status, error.details);
  }
  return (await response.json()) as T;
}

export const apiClient = {
  get: <T>(path: string) => requestJson<T>(path),
  post: <T>(path: string, body?: JsonBody) =>
    requestJson<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: JsonBody) =>
    requestJson<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: JsonBody) =>
    requestJson<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => requestJson<T>(path, { method: 'DELETE' }),
  raw: (path: string, init?: RequestInit) => requestRaw(path, init),
};
