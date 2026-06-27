import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { USGSFeature } from './types';

const expo = new Expo();

export function buildPushMessages(
  quake: USGSFeature,
  tokens: string[]
): ExpoPushMessage[] {
  const mag = quake.properties.mag?.toFixed(1) ?? 'N/A';
  const place = quake.properties.place || 'Unknown location';
  const title = `🚨 Earthquake Alert - M${mag}`;
  const body = `${place} - Tap for details`;

  return tokens
    .filter((t) => Expo.isExpoPushToken(t))
    .map((token) => ({
      to: token,
      sound: 'default' as const,
      title,
      body,
      data: {
        earthquakeId: quake.id,
        type: 'earthquake_alert',
      },
      priority: 'high' as const,
    }));
}

export async function sendNotifications(
  quakes: USGSFeature[],
  tokens: string[]
): Promise<void> {
  if (tokens.length === 0) return;

  for (const quake of quakes) {
    const messages = buildPushMessages(quake, tokens);
    if (messages.length === 0) continue;

    try {
      const chunks = expo.chunkPushNotifications(messages);
      for (const chunk of chunks) {
        await expo.sendPushNotificationsAsync(chunk);
      }
      console.log(
        `[NOTIFIER] Sent alert for ${quake.id} (M${quake.properties.mag?.toFixed(1)}) to ${messages.length} device(s)`
      );
    } catch (error) {
      console.error(`[NOTIFIER] Failed to send for ${quake.id}:`, error);
    }
  }
}
