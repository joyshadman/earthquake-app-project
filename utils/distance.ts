import { DHAKA_COORDS, BANGLADESH_REGION } from '../constants';

export function haversineDistance(
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

function pointInBoundingBox(
  lat: number,
  lng: number,
  region: typeof BANGLADESH_REGION
): boolean {
  return (
    lat >= region.latMin &&
    lat <= region.latMax &&
    lng >= region.lngMin &&
    lng <= region.lngMax
  );
}

export function isWithinBangladeshRegion(
  lat: number,
  lng: number
): boolean {
  return pointInBoundingBox(lat, lng, BANGLADESH_REGION);
}

export function isNearBangladesh(
  lat: number,
  lng: number
): boolean {
  const distance = haversineDistance(
    DHAKA_COORDS.lat,
    DHAKA_COORDS.lng,
    lat,
    lng
  );
  return distance <= BANGLADESH_REGION.borderBufferKm;
}
