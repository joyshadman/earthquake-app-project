import { USGSResponse, USGSFeature, AppConfig } from './types';

const USGS_URL =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function fetchFromUSGS(): Promise<USGSFeature[]> {
  const response = await fetch(USGS_URL);
  if (!response.ok) {
    throw new Error(`USGS responded with ${response.status}`);
  }
  const data: USGSResponse = await response.json();
  return data.features;
}

export function filterRelevant(
  features: USGSFeature[],
  config: AppConfig
): USGSFeature[] {
  return features.filter((f) => {
    const mag = f.properties.mag ?? 0;
    if (mag < config.magnitudeThreshold) return false;

    const [lng, lat] = f.geometry.coordinates;
    const dist = haversineDistance(
      config.dhakaLat,
      config.dhakaLng,
      lat,
      lng
    );
    return dist <= config.radiusKm;
  });
}

export interface PollResult {
  newQuakes: USGSFeature[];
  allQuakes: USGSFeature[];
}

export async function poll(config: AppConfig): Promise<PollResult> {
  const features = await fetchFromUSGS();
  const relevant = filterRelevant(features, config);
  return { newQuakes: relevant, allQuakes: features };
}
