import { View, FlatList, StyleSheet, TouchableOpacity, Text, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useEarthquakes } from '../hooks/useEarthquakes';
import { useSettings } from '../hooks/useSettings';
import { EarthquakeCard } from '../components/EarthquakeCard';
import { StatusCard } from '../components/StatusCard';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { t } from '../lib/i18n';
import { Earthquake } from '../types';
import { formatMagnitude, getMagnitudeColor } from '../utils/formatters';

export default function HomeScreen() {
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useEarthquakes();
  const { settings, theme, isDark } = useSettings();
  const lang = settings.language;

  if (isLoading && !data) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            {t('app_name', lang)}
          </Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: theme.background }]}
              onPress={() => router.push('/map')}
            >
              <Ionicons name="map-outline" size={22} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: theme.background }]}
              onPress={() => router.push('/settings')}
            >
              <Ionicons name="settings-outline" size={22} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>
        <SkeletonLoader colors={theme} />
      </SafeAreaView>
    );
  }

  if (isError && !data) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ErrorState
          message={error?.message ?? t('error', lang)}
          onRetry={() => refetch()}
          colors={theme}
        />
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: Earthquake }) => (
    <EarthquakeCard
      earthquake={item}
      colors={theme}
      lang={lang}
      onPress={(id) => router.push(`/details/${id}`)}
    />
  );

  const latestQuake = data?.[0] ?? null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          {t('app_name', lang)}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.background }]}
            onPress={() => router.push('/map')}
          >
            <Ionicons name="map-outline" size={22} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.background }]}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={theme.primary}
          />
        }
        contentContainerStyle={data?.length === 0 ? styles.emptyList : styles.list}
        ListHeaderComponent={
          <>
            <StatusCard
              colors={theme}
              latestQuake={latestQuake}
              totalCount={data?.length ?? 0}
              lang={lang}
            />
            {latestQuake && (
              <TouchableOpacity
                style={[styles.heroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => router.push(`/details/${latestQuake.id}`)}
                activeOpacity={0.7}
              >
                <Text style={[styles.heroLabel, { color: theme.textSecondary }]}>
                  {t('latest_quake', lang)}
                </Text>
                <View style={styles.heroRow}>
                  <View
                    style={[
                      styles.heroBadge,
                      { backgroundColor: getMagnitudeColor(latestQuake.properties.mag) },
                    ]}
                  >
                    <Text style={styles.heroBadgeText}>
                      M{formatMagnitude(latestQuake.properties.mag)}
                    </Text>
                  </View>
                  <View style={styles.heroInfo}>
                    <Text style={[styles.heroPlace, { color: theme.text }]} numberOfLines={1}>
                      {latestQuake.properties.place}
                    </Text>
                    <Text style={[styles.heroMeta, { color: theme.textSecondary }]}>
                      {latestQuake.properties.time
                        ? new Date(latestQuake.properties.time).toLocaleString()
                        : ''}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                </View>
                <Text style={[styles.heroSource, { color: theme.textSecondary }]}>
                  {t('data_source', lang)}
                </Text>
              </TouchableOpacity>
            )}
          </>
        }
        ListEmptyComponent={
          <EmptyState
            message={t('no_recent', lang)}
            description={t('no_recent_desc', lang)}
            colors={theme}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  heroBadgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  heroInfo: {
    flex: 1,
  },
  heroPlace: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  heroMeta: {
    fontSize: 13,
  },
  heroSource: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.7,
  },
  list: {
    paddingBottom: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
});
