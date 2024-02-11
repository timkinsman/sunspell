import { axios } from '@/lib/axios';
import { useMutation } from 'react-query';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { PlaylistObject, UserProfile } from '../types';
import { useToast } from '@nayhoo/components';

export const createPlaylist = ({
  user_id,
  name,
  description,
}: {
  user_id: UserProfile['id'];
  name: string;
  description: string;
}): Promise<PlaylistObject> => {
  return axios.post(`/users/${user_id}/playlists`, {
    name,
    description,
  });
};

type QueryFnType = typeof createPlaylist;

type UseProfileOptions = {
  config?: MutationConfig<QueryFnType>;
};

export const useCreatePlaylist = ({ config }: UseProfileOptions) => {
  const toast = useToast();
  return useMutation({
    onMutate: async ({
      user_id,
      name,
      description,
    }: {
      user_id: UserProfile['id'];
      name: string;
      description: string;
    }) => {
      await queryClient.cancelQueries('Create playlist');

      queryClient.setQueryData('Create playlist', { user_id, name, description });
    },
    onError: () => {
      // on error, notification?
    },
    onSuccess: () => {
      queryClient.invalidateQueries('Create playlist');
      toast({ title: 'Playlist Created' });
    },
    ...config,
    mutationFn: createPlaylist,
  });
};
