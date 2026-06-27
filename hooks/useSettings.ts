import { useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { AppSettings, ThemeColors } from '../types';
import { DEFAULT_SETTINGS, COLORS } from '../constants';
import { getSettings, saveSettings } from '../services/storage';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const systemScheme = useColorScheme();

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s);
      setLoaded(true);
    });
  }, []);

  const update = useCallback(
    async (partial: Partial<AppSettings>) => {
      const next = { ...settings, ...partial };
      setSettings(next);
      await saveSettings(next);
    },
    [settings]
  );

  const theme: ThemeColors = useMemo(() => {
    const isDark = settings.useSystemTheme
      ? systemScheme === 'dark'
      : settings.darkMode;
    return isDark ? COLORS.dark : COLORS.light;
  }, [settings.darkMode, settings.useSystemTheme, systemScheme]);

  const isDark = useMemo(() => {
    return settings.useSystemTheme
      ? systemScheme === 'dark'
      : settings.darkMode;
  }, [settings.darkMode, settings.useSystemTheme, systemScheme]);

  return { settings, update, loaded, theme, isDark };
}
