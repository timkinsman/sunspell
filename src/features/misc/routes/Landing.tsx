import { Head } from '@/components/Head';
import { useAuth } from '@/hooks/useAuth';
import { Button, Container, Flex, Heading } from '@nayhoo/components';

export const Landing = () => {
  const { logout, isLoggingIn, user } = useAuth();

  const handleStart = () => {
    if (user) {
      window.location.assign('/app');
    } else {
      window.location.assign('/auth/login');
    }
  };

  return (
    <>
      <Head description={`Welcome to sunspell`} />
      <Flex align="center" css={{ height: '100vh' }}>
        <Container size="3" css={{ px: '$2', textAlign: 'center' }}>
          <Heading size="3">sunspell</Heading>

          <Flex direction="column" gap="2" justify="center" css={{ mt: '$4' }}>
            <Button onClick={handleStart} loading={isLoggingIn}>
              {user ? `Continue as ${user.display_name}` : 'Get started'}
            </Button>

            {user && (
              <Button onClick={logout} variant="outline">
                Log out
              </Button>
            )}
          </Flex>
        </Container>
      </Flex>
    </>
  );
};
