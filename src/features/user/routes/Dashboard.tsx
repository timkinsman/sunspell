import { ContentLayout } from '@/components/Layout';
import { UseTopOptions, useTop } from '../api/getTop';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useArray } from '@/hooks/useArray';
import { ArtistObject, TrackObject } from '..';
import { useCreatePlaylist } from '../api/createPlaylist';
import { useAddItemsToPlaylist } from '../api/addItemsToPlaylist';
import { useRecommendations } from '../api/getRecommendations';
import { Box, Button, Flex, Grid, Heading } from '@nayhoo/components';

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

  // const {
  //   array: selectedGenres,
  //   removeAll: removeAllSelectedGenres,
  //   toggle: toggleSelectedGenres,
  // } = useArray<string>([]);

  const {
    array: selectedTracks,
    removeAll: removeAllSelectedTracks,
    toggle: toggleSelectedTracks,
  } = useArray<TrackObject>([]);

  const { refetch: getTop, data: top } = useTop({
    type: 'tracks',
    timeRange: timeRange.id as UseTopOptions['timeRange'],
  });

  if (!user) return null;

  const { mutateAsync: createPlaylist } = useCreatePlaylist({});
  const { mutateAsync: addItemsToPlaylist } = useAddItemsToPlaylist({});

  const { refetch: getRecommendations, isFetching } = useRecommendations({
    limit: 20,
    seed_values: seedValues,
    config: { enabled: false },
  });

  const renderStep = (step: number) => {
    switch (step) {
      case 0: {
        return (
          <Grid columns={2} gap={2}>
            <Button
              loading={isLoading}
              onClick={async () => {
                try {
                  setIsLoading(true);

                  const { data: top } = await getTop();

                  const items = top?.items ?? [];

                  setSeedValues(pickRandomItems(items, 5));

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
        // genres
        // Accumulate unique genres
        // const uniqueGenres: Set<string> = new Set();
        // top?.items.forEach((item) => {
        //   item.artists?.forEach((artist) => {
        //     artist.genres?.forEach((genre) => {
        //       uniqueGenres.add(genre);
        //     });
        //   });
        // });
        // // Convert the Set to an array
        // const uniqueGenresArray: string[] = Array.from(uniqueGenres);
        // return (
        //   <Flex gap={2} wrap="wrap">
        //     {uniqueGenresArray.map((genre) => (
        //       <Button
        //         onClick={() => {
        //           toggleSelectedGenres(genre);
        //         }}
        //         variant="outline"
        //         shape="pill"
        //       >
        //         {genre}
        //       </Button>
        //     ))}
        //   </Flex>
        // );
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

          // <FormField name="email">
          //     <Flex align="baseline" justify="between" css={{ mb: "$1" }}>
          //       <FormLabel>Email</FormLabel>
          //       <FormMessage error match="valueMissing">
          //         Please enter your email
          //       </FormMessage>
          //       <FormMessage error match="typeMismatch">
          //         Please provide a valid email
          //       </FormMessage>
          //     </Flex>
          //     <FormControl asChild>
          //       <TextField type="email" required />
          //     </FormControl>
          //   </FormField>
          //   <FormField name="question">
          //     <Flex align="baseline" justify="between" css={{ mb: "$1" }}>
          //       <FormLabel>Question</FormLabel>
          //       <FormMessage error match="valueMissing">
          //         Please enter a question
          //       </FormMessage>
          //     </Flex>
          //     <FormControl asChild>
          //       <TextArea required />
          //     </FormControl>
          //   </FormField>
          //   <FormSubmit asChild>
          //     <Button style={{ marginTop: 10 }}>Post question</Button>
          //   </FormSubmit>
          <Grid columns={1} gap={2}>
            <Button
              loading={isLoading}
              onClick={async () => {
                try {
                  setIsLoading(true);

                  const { data: top } = await getTop();

                  const items = top?.items ?? [];

                  const selectedSeedValues = pickRandomItems(
                    selectedTracks.length > 0 ? selectedTracks : items,
                    5
                  );

                  setSeedValues(selectedSeedValues);

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
              Create
            </Button>
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
          </Grid>
        );
      }
      default: {
        return <></>;
      }
    }
  };

  return (
    <ContentLayout title="Dashboard">
      <Flex align="center" direction="column">
        <Heading className="mt-2">
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
