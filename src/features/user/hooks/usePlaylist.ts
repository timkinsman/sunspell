import { useState } from 'react';
import { ArtistObject, PlaylistObject, TrackObject } from '../types';
import { placeholder } from '../utils';
import { useRecommendations } from '../api/getRecommendations';
import { useCreatePlaylist } from '../api/createPlaylist';
import { useAddItemsToPlaylist } from '../api/addItemsToPlaylist';
import { useArray } from '@/hooks/useArray';
import { useAuth } from '@/hooks/useAuth';
import { pickRandomItems } from '@/utils/pickRandomItems';

export const usePlaylist = () => {
  const { user } = useAuth();

  const [data, setData] = useState<PlaylistObject>();
  const [error, setError] = useState<string>();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    array: seedValues,
    removeAll: removeAllSeedValues,
    setArray: setSeedValues,
  } = useArray<ArtistObject | TrackObject>([]);

  const { mutateAsync: createPlaylistMutation } = useCreatePlaylist({});
  const { mutateAsync: addItemsToPlaylistMutation } = useAddItemsToPlaylist({});

  const { refetch: getRecommendationsQuery } = useRecommendations({
    limit: 20,
    seed_values: seedValues,
    config: { enabled: false },
  });

  const createPlaylist = async (
    pool: TrackObject[] = [],
    name = placeholder.name,
    description = placeholder.description
  ) => {
    try {
      setIsLoading(true);
      setSeedValues(pickRandomItems(pool, 5));

      const user_id = user?.id;

      if (user_id) {
        const playlist = await createPlaylistMutation({
          user_id,
          name: name.length > 0 ? name : placeholder.name,
          description: description.length > 0 ? description : placeholder.description,
        });

        setData(playlist);

        const { data: recommendations } = await getRecommendationsQuery();
        const items = recommendations?.tracks;

        if (items) {
          await addItemsToPlaylistMutation({
            playlist_id: playlist.id,
            uris: items.map((item) => item.uri),
          });
        } else {
          throw new Error('Tracks to add does not exist!');
        }
      } else {
        throw new Error('User id does not exist!');
      }
    } catch (error) {
      setError(`${error}`);
      setIsError(true);
    } finally {
      removeAllSeedValues();
      setIsLoading(false);
    }
  };

  return [createPlaylist, { data, error, isError, isLoading }] as const;
};
