import type { ThemeColors, BangladeshRegion } from '../types';

export const DHAKA_COORDS = {
  lat: 23.8103,
  lng: 90.4125,
};

export const BANGLADESH_REGION: BangladeshRegion = {
  latMin: 20.5,
  latMax: 27.0,
  lngMin: 87.5,
  lngMax: 93.0,
  borderBufferKm: 500,
};

export const USGS_API_URL =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';

export const POLL_INTERVAL = 5 * 60 * 1000;

export const ALERT_THRESHOLDS = {
  logMin: 3.0,
  normalMin: 4.0,
  highMin: 5.5,
  emergencyMin: 6.5,
} as const;

export const ALARM_THRESHOLDS = {
  magMin: 5.0,
  distanceMaxKm: 200,
} as const;

export const DEFAULT_SETTINGS = {
  magnitudeThreshold: 4.0,
  radiusKm: 500,
  notificationsEnabled: true,
  language: 'en' as const,
  darkMode: false,
  useSystemTheme: true,
};

export const STORAGE_KEYS = {
  SETTINGS: '@earthquake_settings',
  CACHED_EARTHQUAKES: '@cached_earthquakes',
  NOTIFIED_IDS: '@notified_ids',
  PUSH_TOKEN: '@push_token',
};

export const COLORS: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    background: '#f0f2f5',
    surface: '#ffffff',
    surfaceVariant: '#f8f9fa',
    text: '#1a1a2e',
    textSecondary: '#6b7280',
    primary: '#dc2626',
    primaryLight: '#fca5a5',
    border: '#e5e7eb',
    cardShadow: '#000',
    success: '#16a34a',
    successLight: '#bbf7d0',
    warning: '#ea580c',
    warningLight: '#fed7aa',
    danger: '#b91c1c',
    dangerLight: '#fecaca',
  },
  dark: {
    background: '#0f172a',
    surface: '#1e293b',
    surfaceVariant: '#334155',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    primary: '#ef4444',
    primaryLight: '#f87171',
    border: '#334155',
    cardShadow: '#000',
    success: '#22c55e',
    successLight: '#166534',
    warning: '#f97316',
    warningLight: '#9a3412',
    danger: '#ef4444',
    dangerLight: '#7f1d1d',
  },
};
