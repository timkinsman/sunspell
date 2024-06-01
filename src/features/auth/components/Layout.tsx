import * as React from 'react';

import { Head } from '@/components/Head';
import { Box, Flex, Heading } from '@nayhoo/components';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const Layout = ({ children, title }: LayoutProps) => {
  return (
    <>
      <Head title={title} />
      <Flex
        align="center"
        justify="center"
        direction="column"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        css={{ minHeight: '100vh', minHeight: '100dvh', py: '$4', px: '$4', textAlign: 'center' }}
      >
        <Heading size="3">{title}</Heading>

        <Box css={{ mt: '$4' }}>{children}</Box>
      </Flex>
    </>
  );
};
