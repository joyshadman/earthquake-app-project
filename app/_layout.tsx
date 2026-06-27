import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSettings } from '../hooks/useSettings';
import { useNotifications } from '../hooks/useNotifications';
import { t } from '../lib/i18n';

const queryClient = new QueryClient();

function AppContent() {
  const { settings, theme, isDark } = useSettings();

  useNotifications();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.surface },
          headerTintColor: theme.text,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: t('latest_earthquakes', settings.language),
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="details/[id]"
          options={{
            title: t('details', settings.language),
          }}
        />
        <Stack.Screen
          name="map/index"
          options={{
            title: t('map_view', settings.language),
          }}
        />
        <Stack.Screen
          name="settings/index"
          options={{
            title: t('settings', settings.language),
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
