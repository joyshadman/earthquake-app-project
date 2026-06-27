import dotenv from 'dotenv';
import express from 'express';
import { AppConfig } from './types';
import { poll } from './poller';
import { sendNotifications } from './notifier';

dotenv.config();

let pushTokens: string[] = [];
const seenIds = new Set<string>();
let lastPollTime: number | null = null;

function loadConfig(): AppConfig {
  const rawTokens = process.env.EXPO_PUSH_TOKENS || '';
  return {
    port: parseInt(process.env.PORT || '3000', 10),
    magnitudeThreshold: parseFloat(process.env.MAGNITUDE_THRESHOLD || '4.5'),
    radiusKm: parseFloat(process.env.RADIUS_KM || '300'),
    dhakaLat: parseFloat(process.env.DHAKA_LAT || '23.8103'),
    dhakaLng: parseFloat(process.env.DHAKA_LNG || '90.4125'),
    pollIntervalMs: parseInt(process.env.POLL_INTERVAL_MS || '300000', 10),
    expoPushTokens: rawTokens ? rawTokens.split(',').map((t) => t.trim()).filter(Boolean) : [],
  };
}

async function pollAndNotify(config: AppConfig): Promise<void> {
  try {
    const { newQuakes } = await poll(config);

    const unseen = newQuakes.filter((q) => !seenIds.has(q.id));

    if (unseen.length > 0) {
      console.log(
        `[POLLER] Found ${unseen.length} new earthquake(s) matching filters`
      );
      await sendNotifications(unseen, pushTokens);

      for (const q of unseen) {
        seenIds.add(q.id);
      }
    }

    lastPollTime = Date.now();
  } catch (error) {
    console.error('[POLLER] Poll failed:', error);
  }
}

function startPolling(config: AppConfig): void {
  console.log(`[POLLER] Starting poll every ${config.pollIntervalMs / 1000}s`);
  console.log(
    `[POLLER] Filters: mag >= ${config.magnitudeThreshold}, radius <= ${config.radiusKm}km from Dhaka`
  );

  pollAndNotify(config);
  setInterval(() => pollAndNotify(config), config.pollIntervalMs);
}

const app = express();
app.use(express.json());

app.post('/register', (req, res) => {
  const { token } = req.body;
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid token' });
  }
  if (!pushTokens.includes(token)) {
    pushTokens.push(token);
    console.log(`[API] Registered push token: ${token.slice(0, 20)}...`);
  }
  res.json({ ok: true, registered: pushTokens.length });
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    registeredTokens: pushTokens.length,
    seenIds: seenIds.size,
    lastPollTime,
  });
});

app.get('/config', (_req, res) => {
  const config = loadConfig();
  const safeConfig = { ...config, expoPushTokens: config.expoPushTokens.length > 0 ? `[${config.expoPushTokens.length} tokens]` : [] };
  res.json(safeConfig);
});

function start(): void {
  const config = loadConfig();
  pushTokens = [...config.expoPushTokens];

  startPolling(config);

  app.listen(config.port, () => {
    console.log(`[SERVER] Running on port ${config.port}`);
    console.log(`[SERVER] Push tokens configured: ${pushTokens.length}`);
  });
}

start();
