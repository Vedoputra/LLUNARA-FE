import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { apiClient } from '@/api/client';
import { ApiError, type ApiErrorBody } from '@/types/api';

export type ExportFormat = 'csv' | 'pdf';

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ApiErrorBody;
    return body?.error?.message ?? 'Gagal membuat laporan. Coba lagi.';
  } catch {
    return 'Gagal membuat laporan. Coba lagi.';
  }
}

export async function exportAndShare(
  format: ExportFormat,
  from: string,
  to: string,
): Promise<void> {
  const response = await apiClient.raw(`/api/v1/export?format=${format}&from=${from}&to=${to}`, {
    method: 'POST',
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new ApiError('INTERNAL_ERROR', message, response.status);
  }

  const buffer = await response.arrayBuffer();
  const extension = format === 'csv' ? 'csv' : 'pdf';
  const mimeType = format === 'csv' ? 'text/csv' : 'application/pdf';
  const fileName = `llunara-export-${from}_${to}.${extension}`;

  const file = new File(Paths.cache, fileName);
  file.create({ overwrite: true });
  file.write(new Uint8Array(buffer));

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new ApiError('INTERNAL_ERROR', 'Berbagi file tidak didukung di perangkat ini.', 0);
  }

  await Sharing.shareAsync(file.uri, { mimeType, dialogTitle: 'Ekspor data LLunara' });
}
