import { axios } from '@/lib/axios';
import { useQuery } from 'react-query';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { Results } from '../types';

export const getTopItems = ({
  type,
  /**
   * long_term (calculated from several years of data and including all new data as it becomes available), medium_term (approximately last 6 months), short_term (approximately last 4 weeks)
   */
  timeRange = 'long_term',
  limit = 20,
  offset,
}: {
  type: 'artists' | 'tracks';
  timeRange?: 'long_term' | 'medium_term' | 'short_term';
  limit?: number;
  offset?: number;
}): Promise<Results> => {
  return axios.get(`/me/top/${type}`, { params: { time_range: timeRange, limit, offset } });
};

type QueryFnType = typeof getTopItems;

type UseTopItemsOptions = {
  type: 'artists' | 'tracks';
  timeRange?: 'long_term' | 'medium_term' | 'short_term';
  limit?: number;
  offset?: number;
  config?: QueryConfig<QueryFnType>;
};

export const useTopItems = ({ type, timeRange, limit, offset, config }: UseTopItemsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ['topItems', type],
    queryFn: () => getTopItems({ type, timeRange, limit, offset }),
    ...config,
  });
};
