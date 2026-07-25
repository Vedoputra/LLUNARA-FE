import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
}

function toStatus(state: NetInfoState): NetworkStatus {
  return {
    isConnected: state.isConnected ?? false,
    isInternetReachable: state.isInternetReachable,
  };
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
  });

  useEffect(() => {
    NetInfo.fetch().then((state) => setStatus(toStatus(state)));
    const unsubscribe = NetInfo.addEventListener((state) => setStatus(toStatus(state)));
    return unsubscribe;
  }, []);

  return status;
}

export function isOffline(status: NetworkStatus): boolean {
  return !status.isConnected || status.isInternetReachable === false;
}
