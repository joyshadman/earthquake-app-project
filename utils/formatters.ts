import { AlertLevel, ThemeColors } from '../types';
import { ALERT_THRESHOLDS } from '../constants';

export function formatMagnitude(mag: number | null): string {
  if (mag === null || mag === undefined) return 'N/A';
  return mag.toFixed(1);
}

export function formatDepth(depth: number | null | undefined): string {
  if (depth === null || depth === undefined) return 'N/A';
  return `${depth.toFixed(1)} km`;
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

export function formatTimeBangla(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'এইমাত্র';
  if (diffMins < 60) return `${diffMins} মি. আগে`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} দিন আগে`;

  return date.toLocaleDateString('bn-BD');
}

export function formatDistance(km: number | undefined): string {
  if (km === undefined) return 'N/A';
  return `${km.toFixed(0)} km`;
}

export function getAlertLevel(mag: number | null, isNear: boolean): AlertLevel {
  if (mag === null) return 'log';
  if (mag >= ALERT_THRESHOLDS.emergencyMin && isNear) return 'emergency';
  if (mag >= ALERT_THRESHOLDS.highMin) return 'high';
  if (mag >= ALERT_THRESHOLDS.normalMin) return 'normal';
  return 'log';
}

export function getAlertLevelLabel(level: AlertLevel, lang: 'en' | 'bn'): string {
  const labels: Record<AlertLevel, Record<'en' | 'bn', string>> = {
    log: { en: 'Info', bn: 'তথ্য' },
    normal: { en: 'Alert', bn: 'সতর্কতা' },
    high: { en: 'High Alert', bn: 'উচ্চ সতর্কতা' },
    emergency: { en: 'Emergency', bn: 'জরুরি অবস্থা' },
  };
  return labels[level][lang];
}

export function getAlertLevelColor(level: AlertLevel, colors: ThemeColors): string {
  switch (level) {
    case 'emergency':
      return colors.danger;
    case 'high':
      return colors.warning;
    case 'normal':
      return colors.primary;
    case 'log':
      return colors.success;
  }
}

export function getAlertLevelBgColor(level: AlertLevel, colors: ThemeColors): string {
  switch (level) {
    case 'emergency':
      return colors.dangerLight;
    case 'high':
      return colors.warningLight;
    case 'normal':
      return colors.primaryLight;
    case 'log':
      return colors.successLight;
  }
}

export function getMagnitudeColor(mag: number | null): string {
  if (mag === null) return '#6c757d';
  if (mag >= 7) return '#b91c1c';
  if (mag >= 5.5) return '#ea580c';
  if (mag >= 4.5) return '#dc2626';
  if (mag >= 3) return '#16a34a';
  return '#6b7280';
}

export function getTsunamiLabel(tsunami: number): string {
  if (tsunami === 1) return 'Tsunami Warning';
  if (tsunami === 2) return 'Tsunami Watch';
  return 'No Tsunami Risk';
}

export function getAlertLabel(alert: string | null): string {
  if (!alert) return 'None';
  const labels: Record<string, string> = {
    green: 'Green',
    yellow: 'Yellow',
    orange: 'Orange',
    red: 'Red',
  };
  return labels[alert] ?? alert;
}
