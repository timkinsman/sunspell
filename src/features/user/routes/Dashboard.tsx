import { ContentLayout } from '@/components/Layout';
import { UseTopOptions, useTop } from '../api/getTop';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Button, Select } from '@/components/Elements';
import { Skeleton } from '@/components/Elements/Skeleton';
// import { Modal } from '@/components/Elements/Modal';
import { Checkbox } from '@/components/Elements/Checkbox';
import { useArray } from '@/hooks/useArray';
import clsx from 'clsx';
import { Toast } from '@/components/Elements/Toast';
import { useDisclosure } from '@/hooks/useDisclosure';
import { ArtistObject, TrackObject } from '..';
import { Drawer } from '@/components/Elements/Drawer';

const types = [
  { id: 'artists', name: 'Artists' },
  { id: 'tracks', name: 'Tracks' },
];
const timeRanges = [
  { id: 'long_term', name: 'Lifetime' },
  { id: 'medium_term', name: 'Last 6 months' },
  { id: 'short_term', name: 'Last 4 weeks' },
];

export const Dashboard = () => {
  const { user } = useAuth();
  const [more, setMore] = useState(false);
  const [type, setType] = useState(types[1]);
  const [timeRange, setTimeRange] = useState(timeRanges[2]);

  const { isOpen, open, close } = useDisclosure();

  const {
    array: seedValues,
    removeAll: removeAllSeedValues,
    toggle: toggleSeedValues,
  } = useArray<ArtistObject | TrackObject>([]);

  const topQuery = useTop({
    type: type.id as UseTopOptions['type'],
    timeRange: timeRange.id as UseTopOptions['timeRange'],
    config: { enabled: !!user },
  });

  if (!user) return null;

  const limit = more ? 40 : 20;
  const items = topQuery.data?.items.slice(0, limit);

  return (
    <ContentLayout title="Dashboard">
      <h1 className="text-xl mt-2">
        Welcome <b>{user.display_name}</b>
      </h1>
      <div>
        <div className="flex gap-2 mt-8">
          <Select selected={type} setSelected={setType} items={types} />
          <Select selected={timeRange} setSelected={setTimeRange} items={timeRanges} />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8 sm:grid-cols-4">
          {topQuery.isLoading &&
            Array(limit)
              .fill(true)
              .map(() => (
                <Skeleton>
                  <img className="aspect-square object-cover" src="" />
                </Skeleton>
              ))}

          {topQuery.isSuccess &&
            items?.map((item, i) => {
              let src = '';

              if (item.type === 'artist') {
                src = item.images[0].url;
              } else {
                src = item.album.images[0].url;
              }

              const checked = seedValues.includes(item);

              return (
                <div
                  className={clsx('relative group rounded overflow-hidden', {
                    ['outline outline-4 outline-orange-500']: checked,
                  })}
                >
                  <img
                    alt={item.name}
                    className="aspect-square object-cover hover:cursor-pointer hover:opacity-50 transition-all"
                    onClick={() => {
                      window.open(item.uri, '_blank');
                    }}
                    src={src}
                  />
                  <div className="opacity-0 group-hover:opacity-100 duration-300 absolute left-0 top-0 p-2">
                    <Checkbox
                      size="md"
                      checked={checked}
                      onCheckedChange={() => toggleSeedValues(item)}
                      disabled={(seedValues.length >= 5 && !seedValues.includes(item)) || isOpen}
                    />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 duration-300 absolute inset-x-0 bottom-0 flex justify-center items-end text-l bg-gray-200 bg-opacity-75 font-semibold p-2">
                    {i + 1} - {item.name}
                  </div>
                </div>
              );
            })}
        </div>

        <div className="flex justify-center mt-4">
          <Button
            disabled={topQuery.isLoading}
            onClick={() => setMore(!more)}
            size="sm"
            variant="outlined"
          >
            Show {more ? 'less' : 'more'}
          </Button>
        </div>

        <Drawer
          open={isOpen}
          onClose={close}
          seedValues={seedValues}
          onSuccess={removeAllSeedValues}
        />
        {/* <Modal open={isOpen} onClose={close} seedValues={seedValues} /> */}
        <Toast
          title={`${seedValues.length} item${seedValues.length > 1 ? 's' : ''} selected`}
          open={seedValues.length > 0 && !isOpen}
          action={open}
          onClose={removeAllSeedValues}
        />
      </div>
    </ContentLayout>
  );
};
