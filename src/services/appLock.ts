import * as LocalAuthentication from 'expo-local-authentication';

export async function isAppLockAvailable(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return false;
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return isEnrolled;
}

export async function authenticate(): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Buka kunci LLunara',
    cancelLabel: 'Batal',
    disableDeviceFallback: false,
  });
  return result.success;
}
