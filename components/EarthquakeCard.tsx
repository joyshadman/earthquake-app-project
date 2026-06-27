import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Earthquake, ThemeColors } from '../types';
import {
  formatMagnitude,
  formatDepth,
  formatTime,
  formatDistance,
  getMagnitudeColor,
  getAlertLevelColor,
  getAlertLevelBgColor,
  getAlertLevelLabel,
} from '../utils/formatters';
import { t } from '../lib/i18n';

interface Props {
  earthquake: Earthquake;
  colors: ThemeColors;
  lang: 'en' | 'bn';
  onPress: (id: string) => void;
}

export function EarthquakeCard({ earthquake, colors, lang, onPress }: Props) {
  const mag = earthquake.properties.mag;
  const magColor = getMagnitudeColor(mag);
  const level = earthquake.alertLevel ?? 'log';
  const alertColor = getAlertLevelColor(level, colors);
  const alertBg = getAlertLevelBgColor(level, colors);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => onPress(earthquake.id)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.magnitudeBadge, { backgroundColor: magColor }]}>
          <Text style={styles.magnitudeText}>
            {formatMagnitude(mag)}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.place, { color: colors.text }]} numberOfLines={2}>
            {earthquake.properties.place || 'Unknown'}
          </Text>
          <Text style={[styles.time, { color: colors.textSecondary }]}>
            {formatTime(earthquake.properties.time)}
          </Text>
        </View>
        <View style={[styles.alertBadge, { backgroundColor: alertBg }]}>
          <Text style={[styles.alertText, { color: alertColor }]}>
            {getAlertLevelLabel(level, lang)}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={[styles.footerItem, { color: colors.textSecondary }]}>
          {formatDepth(earthquake.geometry.coordinates[2])}
        </Text>
        <Text style={[styles.footerItem, { color: colors.textSecondary }]}>
          {formatDistance(earthquake.distanceFromDhaka)} {lang === 'bn' ? 'ঢাকা থেকে' : 'from Dhaka'}
        </Text>
      </View>
      <View style={[styles.sourceRow, { borderTopColor: colors.border }]}>
        <Text style={[styles.sourceText, { color: colors.textSecondary }]}>
          {t('data_source', lang)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  magnitudeBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  magnitudeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  place: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  time: {
    fontSize: 13,
  },
  alertBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  alertText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
  },
  footerItem: {
    fontSize: 13,
  },
  sourceRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 8,
    paddingTop: 6,
    alignItems: 'center',
  },
  sourceText: {
    fontSize: 11,
    opacity: 0.7,
  },
});
