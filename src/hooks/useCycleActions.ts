import { Alert } from 'react-native';

import { formatLongDate } from '@/utils/date';

import { cycleOverlapMessage, useEndCycle, useStartCycle } from './useCycles';

export function useCycleActions() {
  const startCycle = useStartCycle();
  const endCycle = useEndCycle();

  const confirmStart = (date: string, onDone?: () => void) => {
    Alert.alert(
      'Tandai awal menstruasi',
      `Catat ${formatLongDate(date)} sebagai hari pertama menstruasi? Ini akan memperbarui prediksi siklusmu.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, catat',
          onPress: () => {
            startCycle.mutate(date, {
              onSuccess: onDone,
              onError: (error) => {
                Alert.alert(
                  'Gagal menyimpan',
                  cycleOverlapMessage(error) ?? 'Terjadi kesalahan. Coba lagi.',
                );
              },
            });
          },
        },
      ],
    );
  };

  const confirmEnd = (cycleId: string, date: string, onDone?: () => void) => {
    Alert.alert(
      'Tandai akhir menstruasi',
      `Catat ${formatLongDate(date)} sebagai hari terakhir menstruasi?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, catat',
          onPress: () => {
            endCycle.mutate(
              { cycleId, endDate: date },
              {
                onSuccess: onDone,
                onError: () => Alert.alert('Gagal menyimpan', 'Terjadi kesalahan. Coba lagi.'),
              },
            );
          },
        },
      ],
    );
  };

  return {
    confirmStart,
    confirmEnd,
    isStarting: startCycle.isPending,
    isEnding: endCycle.isPending,
  };
}
