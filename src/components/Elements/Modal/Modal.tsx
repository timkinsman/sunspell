import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Skeleton } from '../Skeleton';
import { useRecommendations } from '@/features/user/api/getRecommendations';
import { ConditionalWrapper } from '@/components/ConditionalWrapper';
import { useCreatePlaylist } from '@/features/user/api/createPlaylist';
import { useAuth } from '@/hooks/useAuth';
import { useAddItemsToPlaylist } from '@/features/user/api/addItemsToPlaylist';
import { ArtistObject, TrackObject } from '@/features/user';
import { Button } from '..';

const limit = 20;

export const Modal = ({
  open,
  onClose,
  seedValues,
}: {
  open: boolean;
  onClose: () => void;
  seedValues: (ArtistObject | TrackObject)[];
}) => {
  const { user } = useAuth();

  const cancelButtonRef = useRef(null);

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
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Heading
                    </Dialog.Title>
                    <div className="mt-2">
                      <ConditionalWrapper
                        condition={recommendationQuery.isLoading}
                        wrapper={(children) => <Skeleton>{children}</Skeleton>}
                      >
                        <p className="text-sm text-gray-500">
                          Information about creating a playlist
                        </p>
                      </ConditionalWrapper>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-8 sm:grid-cols-4">
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
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <Button
                    size="sm"
                    className="sm:ml-3 sm:w-auto"
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
                    disabled={createPlaylistMutation.isLoading}
                  >
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant="outlined"
                    className="sm:w-auto"
                    onClick={onClose}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
