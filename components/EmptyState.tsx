import { View, Text, StyleSheet } from 'react-native';

interface Props {
  message?: string;
  description?: string;
  colors: {
    text: string;
    textSecondary: string;
  };
}

export function EmptyState({
  message = 'No data available',
  description,
  colors,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🌍</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>
      {description && (
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
