import { useEffect, useRef } from 'react';
import {
  registerForPushNotifications,
  sendLocalNotification,
  sendAlarmNotification,
  needsAlarm,
} from '../services/notifications';
import { useSettings } from './useSettings';
import { useEarthquakes } from './useEarthquakes';
import { getNotifiedIds, addNotifiedId } from '../services/storage';

export function useNotifications() {
  const { settings } = useSettings();
  const { data: earthquakes } = useEarthquakes();
  const registered = useRef(false);

  useEffect(() => {
    if (!registered.current) {
      registerForPushNotifications();
      registered.current = true;
    }
  }, []);

  useEffect(() => {
    if (!settings.notificationsEnabled || !earthquakes) return;

    const checkNewQuakes = async () => {
      const notifiedIds = await getNotifiedIds();

      for (const quake of earthquakes) {
        if (notifiedIds.has(quake.id)) continue;

        const mag = quake.properties.mag ?? 0;
        const distance = quake.distanceFromDhaka ?? 0;
        const level = quake.alertLevel ?? 'log';

        if (needsAlarm(quake)) {
          await sendAlarmNotification(quake);
          await addNotifiedId(quake.id);
          continue;
        }

        if (level === 'log') {
          await addNotifiedId(quake.id);
          continue;
        }

        if (mag >= settings.magnitudeThreshold && distance <= settings.radiusKm) {
          await sendLocalNotification(quake);
          await addNotifiedId(quake.id);
        }
      }
    };

    checkNewQuakes();
  }, [earthquakes, settings]);
}
