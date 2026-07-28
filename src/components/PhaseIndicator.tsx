import { Image, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import type { CyclePhase } from '@/types/api';

export const PHASE_LABELS: Record<CyclePhase, string> = {
  menstrual: 'Fase menstruasi',
  follicular: 'Fase folikular',
  ovulation: 'Fase ovulasi',
  luteal: 'Fase luteal',
};

export const PHASE_ICONS: Record<CyclePhase, number> = {
  menstrual: require('../../assets/phases/menstrual.png'),
  follicular: require('../../assets/phases/follicular.png'),
  ovulation: require('../../assets/phases/ovulation.png'),
  luteal: require('../../assets/phases/luteal.png'),
};

export interface PhaseIndicatorProps {
  phase: CyclePhase;
}

export function PhaseIndicator({ phase }: PhaseIndicatorProps) {
  const theme = useTheme();

  return (
    <View style={[styles.pill, { backgroundColor: theme.colors.cycle[phase] }]}>
      <Image source={PHASE_ICONS[phase]} style={styles.icon} />
      <Text variant="caption">{PHASE_LABELS[phase]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  icon: {
    width: 14,
    height: 14,
  },
});
