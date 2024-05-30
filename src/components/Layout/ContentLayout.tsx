import * as React from 'react';

import { Head } from '../Head';
import { Box, Container, Flex, Link, Text } from '@nayhoo/components';

const Footer = () => {
  return (
    <Flex align="center" justify="between" as="footer" css={{ p: '$2', mt: 'auto' }} wrap="wrap">
      <Text size="2">
        Developed by{' '}
        <Link href="https://github.com/timkinsman" target="_blank">
          Tim Kinsman
        </Link>
      </Text>
      <Text size="2">
        <Link href="https://github.com/timkinsman/sunspell" target="_blank">
          Source code
        </Link>
      </Text>
    </Flex>
  );
};

type ContentLayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const ContentLayout = ({ children, title }: ContentLayoutProps) => {
  return (
    <>
      <Head title={title} />
      <Box css={{ py: '$6' }}>
        <Container size="2" css={{ px: '$2' }}>
          {children}
        </Container>
      </Box>
      <Footer />
    </>
  );
};
