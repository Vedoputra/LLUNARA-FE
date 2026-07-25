import { useCallback, useEffect, useState } from 'react';

import {
  getPermissionStatus,
  openSystemSettings,
  requestPermission,
} from '@/services/notifications';

export function useNotificationPermission() {
  const [status, setStatus] = useState<'undetermined' | 'granted' | 'denied' | null>(null);

  const refresh = useCallback(async () => {
    const result = await getPermissionStatus();
    setStatus(result.status);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const request = useCallback(async () => {
    const granted = await requestPermission();
    await refresh();
    return granted;
  }, [refresh]);

  return {
    status,
    isGranted: status === 'granted',
    isDenied: status === 'denied',
    request,
    openSettings: openSystemSettings,
    refresh,
  };
}
