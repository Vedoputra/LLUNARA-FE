import { Tabs } from 'expo-router';

import { TabBar } from '@/components/navigation/TabBar';

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Beranda' }} />
      <Tabs.Screen name="calendar" options={{ title: 'Kalender' }} />
      <Tabs.Screen name="insights" options={{ title: 'Statistik' }} />
      <Tabs.Screen name="garden" options={{ title: 'Taman' }} />
      <Tabs.Screen name="settings" options={{ title: 'Pengaturan' }} />
    </Tabs>
  );
}
