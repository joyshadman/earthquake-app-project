import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, Earthquake } from '../types';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../constants';

export async function getSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export async function getCachedEarthquakes(): Promise<Earthquake[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_EARTHQUAKES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export async function cacheEarthquakes(data: Earthquake[]): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEYS.CACHED_EARTHQUAKES,
    JSON.stringify(data)
  );
}

export async function getNotifiedIds(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFIED_IDS);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

export async function addNotifiedId(id: string): Promise<void> {
  const ids = await getNotifiedIds();
  ids.add(id);
  await AsyncStorage.setItem(
    STORAGE_KEYS.NOTIFIED_IDS,
    JSON.stringify([...ids])
  );
}

export async function getPushToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.PUSH_TOKEN);
  } catch {
    return null;
  }
}

export async function savePushToken(token: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.PUSH_TOKEN, token);
}
