import { Head } from '@/components/Head';
import { Button, Container, Flex, Heading } from '@nayhoo/components';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Head description={`404 Not Found`} />
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Flex align="center" css={{ minHeight: '100vh', minHeight: '100dvh' }}>
        <Container size="3" css={{ px: '$2', textAlign: 'center' }}>
          <Heading size="3">404 Not Found</Heading>

          <Button onClick={() => navigate('/')} css={{ mt: '$4' }}>
            Go back
          </Button>
        </Container>
      </Flex>
    </>
  );
};
