import { useAddItemsToPlaylist } from '@/features/user/api/addItemsToPlaylist';
import { useCreatePlaylist } from '@/features/user/api/createPlaylist';
import { useRecommendations } from '@/features/user/api/getRecommendations';
import { useAuth } from '@/hooks/useAuth';
import clsx from 'clsx';
import React from 'react';
import { Skeleton } from '../Skeleton';
import { ArtistObject, TrackObject } from '@/features/user';
import { Button } from '..';
import { IconButton } from '../IconButton';

const limit = 20;

export const Drawer = ({
  open,
  onClose,
  seedValues,
}: {
  open: boolean;
  onClose: () => void;
  seedValues: (ArtistObject | TrackObject)[];
}) => {
  const { user } = useAuth();

  const recommendationQuery = useRecommendations({
    limit: 40, // fetch more to enable re-rolling without re-fetching
    seed_values: seedValues,
    config: { enabled: open },
  });

  const createPlaylistMutation = useCreatePlaylist({});
  const addItemsToPlaylistMutation = useAddItemsToPlaylist({});

  // todo: enable re-rolling tracks
  const items = recommendationQuery.data?.tracks.slice(0, limit);

  return (
    <div
      id="drawer-right-example"
      className={clsx(
        'fixed top-0 right-0 z-40 h-screen overflow-y-auto transition-transform bg-white w-full max-w-2xl',
        { ['translate-x-full']: !open }
      )}
      tabIndex={-1}
      aria-labelledby="drawer-right-label"
    >
      <div className="sticky top-0 z-10 bg-white p-4">
        <h5
          id="drawer-right-label"
          className="inline-flex items-center mb-4 text-base font-semibold text-gray-500"
        >
          <svg
            className="w-4 h-4 mr-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          Create playlist
        </h5>
        <IconButton className="absolute top-2.5 right-2.5" onClick={onClose}>
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </IconButton>

        <p className="text-sm text-gray-500">Information about creating a playlist</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-8 sm:grid-cols-4 p-4">
        {recommendationQuery.isLoading &&
          Array(limit)
            .fill(true)
            .map(() => (
              <Skeleton>
                <img className="aspect-square object-cover" src="" />
              </Skeleton>
            ))}

        {recommendationQuery.isSuccess &&
          items?.map((item, i) => {
            const src = item.album.images[0].url;

            return (
              <div className="relative group rounded overflow-hidden">
                <img
                  alt={item.name}
                  className="aspect-square object-cover hover:cursor-pointer hover:opacity-50 transition-all"
                  onClick={() => {
                    window.open(item.uri, '_blank');
                  }}
                  src={src}
                />
                <div className="opacity-0 group-hover:opacity-100 duration-300 absolute inset-x-0 bottom-0 flex justify-center items-end text-l bg-gray-200 bg-opacity-75 font-semibold p-2">
                  {i + 1} - {item.name}
                </div>
              </div>
            );
          })}

        {/* todo: handle no items on success state */}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 sticky bottom-0 z-10 bg-white p-4">
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={async () => {
            try {
              const user_id = user?.id;

              if (user_id) {
                const playlist = await createPlaylistMutation.mutateAsync({
                  user_id,
                  name: 'sunspell',
                  description: 'hehe',
                });

                if (items) {
                  await addItemsToPlaylistMutation.mutateAsync({
                    playlist_id: playlist.id,
                    uris: items.map((item) => item.uri),
                  });

                  onClose();
                } else {
                  throw new Error('Tracks to add does not exist!');
                }
              } else {
                throw new Error('User id does not exist!');
              }
            } catch (error) {
              console.error(error);
            }
          }}
          isLoading={createPlaylistMutation.isLoading || addItemsToPlaylistMutation.isLoading}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};
