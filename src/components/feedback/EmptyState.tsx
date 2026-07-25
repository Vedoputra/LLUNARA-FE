import { Image, StyleSheet, View } from 'react-native';

import { Button, Text } from '@/components/ui';

export interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
}

export function EmptyState({ title, message, actionLabel, onAction, actionIcon }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/mascot/luna-sitting.png')}
        style={styles.mascot}
        resizeMode="contain"
      />
      <Text variant="title" style={styles.title}>
        {title}
      </Text>
      {message ? (
        <Text muted style={styles.message}>
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          label={actionLabel}
          variant="secondary"
          onPress={onAction}
          icon={actionIcon}
          style={styles.actionButton}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  mascot: {
    width: 160,
    height: 160,
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
  actionButton: {
    marginTop: 12,
    alignSelf: 'stretch',
  },
});
