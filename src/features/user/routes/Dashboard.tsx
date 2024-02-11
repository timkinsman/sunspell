import { ContentLayout } from '@/components/Layout';
import { UseTopOptions, useTop } from '../api/getTop';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useArray } from '@/hooks/useArray';
import { ArtistObject, TrackObject } from '..';
import { useCreatePlaylist } from '../api/createPlaylist';
import { useAddItemsToPlaylist } from '../api/addItemsToPlaylist';
import { useRecommendations } from '../api/getRecommendations';
import {
  Box,
  Button,
  Flex,
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormSubmit,
  Grid,
  Heading,
  TextArea,
  TextField,
} from '@nayhoo/components';

const placeholder = {
  name: 'Sunspell',
  description: 'Created',
};

const timeRanges = [
  { id: 'long_term', name: 'Lifetime' },
  { id: 'medium_term', name: 'Last 6 months' },
  { id: 'short_term', name: 'Last 4 weeks' },
];

export const Dashboard = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState(timeRanges[2]);
  const [isLoading, setIsLoading] = useState(false);

  const [remainingRolls, setRemainingRolls] = useState(3);

  const [advancedStep, setAdvancedStep] = useState(0);

  const {
    array: seedValues,
    removeAll: removeAllSeedValues,
    // toggle: toggleSeedValues,
    setArray: setSeedValues,
  } = useArray<ArtistObject | TrackObject>([]);

  const {
    array: selectedTracks,
    removeAll: removeAllSelectedTracks,
    toggle: toggleSelectedTracks,
  } = useArray<TrackObject>([]);

  const { refetch: getTop, data: top } = useTop({
    type: 'tracks',
    timeRange: timeRange.id as UseTopOptions['timeRange'],
  });

  const { mutateAsync: createPlaylist } = useCreatePlaylist({});
  const { mutateAsync: addItemsToPlaylist } = useAddItemsToPlaylist({});

  const { refetch: getRecommendations, isFetching } = useRecommendations({
    limit: 20,
    seed_values: seedValues,
    config: { enabled: false },
  });

  const create = async (pool: TrackObject[] = []) => {
    try {
      setIsLoading(true);

      setSeedValues(pickRandomItems(pool, 5));

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
  };

  const renderStep = (step: number) => {
    switch (step) {
      case 0: {
        return (
          <Grid columns={2} gap={2}>
            <Button
              loading={isLoading}
              onClick={async () => {
                const { data: top } = await getTop();
                const items = top?.items;

                create(items);
              }}
            >
              Simple
            </Button>
            <Button onClick={() => setAdvancedStep(1)} disabled={isLoading}>
              Advanced
            </Button>
          </Grid>
        );
      }
      case 1: {
        // timeRange
        return (
          <Grid columns={3} gap={2}>
            {timeRanges.map((tr) => (
              <Button
                onClick={() => {
                  setTimeRange(tr);
                  setAdvancedStep(2);
                }}
              >
                {tr.name}
              </Button>
            ))}
          </Grid>
        );
      }
      case 2: {
        // tracks
        return (
          <Flex direction="column">
            <Flex gap={2} wrap="wrap">
              {top?.items.map((item) => (
                <Button
                  onClick={() => {
                    toggleSelectedTracks(item);
                  }}
                  variant={selectedTracks.includes(item) ? 'default' : 'outline'}
                  shape="pill"
                >
                  {item.name}
                </Button>
              ))}
            </Flex>

            <Grid columns={2} gap={2} css={{ mt: '$6' }}>
              <Button
                variant="outline"
                onClick={() => {
                  removeAllSelectedTracks();
                  setAdvancedStep(1);
                }}
              >
                Back
              </Button>
              <Button onClick={() => setAdvancedStep(3)}>
                {selectedTracks.length === 0 ? 'Skip' : 'Next'}
              </Button>
            </Grid>
          </Flex>
        );
      }
      case 3: {
        return (
          <Flex direction="column" gap="2">
            <Form>
              <FormField name="name">
                <Flex align="baseline" justify="between" css={{ mb: '$1' }}>
                  <FormLabel>Name</FormLabel>
                </Flex>
                <FormControl asChild>
                  <TextField placeholder={placeholder.name} />
                </FormControl>
              </FormField>
              <FormField name="description">
                <Flex align="baseline" justify="between" css={{ mb: '$1' }}>
                  <FormLabel>Description</FormLabel>
                </Flex>
                <FormControl asChild>
                  <TextArea placeholder={placeholder.description} />
                </FormControl>
              </FormField>
              <FormSubmit asChild>
                <Button variant="default" style={{ marginTop: 10, width: '100%' }}>
                  Create
                </Button>
              </FormSubmit>
            </Form>

            <Button
              variant="outline"
              onClick={() => {
                setRemainingRolls(remainingRolls - 1);
                getRecommendations();
              }}
              loading={isFetching}
              disabled={remainingRolls <= 0}
            >
              Re-roll ({remainingRolls})
            </Button>
          </Flex>
        );
      }
      default: {
        return <></>;
      }
    }
  };

  if (!user) return null;

  return (
    <ContentLayout title="Dashboard">
      <Flex align="center" direction="column">
        <Heading css={{ mt: '$6' }}>
          Welcome <b>{user.display_name}</b>!
        </Heading>

        <Box css={{ mt: '$6' }}>{renderStep(advancedStep)}</Box>

        <Heading css={{ mt: '$6' }}>How it works?</Heading>
      </Flex>
    </ContentLayout>
  );
};

function pickRandomItems<T>(array: T[], count: number): T[] {
  const shuffledArray = array.slice().sort(() => Math.random() - 0.5);
  return shuffledArray.slice(0, count);
}
