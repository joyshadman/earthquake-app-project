import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Vibration } from 'react-native';
import { savePushToken } from './storage';
import { Earthquake, AlertLevel } from '../types';
import { ALERT_THRESHOLDS, ALARM_THRESHOLDS } from '../constants';
import { playAlarmSound, stopAlarmSound } from '../utils/alarmSound';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function ensureAndroidChannels() {
  if (Platform.OS !== 'android') return;
  Notifications.setNotificationChannelAsync('default', {
    name: 'Earthquake Alerts',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#dc2626',
  });
  Notifications.setNotificationChannelAsync('emergency', {
    name: 'Emergency Alerts',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 500, 200, 500, 200, 500],
    lightColor: '#b91c1c',
  });
  Notifications.setNotificationChannelAsync('alarm', {
    name: 'Earthquake Alarm',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 1000, 500, 1000, 500, 1000],
    lightColor: '#991b1b',
  });
}

export async function registerForPushNotifications(): Promise<string | null> {
  ensureAndroidChannels();

  if (!Device.isDevice) {
    return null;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  await savePushToken(tokenData.data);
  return tokenData.data;
}

function getNotificationContent(
  quake: Earthquake,
  level: AlertLevel
): Notifications.NotificationContentInput {
  const mag = quake.properties.mag?.toFixed(1) ?? 'N/A';
  const place = quake.properties.place ?? 'Unknown location';

  if (level === 'emergency') {
    return {
      title: `🚨 EMERGENCY - M${mag}`,
      body: `Strong earthquake near Bangladesh! ${place}`,
      data: { earthquakeId: quake.id, level: 'emergency' },
      sound: true,
      priority: 'max' as any,
    };
  }

  if (level === 'high') {
    return {
      title: `⚠️ Strong Quake - M${mag}`,
      body: place,
      data: { earthquakeId: quake.id, level: 'high' },
      sound: true,
      priority: 'high' as any,
    };
  }

  return {
    title: `Earthquake Alert - M${mag}`,
    body: place,
    data: { earthquakeId: quake.id, level: 'normal' },
    sound: true,
  };
}

export async function sendLocalNotification(quake: Earthquake): Promise<void> {
  const level = quake.alertLevel ?? 'normal';
  if (level === 'log') return;

  const content = getNotificationContent(quake, level);
  const channelId = level === 'emergency' ? 'emergency' : 'default';

  await Notifications.scheduleNotificationAsync({
    content: { ...content, ...(Platform.OS === 'android' ? { channelId } : {}) },
    trigger: null,
  });
}

export async function sendAlarmNotification(quake: Earthquake): Promise<void> {
  const mag = quake.properties.mag?.toFixed(1) ?? 'N/A';
  const place = quake.properties.place ?? 'Unknown location';

  ensureAndroidChannels();

  Vibration.vibrate([0, 1000, 500, 1000, 500, 1000, 500, 1000], true);

  await playAlarmSound();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `🔔 ALARM - M${mag} Earthquake!`,
      body: `Strong quake near Bangladesh! ${place}`,
      data: { earthquakeId: quake.id, level: 'alarm' },
      ...(Platform.OS === 'android' ? { channelId: 'alarm' } : { sound: true }),
    },
    trigger: null,
  });

  setTimeout(() => {
    stopAlarmSound();
    Vibration.cancel();
  }, 15000);
}

export function needsAlarm(quake: Earthquake): boolean {
  const mag = quake.properties.mag ?? 0;
  const distance = quake.distanceFromDhaka ?? 9999;
  return mag >= ALARM_THRESHOLDS.magMin && distance <= ALARM_THRESHOLDS.distanceMaxKm;
}

export async function sendTestNotification(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Bangladesh Earthquake Alert',
      body: 'This is a test notification from your earthquake monitoring app.',
      data: { test: true },
      sound: true,
    },
    trigger: null,
  });
}

export async function sendTestAlarm(): Promise<void> {
  ensureAndroidChannels();

  Vibration.vibrate([0, 1000, 500, 1000, 500, 1000, 500, 1000], true);

  await playAlarmSound();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔔 TEST ALARM',
      body: 'This is a test alarm from your earthquake monitoring app.',
      data: { test: true, alarm: true },
      ...(Platform.OS === 'android' ? { channelId: 'alarm' } : { sound: true }),
    },
    trigger: null,
  });

  setTimeout(() => {
    stopAlarmSound();
    Vibration.cancel();
  }, 10000);
}
