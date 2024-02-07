import { ContentLayout } from '@/components/Layout';
import { UseTopOptions, useTop } from '../api/getTop';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Button } from '@/components/Elements';
import { useArray } from '@/hooks/useArray';
import { ArtistObject, TrackObject } from '..';
import { useCreatePlaylist } from '../api/createPlaylist';
import { useAddItemsToPlaylist } from '../api/addItemsToPlaylist';
import { useRecommendations } from '../api/getRecommendations';

const placeholder = {
  name: 'Sunspell',
  description: 'Created',
};

const timeRanges = [
  { id: 'long_term', name: 'Lifetime' },
  { id: 'medium_term', name: 'Last 6 months' },
  { id: 'short_term', name: 'Last 4 weeks' },
] as const;

export const Dashboard = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState(timeRanges[2]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    array: seedValues,
    removeAll: removeAllSeedValues,
    // toggle: toggleSeedValues,
    setArray: setSeedValues,
  } = useArray<ArtistObject | TrackObject>([]);

  const { refetch: getTop } = useTop({
    type: 'tracks',
    timeRange: timeRange.id as UseTopOptions['timeRange'],
    config: { enabled: false },
  });

  if (!user) return null;

  const { mutateAsync: createPlaylist } = useCreatePlaylist({});
  const { mutateAsync: addItemsToPlaylist } = useAddItemsToPlaylist({});

  const { refetch: getRecommendations } = useRecommendations({
    limit: 20,
    seed_values: seedValues,
    config: { enabled: false },
  });

  return (
    <ContentLayout title="Dashboard">
      <div className="flex items-center flex-col">
        <h1 className="text-xl mt-2">
          Welcome <b>{user.display_name}</b>!
        </h1>
        <div>
          <div className="grid gap-2 mt-8 grid-cols-2">
            <Button
              isLoading={isLoading}
              onClick={async () => {
                try {
                  setIsLoading(true);

                  const { data: top } = await getTop();
                  const items = top?.items?.slice(0, 5);

                  setSeedValues(items ?? []);

                  const user_id = user?.id;

                  if (user_id) {
                    const playlist = await createPlaylist({
                      user_id,
                      name: placeholder.name,
                      description: placeholder.description,
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
                  } else {
                    throw new Error('User id does not exist!');
                  }
                } catch (error) {
                  console.error(error);
                } finally {
                  removeAllSeedValues();
                  setIsLoading(false);
                }
              }}
            >
              Simple
            </Button>
            <Button disabled={isLoading}>Advanced</Button>
          </div>
        </div>

        <h1 className="text-xl mt-2 mt-8">How it works?</h1>
      </div>
    </ContentLayout>
  );
};
