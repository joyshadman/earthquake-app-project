import { USGSResponse, Earthquake } from '../types';
import { USGS_API_URL, DHAKA_COORDS } from '../constants';
import { haversineDistance, isNearBangladesh } from '../utils/distance';
import { getAlertLevel } from '../utils/formatters';

export async function fetchEarthquakes(): Promise<Earthquake[]> {
  const response = await fetch(USGS_API_URL);
  if (!response.ok) {
    throw new Error(`USGS API error: ${response.status}`);
  }
  const data: USGSResponse = await response.json();
  const enriched = data.features
    .map((f) => {
      const [lng, lat] = f.geometry.coordinates;
      const distanceFromDhaka = haversineDistance(
        DHAKA_COORDS.lat,
        DHAKA_COORDS.lng,
        lat,
        lng
      );
      const isNear = isNearBangladesh(lat, lng);
      const alertLevel = getAlertLevel(f.properties.mag, isNear);
      return {
        ...f,
        distanceFromDhaka,
        alertLevel,
      } as Earthquake;
    })
    .sort((a, b) => b.properties.time - a.properties.time);

  const bangladeshQuakes = enriched.filter(
    (e) => e.distanceFromDhaka !== undefined && e.distanceFromDhaka <= 500
  );

  if (bangladeshQuakes.length > 0) return bangladeshQuakes;

  const closest = enriched
    .filter((e) => e.distanceFromDhaka !== undefined)
    .sort((a, b) => (a.distanceFromDhaka ?? 0) - (b.distanceFromDhaka ?? 0))
    .slice(0, 5);

  return closest.sort((a, b) => b.properties.time - a.properties.time);
}
