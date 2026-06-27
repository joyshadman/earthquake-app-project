import { View, Text, StyleSheet } from 'react-native';
import { ThemeColors, Earthquake } from '../types';
import { getAlertLevelColor } from '../utils/formatters';

interface Props {
  colors: ThemeColors;
  latestQuake: Earthquake | null;
  totalCount: number;
  lang: 'en' | 'bn';
}

export function StatusCard({ colors, latestQuake, totalCount, lang }: Props) {
  const highestLevel = latestQuake?.alertLevel ?? 'log';
  const statusColor = getAlertLevelColor(highestLevel, colors);

  const statusLabel = (() => {
    switch (highestLevel) {
      case 'emergency':
        return lang === 'bn' ? 'জরুরি অবস্থা' : 'Emergency';
      case 'high':
        return lang === 'bn' ? 'উচ্চ সতর্কতা' : 'High Alert';
      case 'normal':
        return lang === 'bn' ? 'সক্রিয়' : 'Active';
      default:
        return lang === 'bn' ? 'নিরাপদ' : 'Safe';
    }
  })();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.indicator, { backgroundColor: statusColor }]} />
      <View style={styles.content}>
        <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>
          {lang === 'bn' ? 'বর্তমান অবস্থা' : 'Current Status'}
        </Text>
        <Text style={[styles.statusValue, { color: statusColor }]}>
          {statusLabel}
        </Text>
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {totalCount} {lang === 'bn' ? 'টি ভূমিকম্প নজরদারিতে' : 'earthquakes monitored'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  indicator: {
    width: 6,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statusValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  count: {
    fontSize: 13,
  },
});
