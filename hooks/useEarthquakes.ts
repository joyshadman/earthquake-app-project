import { useQuery } from '@tanstack/react-query';
import { fetchEarthquakes } from '../services/api';
import { cacheEarthquakes, getCachedEarthquakes } from '../services/storage';
import { POLL_INTERVAL } from '../constants';

export function useEarthquakes() {
  return useQuery({
    queryKey: ['earthquakes'],
    queryFn: async () => {
      try {
        const data = await fetchEarthquakes();
        await cacheEarthquakes(data);
        return data;
      } catch {
        const cached = await getCachedEarthquakes();
        if (cached.length > 0) return cached;
        throw new Error('Failed to fetch earthquakes');
      }
    },
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL,
    retry: 2,
    networkMode: 'always',
  });
}
