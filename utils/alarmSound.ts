import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';

let currentSound: Audio.Sound | null = null;

const SAMPLE_RATE = 44100;
const CHANNELS = 1;
const BITS_PER_SAMPLE = 16;
const DURATION_SEC = 6;
const TONE_A = 880;
const TONE_B = 660;
const PULSE_SEC = 0.25;

function generateAlarmWavAsBase64(): string {
  const numSamples = SAMPLE_RATE * DURATION_SEC;
  const dataSize = numSamples * CHANNELS * (BITS_PER_SAMPLE / 8);
  const fileSize = 44 + dataSize;

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, fileSize - 8, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, CHANNELS, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * CHANNELS * (BITS_PER_SAMPLE / 8), true);
  view.setUint16(32, CHANNELS * (BITS_PER_SAMPLE / 8), true);
  view.setUint16(34, BITS_PER_SAMPLE, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const pulseIndex = Math.floor(t / PULSE_SEC);
    const freq = pulseIndex % 2 === 0 ? TONE_A : TONE_B;
    const sample = Math.sin(2 * Math.PI * freq * t);
    const envelope = Math.min(1, (numSamples - i) / (SAMPLE_RATE * 0.5));
    const val = Math.round(sample * 0.7 * envelope * 32767);
    const clamped = Math.max(-32768, Math.min(32767, val));
    view.setInt16(44 + i * 2, clamped, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function ensureAlarmFile(): Promise<string> {
  const fileUri = FileSystem.cacheDirectory + 'alarm.wav';
  const info = await FileSystem.getInfoAsync(fileUri);
  if (info.exists) return fileUri;

  const base64 = generateAlarmWavAsBase64();
  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return fileUri;
}

export async function playAlarmSound(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: false,
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: false,
    });

    const fileUri = await ensureAlarmFile();
    const { sound } = await Audio.Sound.createAsync(
      { uri: fileUri },
      {
        shouldPlay: true,
        isLooping: true,
        volume: 1.0,
      }
    );
    currentSound = sound;
  } catch {}
}

export async function stopAlarmSound(): Promise<void> {
  if (currentSound) {
    try {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
    } catch {}
    currentSound = null;
  }
}
