export interface USGSFeature {
  id: string;
  properties: {
    mag: number | null;
    place: string;
    time: number;
    tsunami: number;
    title: string;
  };
  geometry: {
    type: string;
    coordinates: [number, number, number];
  };
}

export interface USGSResponse {
  features: USGSFeature[];
}

export interface AppConfig {
  port: number;
  magnitudeThreshold: number;
  radiusKm: number;
  dhakaLat: number;
  dhakaLng: number;
  pollIntervalMs: number;
  expoPushTokens: string[];
}
