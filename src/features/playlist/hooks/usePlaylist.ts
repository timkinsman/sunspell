import { useState } from 'react';
import { PlaylistObject } from '../types';
import { placeholder } from '../../user/utils';
import { useRecommendations } from '../api/getRecommendations';
import { useCreatePlaylist } from '../api/createPlaylist';
import { useAddItemsToPlaylist } from '../api/addItemsToPlaylist';
import { useArray } from '@/hooks/useArray';
import { useAuth } from '@/hooks/useAuth';
import { pickRandomItems } from '@/utils/pickRandomItems';
import { ArtistObject, TrackObject } from '@/types';

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

  const { mutateAsync: createPlaylist } = useCreatePlaylist({});
  const { mutateAsync: addItemsToPlaylist } = useAddItemsToPlaylist({});

  const { refetch: getRecommendations } = useRecommendations({
    limit: 20,
    seed_values: seedValues,
    config: { enabled: false },
  });

  const trigger = async (
    pool: (ArtistObject | TrackObject)[] = [],
    name = placeholder.name,
    description = placeholder.description
  ): Promise<PlaylistObject> => {
    try {
      setIsLoading(true);
      setSeedValues(pickRandomItems(pool, 5));

      const user_id = user?.id;

      if (user_id) {
        const playlist = await createPlaylist({
          user_id,
          name: name.length > 0 ? name : placeholder.name,
          description: description.length > 0 ? description : placeholder.description,
        });

        const { data: recommendations } = await getRecommendations();
        const items = recommendations?.tracks;

        if (items) {
          await addItemsToPlaylist({
            playlist_id: playlist.id,
            uris: items.map((item) => item.uri),
          });
        } else {
          throw new Error('Tracks to add does not exist!');
        }

        setData(playlist);
        return playlist;
      } else {
        throw new Error('User id does not exist!');
      }
    } catch (error) {
      setError(`${error}`);
      setIsError(true);

      throw error;
    } finally {
      removeAllSeedValues();
      setIsLoading(false);
    }
  };

  return [trigger, { data, error, isError, isLoading }] as const;
};
