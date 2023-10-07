import { ContentLayout } from '@/components/Layout';
import { UseTopOptions, useTop } from '../api/getTop';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Button, Select } from '@/components/Elements';

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
  const [limit, setLimit] = useState(20);
  const [type, setType] = useState(types[0]);
  const [timeRange, setTimeRange] = useState(timeRanges[0]);

  const topQuery = useTop({
    type: type.id as UseTopOptions['type'],
    timeRange: timeRange.id as UseTopOptions['timeRange'],
    config: { enabled: !!user },
  });

  if (!user) return null;

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

        <div className="grid grid-cols-4 gap-4 mt-4">
          {items?.map((item) => {
            let src = '';

            if (item.type === 'artist') {
              src = item.images[0].url;
            } else {
              src = item.album.images[0].url;
            }

            return (
              <img
                alt={item.name}
                className="aspect-square object-cover hover:cursor-pointer hover:opacity-50 transition-all"
                onClick={() => {
                  window.open(item.uri, '_blank');
                }}
                src={src}
              />
            );
          })}
        </div>

        {limit === 20 && (
          <div className="flex justify-center mt-4">
            <Button onClick={() => setLimit(40)} variant="outlined">
              Show more
            </Button>
          </div>
        )}

        {limit === 40 && (
          <div className="flex justify-center mt-4">
            <Button onClick={() => setLimit(20)} variant="outlined">
              Show less
            </Button>
          </div>
        )}
      </div>
    </ContentLayout>
  );
};
