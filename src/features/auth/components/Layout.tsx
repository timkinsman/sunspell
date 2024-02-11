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
        css={{ minHeight: '100vh', backgroundColor: 'rgb(249 250 251)', py: '$4', px: '$4' }}
      >
        <Heading size="3">{title}</Heading>

        <Box css={{ backgroundColor: '#ffffff', mt: '$4' }}>{children}</Box>
      </Flex>
    </>
  );
};
