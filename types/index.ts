export interface USGSFeature {
  id: string;
  properties: {
    mag: number | null;
    place: string;
    time: number;
    updated: number;
    url: string;
    detail: string;
    felt: number | null;
    cdi: number | null;
    mmi: number | null;
    alert: string | null;
    status: string;
    tsunami: number;
    sig: number;
    net: string;
    code: string;
    ids: string;
    sources: string;
    types: string;
    nst: number | null;
    dmin: number | null;
    rms: number | null;
    gap: number | null;
    magType: string;
    type: string;
    title: string;
  };
  geometry: {
    type: string;
    coordinates: [number, number, number];
  };
}

export interface USGSResponse {
  type: string;
  metadata: {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count: number;
  };
  features: USGSFeature[];
}

export type AlertLevel = 'log' | 'normal' | 'high' | 'emergency';

export interface Earthquake extends USGSFeature {
  distanceFromDhaka?: number;
  alertLevel?: AlertLevel;
}

export interface AppSettings {
  magnitudeThreshold: number;
  radiusKm: number;
  notificationsEnabled: boolean;
  language: 'en' | 'bn';
  darkMode: boolean;
  useSystemTheme: boolean;
}

export type Language = 'en' | 'bn';

export interface BangladeshRegion {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
  borderBufferKm: number;
}

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceVariant: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryLight: string;
  border: string;
  cardShadow: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  dangerLight: string;
}
