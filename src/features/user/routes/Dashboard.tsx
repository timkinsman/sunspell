import { ContentLayout } from '@/components/Layout';
import { UseTopOptions, useTop } from '../api/getTop';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import {
  AspectRatio,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Flex,
  Grid,
  Heading,
  Image,
  Link,
  Skeleton,
  Text,
  ToastAction,
  Tooltip,
  useToast,
} from '@nayhoo/components';
import { timeRanges, types } from '../utils';
import { usePlaylist } from '@/features/playlist/hooks/usePlaylist';

export const Dashboard = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [type, setType] = useState(types[1]);
  const [timeRange, setTimeRange] = useState(timeRanges[2]);

  const {
    data: top,
    isFetching,
    isSuccess,
  } = useTop({
    type: type.id as UseTopOptions['type'],
    timeRange: timeRange.id as UseTopOptions['timeRange'],
  });

  const [createPlaylist, { isLoading }] = usePlaylist();

  if (!user) return null;

  return (
    <ContentLayout title="Dashboard">
      <Flex justify="between" align="center" wrap="wrap" gap="2" css={{ mb: '$4' }}>
        <Heading>
          Your most listened to{' '}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Text css={{ fontSize: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}>
                {type.name}
              </Text>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {types.map((item) => (
                <DropdownMenuItem key={item.name} onClick={() => setType(item)}>
                  {item.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>{' '}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Text css={{ fontSize: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}>
                {timeRange.name}
              </Text>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {timeRanges.map((item) => (
                <DropdownMenuItem key={item.name} onClick={() => setTimeRange(item)}>
                  {item.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </Heading>

        <Tooltip
          style={{ zIndex: 99 }}
          delayDuration={250}
          content={`Create a playlist based on ${type.name} ${timeRange.name}`}
        >
          <Button
            disabled={!isSuccess}
            size="1"
            variant="outline"
            loading={isLoading}
            onClick={() =>
              createPlaylist(top?.items).then((playlist) =>
                toast({
                  title: 'Success 🪄',
                  description: 'View the curated songs now!',
                  action: (
                    <Flex gap="1">
                      <ToastAction altText="View later" asChild>
                        <Button size="1" variant="outline">
                          Later :)
                        </Button>
                      </ToastAction>

                      <ToastAction altText="View now" asChild>
                        <Button size="1" onClick={() => window.open(playlist.uri)}>
                          View
                        </Button>
                      </ToastAction>
                    </Flex>
                  ),
                  duration: 99999,
                })
              )
            }
          >
            Create playlist 🪄
          </Button>
        </Tooltip>
      </Flex>

      <Grid
        columns={{ '@initial': 2, '@bp1': 4 }}
        gap={{ '@initial': '2', '@bp1': '4' }}
        css={{ rowGap: '$4', mb: '$7' }}
      >
        {isFetching &&
          Array(20)
            .fill(0)
            .map((_, i) => (
              <AspectRatio key={i} ratio={1}>
                <Skeleton css={{ height: '100%' }} />
              </AspectRatio>
            ))}

        {isSuccess &&
          top?.items.map((item, i) => (
            <Flex key={item.id} gap="2" direction="column">
              <AspectRatio ratio={1}>
                <Flex
                  align="center"
                  justify="center"
                  css={{
                    backgroundColor: '#000',
                    height: '100%',
                    width: '100%',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src={
                      item.type === 'track' ? item.album.images?.[0]?.url : item.images?.[0]?.url
                    }
                  />
                </Flex>
              </AspectRatio>
              <Flex direction="column" align="center" justify="start" gap="1">
                {item.type === 'track' && (
                  <Text size="2" css={{ textAlign: 'center' }}>
                    {item.artists[0].name}
                  </Text>
                )}
                <Text
                  size="1"
                  css={{
                    color: '$textLabel',
                    lineHeight: '1.25rem',
                    textAlign: 'center',
                  }}
                >
                  {i + 1}. <Link href={item.uri}>{item.name}</Link>
                </Text>
              </Flex>
            </Flex>
          ))}
      </Grid>
    </ContentLayout>
  );
};
