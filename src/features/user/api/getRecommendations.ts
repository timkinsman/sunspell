import { axios } from '@/lib/axios';
import { useQuery } from 'react-query';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { ArtistObject, TrackObject } from '../types';

type RecommendationSeedObject = {
  afterFilteringSize: number;
  afterRelinkingSize: number;
  href: string;
  id: string;
  initialPoolSize: number;
  type: string;
};

export const getRecommendations = ({
  limit,
  seed_values,
}: {
  limit: number;
  seed_values: (TrackObject | ArtistObject)[];
}): Promise<{ seeds: RecommendationSeedObject[]; tracks: TrackObject[] }> => {
  const seed_tracks = seed_values
    .filter((seed_value) => seed_value.type === 'track')
    .map((seed_value) => seed_value.id);
  const seed_artists = seed_values
    .filter((seed_value) => seed_value.type === 'artist')
    .map((seed_value) => seed_value.id);

  return axios.get('/recommendations', {
    params: { limit, seed_tracks: seed_tracks.join(','), seed_artists: seed_artists.join(',') },
  });
};

type QueryFnType = typeof getRecommendations;

export type UseRecommendationsOptions = {
  limit: number;
  seed_values: (TrackObject | ArtistObject)[];
  config?: QueryConfig<QueryFnType>;
};

export const useRecommendations = ({ limit, seed_values, config }: UseRecommendationsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ['top', limit, seed_values],
    queryFn: () => getRecommendations({ limit, seed_values }),
    ...config,
  });
};
