import * as React from 'react';

import { Head } from '../Head';
import { Box, Container, Flex, Link, Text } from '@nayhoo/components';

const Footer = () => {
  return (
    <Box as="footer" css={{ px: '$4' }}>
      <Flex align="center" justify="between">
        <Text>
          Developed by{' '}
          <Link href="https://github.com/timkinsman" target="_blank">
            Tim Kinsman
          </Link>
        </Text>
        <Link href="https://github.com/timkinsman/sunspell" target="_blank">
          Source code
        </Link>
      </Flex>
    </Box>
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
        <Container size="3" css={{ px: '$2' }}>
          {children}
        </Container>
      </Box>
      <Footer />
    </>
  );
};
