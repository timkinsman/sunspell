import { axios } from '@/lib/axios';
import { useMutation } from 'react-query';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { PlaylistObject } from '../types';
import { TrackObject } from '@/types';
// import { useToast } from '@nayhoo/components';

export const addItemsToPlaylist = ({
  playlist_id,
  uris,
}: {
  playlist_id: PlaylistObject['id'];
  uris: TrackObject['uri'][];
}): Promise<PlaylistObject> => {
  return axios.post(`/playlists/${playlist_id}/tracks`, {
    uris,
  });
};

type QueryFnType = typeof addItemsToPlaylist;

type UseAddItemsToPlaylistOptions = {
  config?: MutationConfig<QueryFnType>;
};

export const useAddItemsToPlaylist = ({ config }: UseAddItemsToPlaylistOptions) => {
  // const toast = useToast();
  return useMutation({
    onMutate: async ({
      playlist_id,
      uris,
    }: {
      playlist_id: PlaylistObject['id'];
      uris: TrackObject['uri'][];
    }) => {
      await queryClient.cancelQueries('addItemsToPlaylist');

      queryClient.setQueryData('addItemsToPlaylist', { playlist_id, uris });
    },
    onError: () => {
      // on error, notification?
    },
    onSuccess: () => {
      queryClient.invalidateQueries('addItemsToPlaylist');
      // toast({ title: 'Success!', description: 'Tracks added' });
    },
    ...config,
    mutationFn: addItemsToPlaylist,
  });
};
