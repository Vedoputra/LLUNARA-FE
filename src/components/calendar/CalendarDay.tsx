import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { hexToRgba } from '@/utils/color';

export interface DayMarking {
  isMenstrual?: boolean;
  isPredicted?: boolean;
  isFertile?: boolean;
  hasSymptom?: boolean;
}

export interface CalendarDayProps {
  date?: { dateString: string; day: number };
  state?: 'selected' | 'disabled' | 'inactive' | 'today' | '';
  marking?: DayMarking;
  onPress?: (date: { dateString: string; day: number }) => void;
}

export function CalendarDay({ date, state, marking, onPress }: CalendarDayProps) {
  const theme = useTheme();

  if (!date) {
    return <View style={styles.cell} />;
  }

  const isOutsideMonth = state === 'disabled' || state === 'inactive';
  const isToday = state === 'today';

  const backgroundColor = marking?.isMenstrual
    ? theme.colors.cycle.menstrual
    : marking?.isFertile
      ? hexToRgba(theme.colors.cycle.ovulation, 0.25)
      : 'transparent';

  const borderColor = marking?.isPredicted
    ? theme.colors.cycle.predicted
    : isToday
      ? theme.colors.primary
      : 'transparent';

  const borderStyle = marking?.isPredicted ? 'dashed' : 'solid';
  const textColor = marking?.isMenstrual
    ? theme.colors.onPrimary
    : isOutsideMonth
      ? theme.colors.textMuted
      : theme.colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Tanggal ${date.day}`}
      onPress={() => onPress?.(date)}
      style={styles.cell}
    >
      <View
        style={[
          styles.circle,
          {
            backgroundColor,
            borderColor,
            borderStyle,
            borderWidth: borderColor !== 'transparent' ? 1.5 : 0,
          },
        ]}
      >
        <Text variant="body" color={textColor}>
          {date.day}
        </Text>
      </View>
      {marking?.hasSymptom ? (
        <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
      ) : (
        <View style={styles.dot} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 44,
    height: 52,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 2,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
