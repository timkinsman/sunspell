import { axios } from '@/lib/axios';
import { useQuery } from 'react-query';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { UserProfile } from '../types';

export const getProfile = (): Promise<UserProfile> => {
  return axios.get(`/me`);
};

type QueryFnType = typeof getProfile;

type UseProfileOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useProfile = ({ config }: UseProfileOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    ...config,
  });
};
