import { View, StyleSheet } from 'react-native';
import { useEarthquakes } from '../../hooks/useEarthquakes';
import { useSettings } from '../../hooks/useSettings';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { DHAKA_COORDS } from '../../constants';
import { t } from '../../lib/i18n';
import { getMagnitudeColor } from '../../utils/formatters';

let MapView: any = null;
let Marker: any = null;
try {
  MapView = require('react-native-maps').default;
  Marker = require('react-native-maps').Marker;
} catch {}

export default function MapScreen() {
  const { data, isLoading, isError, refetch } = useEarthquakes();
  const { settings, theme } = useSettings();

  if (isLoading || !data) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <LoadingState color={theme.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ErrorState
          message={t('error', settings.language)}
          onRetry={() => refetch()}
          colors={theme}
        />
      </View>
    );
  }

  if (!MapView) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]} />
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: DHAKA_COORDS.lat,
          longitude: DHAKA_COORDS.lng,
          latitudeDelta: 8,
          longitudeDelta: 8,
        }}
      >
        {Marker && (
          <Marker
            coordinate={{
              latitude: DHAKA_COORDS.lat,
              longitude: DHAKA_COORDS.lng,
            }}
            title="Dhaka"
            description="Capital of Bangladesh"
            pinColor="#2563eb"
          />
        )}
        {data.map((quake) => {
          const [lng, lat] = quake.geometry.coordinates;
          const magColor = getMagnitudeColor(quake.properties.mag);
          return (
            <Marker
              key={quake.id}
              coordinate={{ latitude: lat, longitude: lng }}
              title={`M${quake.properties.mag?.toFixed(1) ?? 'N/A'}`}
              description={quake.properties.place}
              pinColor={magColor}
            />
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
