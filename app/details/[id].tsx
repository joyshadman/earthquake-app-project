import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEarthquakes } from '../../hooks/useEarthquakes';
import { useSettings } from '../../hooks/useSettings';
import { LoadingState } from '../../components/LoadingState';
import { t } from '../../lib/i18n';
import {
  formatMagnitude,
  formatDepth,
  formatTime,
  formatTimeBangla,
  formatDistance,
  getMagnitudeColor,
  getTsunamiLabel,
  getAlertLabel,
  getAlertLevelLabel,
  getAlertLevelColor,
  getAlertLevelBgColor,
} from '../../utils/formatters';

let MapViewComponent: any = null;
try {
  MapViewComponent = require('react-native-maps').default;
} catch {}

let MarkerComponent: any = null;
try {
  MarkerComponent = require('react-native-maps').Marker;
} catch {}

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useEarthquakes();
  const { settings, theme } = useSettings();
  const lang = settings.language;

  if (isLoading || !data) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <LoadingState color={theme.primary} />
      </View>
    );
  }

  const quake = data.find((e) => e.id === id);
  if (!quake) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Earthquake not found</Text>
      </View>
    );
  }

  const props = quake.properties;
  const [lng, lat, depth] = quake.geometry.coordinates;
  const magColor = getMagnitudeColor(props.mag);
  const level = quake.alertLevel ?? 'log';
  const alertColor = getAlertLevelColor(level, theme);
  const alertBg = getAlertLevelBgColor(level, theme);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.magSection, { backgroundColor: magColor }]}>
        <Text style={styles.magValue}>{formatMagnitude(props.mag)}</Text>
        <Text style={styles.magLabel}>{t('magnitude', lang)}</Text>
        <View style={[styles.alertPill, { backgroundColor: alertBg }]}>
          <Text style={[styles.alertPillText, { color: alertColor }]}>
            {getAlertLevelLabel(level, lang)}
          </Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <InfoRow label={t('location', lang)} value={props.place} theme={theme} />
        <InfoRow label={t('depth', lang)} value={formatDepth(depth)} theme={theme} />
        <InfoRow
          label={t('time', lang)}
          value={lang === 'bn' ? formatTimeBangla(props.time) : formatTime(props.time)}
          theme={theme}
        />
        <InfoRow
          label={t('distance_from_dhaka', lang)}
          value={formatDistance(quake.distanceFromDhaka)}
          theme={theme}
        />
        <InfoRow
          label={t('latitude', lang)}
          value={lat.toFixed(4)}
          theme={theme}
        />
        <InfoRow
          label={t('longitude', lang)}
          value={lng.toFixed(4)}
          theme={theme}
        />
        <InfoRow label={t('status', lang)} value={props.status} theme={theme} />
        <InfoRow
          label={t('tsunami', lang)}
          value={getTsunamiLabel(props.tsunami)}
          theme={theme}
        />
        {props.alert && (
          <InfoRow
            label="USGS Alert"
            value={getAlertLabel(props.alert)}
            theme={theme}
          />
        )}
        <InfoRow
          label={t('event_id', lang)}
          value={quake.id.slice(0, 12)}
          theme={theme}
        />
      </View>

      {MapViewComponent && (
        <View style={[styles.mapContainer, { borderColor: theme.border }]}>
          <MapViewComponent
            style={styles.map}
            initialRegion={{
              latitude: lat,
              longitude: lng,
              latitudeDelta: Math.max(2, Math.abs(lat) * 0.1),
              longitudeDelta: Math.max(2, Math.abs(lng) * 0.1),
            }}
          >
            {MarkerComponent && (
              <MarkerComponent
                coordinate={{ latitude: lat, longitude: lng }}
                title={`M${formatMagnitude(props.mag)}`}
                description={props.place}
                pinColor={magColor}
              />
            )}
          </MapViewComponent>
        </View>
      )}

      <Text style={[styles.about, { color: theme.textSecondary }]}>
        {t('data_source', lang)} • {t('about', lang)}
      </Text>
    </ScrollView>
  );
}

function InfoRow({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: any;
}) {
  return (
    <View style={infoStyles.row}>
      <Text style={[infoStyles.label, { color: theme.textSecondary }]}>
        {label}
      </Text>
      <Text style={[infoStyles.value, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 32 },
  magSection: {
    alignItems: 'center',
    paddingVertical: 32,
    marginHorizontal: -1,
  },
  magValue: {
    fontSize: 56,
    fontWeight: '800',
    color: '#fff',
  },
  magLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  alertPill: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  alertPillText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  mapContainer: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    height: 280,
  },
  map: {
    flex: 1,
  },
  about: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
