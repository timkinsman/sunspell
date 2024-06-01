import { axios } from '@/lib/axios';
import { UserProfile } from '../types';

export const getProfile = (): Promise<UserProfile> => {
  return axios.get(`/me`);
};
