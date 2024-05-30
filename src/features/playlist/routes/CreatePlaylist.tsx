// import { ContentLayout } from '@/components/Layout';
// import { UseTopOptions, useTop } from '../api/getTop';
// import { useAuth } from '@/hooks/useAuth';
// import { useState } from 'react';
// import { useArray } from '@/hooks/useArray';
// import { TrackObject } from '../types';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
//   Box,
//   Button,
//   Flex,
//   Form,
//   FormControl,
//   FormField,
//   FormLabel,
//   FormSubmit,
//   Grid,
//   Heading,
//   IconButton,
//   Paragraph,
//   Spinner,
//   TextArea,
//   TextField,
//   Tooltip,
// } from '@nayhoo/components';
// import { howItWorks } from '@/constants';
// import { placeholder, timeRanges } from '../utils';
// import { usePlaylist } from '../hooks/usePlaylist';

// export const Dashboard = () => {
//   const { user } = useAuth();

//   const [timeRange, setTimeRange] = useState(timeRanges[2]);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [createPlaylist, { data: playlist, isLoading }] = usePlaylist();

//   const {
//     array: selectedTracks,
//     removeAll: removeAllSelectedTracks,
//     toggle: toggleSelectedTracks,
//   } = useArray<TrackObject>([]);

//   const {
//     refetch: getTop,
//     data: top,
//     isFetching,
//   } = useTop({
//     type: 'tracks',
//     timeRange: timeRange.id as UseTopOptions['timeRange'],
//   });

//   if (!user) return null;

//   const groupedTracksByArtist =
//     top?.items.reduce<Record<string, TrackObject[]>>((acc, track) => {
//       const key = track.artists[0].name;
//       if (acc[key]) {
//         acc[key].push(track);
//       } else {
//         acc[key] = [track];
//       }
//       return acc;
//     }, {}) ?? {};

//   const steps = [
//     {
//       title: 'Welcome!',
//       summary: 'To get started select an option below!',
//       tooltip: '',
//       value: 0,
//       Element: (
//         <Grid columns={1} gap={2} css={{ '@bp1': { gridCols: 2 } }}>
//           <Tooltip delayDuration={60} content="Let Sunspell do all the work!">
//             <Button
//               loading={isLoading}
//               onClick={async () => {
//                 const { data: top } = await getTop();
//                 const items = top?.items;

//                 createPlaylist(items);
//               }}
//             >
//               Simple
//             </Button>
//           </Tooltip>

//           <Tooltip delayDuration={60} content="Craft a spell!">
//             <Button onClick={() => setCurrentStep(1)} disabled={isLoading}>
//               Advanced
//             </Button>
//           </Tooltip>
//         </Grid>
//       ),
//     },
//     {
//       title: 'Select a time period',
//       summary: 'This will determine the tracks to choose from',
//       tooltip: '',
//       value: 1,
//       Element: (
//         <Grid columns={1} gap={2} css={{ '@bp1': { gridCols: 3 } }}>
//           {timeRanges.map((tr) => (
//             <Button
//               onClick={() => {
//                 setTimeRange(tr);
//                 setCurrentStep(2);
//               }}
//             >
//               {tr.name}
//             </Button>
//           ))}
//         </Grid>
//       ),
//     },
//     {
//       title: 'Select from a pool of tracks',
//       summary: 'This will shape the spell',
//       tooltip: '',
//       value: 2,
//       Element: (
//         <Flex direction="column" align="center">
//           <Button onClick={() => setCurrentStep(3)}>
//             {selectedTracks.length === 0 ? 'Skip' : 'Next'}
//           </Button>

//           <Box css={{ width: '100%', mt: '$6' }}>
//             {isFetching ? (
//               <Spinner css={{ m: 'auto' }} />
//             ) : (
//               <Accordion type="multiple" css={{ width: '100%' }}>
//                 {Object.entries(groupedTracksByArtist).map(([artistName, tracks]) => {
//                   const numOfSelectedTracksByArtist = tracks.filter((track) =>
//                     selectedTracks.includes(track)
//                   ).length;

//                   return (
//                     <AccordionItem value={artistName}>
//                       <AccordionTrigger>
//                         {`${artistName} ${
//                           numOfSelectedTracksByArtist > 0 ? `(${numOfSelectedTracksByArtist})` : ''
//                         }`}
//                       </AccordionTrigger>
//                       <AccordionContent>
//                         <Flex gap={2} wrap="wrap">
//                           {tracks
//                             .sort((a, b) => {
//                               const nameA = a.artists[0].name.toLowerCase();
//                               const nameB = b.artists[0].name.toLowerCase();
//                               if (nameA < nameB) return -1;
//                               if (nameA > nameB) return 1;
//                               return 0; // names must be equal
//                             })
//                             .map((item) => (
//                               <Button
//                                 onClick={() => {
//                                   toggleSelectedTracks(item);
//                                 }}
//                                 variant={selectedTracks.includes(item) ? 'default' : 'outline'}
//                                 shape="pill"
//                               >
//                                 {item.name}
//                               </Button>
//                             ))}
//                         </Flex>
//                       </AccordionContent>
//                     </AccordionItem>
//                   );
//                 })}
//               </Accordion>
//             )}
//           </Box>
//         </Flex>
//       ),
//     },
//     {
//       title: 'Finalise the spell!',
//       summary: 'Enter the final details',
//       tooltip: '',
//       value: 3,
//       Element: (
//         <Flex direction="column" gap="2">
//           <Form
//             onSubmit={async (event) => {
//               event.preventDefault();

//               const data = Object.fromEntries(new FormData(event.currentTarget));
//               const name = data.name as string;
//               const description = data.description as string;

//               const { data: top } = await getTop();
//               const pool = selectedTracks.length > 0 ? selectedTracks : top?.items;

//               createPlaylist(pool, name, description).then(() => setCurrentStep(4));
//             }}
//           >
//             <FormField name="name">
//               <Flex align="baseline" justify="between" css={{ mb: '$1' }}>
//                 <FormLabel>Name</FormLabel>
//               </Flex>
//               <FormControl asChild>
//                 <TextField placeholder={placeholder.name} />
//               </FormControl>
//             </FormField>
//             <FormField name="description">
//               <Flex align="baseline" justify="between" css={{ mb: '$1' }}>
//                 <FormLabel>Description</FormLabel>
//               </Flex>
//               <FormControl asChild>
//                 <TextArea placeholder={placeholder.description} />
//               </FormControl>
//             </FormField>
//             <FormSubmit asChild>
//               <Button
//                 loading={isLoading}
//                 variant="default"
//                 style={{ marginTop: 10, width: '100%' }}
//               >
//                 Create
//               </Button>
//             </FormSubmit>
//           </Form>
//         </Flex>
//       ),
//     },
//     {
//       title: 'Success!',
//       summary: 'Congratulations! It should appear',
//       tooltip: '',
//       value: 4,
//       Element: (
//         <Grid columns={2} gap={2}>
//           <Button
//             variant="outline"
//             onClick={() => {
//               setCurrentStep(0);
//             }}
//           >
//             Start again
//           </Button>
//           <Button
//             disabled={!playlist}
//             onClick={() => {
//               window.open(playlist?.uri, '_blank');
//             }}
//           >
//             View
//           </Button>
//         </Grid>
//       ),
//     },
//   ];

//   const activeStep = steps.find((step) => step.value === currentStep) ?? steps[0];

//   return (
//     <ContentLayout title="Create playlist">
//       <Flex align="center" direction="column">
//         <Heading css={{ mt: '$6' }}>{activeStep.title}</Heading>
//         <Paragraph css={{ mt: '$2' }}>{activeStep.summary}</Paragraph>

//         {currentStep > 0 && (
//           <Grid gap={2} css={{ gridCols: 5, mt: '$6' }}>
//             {steps.map((step) => (
//               <Tooltip content={step.tooltip}>
//                 <IconButton
//                   onClick={() => {
//                     if (step.value === 1) {
//                       removeAllSelectedTracks();
//                     }
//                     setCurrentStep(step.value);
//                   }}
//                   disabled={currentStep < step.value}
//                 >
//                   <svg
//                     clip-rule="evenodd"
//                     fill-rule="evenodd"
//                     stroke-linejoin="round"
//                     stroke-miterlimit="2"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                     height={8}
//                     style={{ opacity: currentStep === step.value ? '1' : '0.2' }}
//                   >
//                     <circle cx="11.998" cy="11.998" fill-rule="nonzero" r="9.998" />
//                   </svg>
//                 </IconButton>
//               </Tooltip>
//             ))}
//           </Grid>
//         )}

//         <Box css={{ mt: '$6', width: '100%' }}>{activeStep.Element}</Box>

//         <Heading css={{ mt: '$6' }}>How it works?</Heading>
//         <Paragraph css={{ mt: '$4' }}>{howItWorks}</Paragraph>
//       </Flex>
//     </ContentLayout>
//   );
// };
