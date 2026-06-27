import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { useSettings } from '../../hooks/useSettings';
import { t } from '../../lib/i18n';
import { sendTestNotification, sendTestAlarm } from '../../services/notifications';

export default function SettingsScreen() {
  const { settings, update, theme } = useSettings();
  const lang = settings.language;

  const handleTestNotification = async () => {
    try {
      await sendTestNotification();
      Alert.alert(
        t('test_notification', lang),
        t('sent_notification', lang)
      );
    } catch {
      Alert.alert(t('error', lang), 'Failed to send test notification');
    }
  };

  const handleTestAlarm = async () => {
    try {
      await sendTestAlarm();
      Alert.alert(
        t('test_alarm', lang),
        t('alarm_test_sent', lang)
      );
    } catch {
      Alert.alert(t('error', lang), 'Failed to send test alarm');
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('mag_threshold', lang)}
        </Text>
        <View style={styles.sliderRow}>
          <Text style={[styles.sliderValue, { color: theme.primary }]}>
            {settings.magnitudeThreshold.toFixed(1)}
          </Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={2.0}
          maximumValue={8.0}
          step={0.1}
          value={settings.magnitudeThreshold}
          onSlidingComplete={(val) => update({ magnitudeThreshold: val })}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.border}
          thumbTintColor={theme.primary}
        />
        <View style={styles.sliderLabels}>
          <Text style={[styles.sliderLabel, { color: theme.textSecondary }]}>2.0</Text>
          <Text style={[styles.sliderLabel, { color: theme.textSecondary }]}>8.0</Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('radius', lang)}
        </Text>
        <View style={styles.sliderRow}>
          <Text style={[styles.sliderValue, { color: theme.primary }]}>
            {settings.radiusKm} {t('km', lang)}
          </Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={50}
          maximumValue={1000}
          step={10}
          value={settings.radiusKm}
          onSlidingComplete={(val) => update({ radiusKm: val })}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.border}
          thumbTintColor={theme.primary}
        />
        <View style={styles.sliderLabels}>
          <Text style={[styles.sliderLabel, { color: theme.textSecondary }]}>50 km</Text>
          <Text style={[styles.sliderLabel, { color: theme.textSecondary }]}>1000 km</Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <SettingRow label={t('notifications', lang)} theme={theme}>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(val) => update({ notificationsEnabled: val })}
            trackColor={{ false: theme.border, true: theme.primaryLight }}
            thumbColor={settings.notificationsEnabled ? theme.primary : '#f4f3f4'}
          />
        </SettingRow>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <TouchableOpacity
          style={[styles.testButton, { backgroundColor: theme.primary }]}
          onPress={handleTestNotification}
        >
          <Text style={styles.testButtonText}>
            {t('test_notification', lang)}
          </Text>
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <TouchableOpacity
          style={[styles.testButton, { backgroundColor: theme.danger }]}
          onPress={handleTestAlarm}
        >
          <Text style={styles.testButtonText}>
            🔔 {t('test_alarm', lang)}
          </Text>
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <SettingRow label={t('language', lang)} theme={theme}>
          <View style={styles.languageToggle}>
            <Text
              style={[
                styles.langOption,
                {
                  color: lang === 'en' ? theme.primary : theme.textSecondary,
                  fontWeight: lang === 'en' ? '700' : '400',
                },
              ]}
              onPress={() => update({ language: 'en' })}
            >
              EN
            </Text>
            <Text style={[styles.langSep, { color: theme.textSecondary }]}>/</Text>
            <Text
              style={[
                styles.langOption,
                {
                  color: lang === 'bn' ? theme.primary : theme.textSecondary,
                  fontWeight: lang === 'bn' ? '700' : '400',
                },
              ]}
              onPress={() => update({ language: 'bn' })}
            >
              BN
            </Text>
          </View>
        </SettingRow>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <SettingRow label={t('system_theme', lang)} theme={theme}>
          <Switch
            value={settings.useSystemTheme}
            onValueChange={(val) => update({ useSystemTheme: val })}
            trackColor={{ false: theme.border, true: theme.primaryLight }}
            thumbColor={settings.useSystemTheme ? theme.primary : '#f4f3f4'}
          />
        </SettingRow>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <SettingRow label={t('dark_mode', lang)} theme={theme}>
          <Switch
            value={settings.darkMode}
            onValueChange={(val) => update({ darkMode: val })}
            trackColor={{ false: theme.border, true: theme.primaryLight }}
            thumbColor={settings.darkMode ? theme.primary : '#f4f3f4'}
            disabled={settings.useSystemTheme}
          />
        </SettingRow>
      </View>

      <Text style={[styles.footer, { color: theme.textSecondary }]}>
        {t('about', lang)}
      </Text>
    </ScrollView>
  );
}

function SettingRow({
  label,
  children,
  theme,
}: {
  label: string;
  children: React.ReactNode;
  theme: any;
}) {
  return (
    <View style={styles.settingRow}>
      <Text style={[styles.settingLabel, { color: theme.text }]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  sliderRow: {
    alignItems: 'center',
    marginVertical: 4,
  },
  sliderValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 15,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 4,
  },
  languageToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langOption: {
    fontSize: 15,
    paddingHorizontal: 4,
  },
  langSep: {
    fontSize: 15,
  },
  testButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 4,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 24,
  },
});
