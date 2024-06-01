import * as React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { queryClient } from '@/lib/react-query';
import { Button, Flex, Heading, Spinner, Toast } from '@nayhoo/components';

const ErrorFallback = () => {
  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      css={{ minHeight: '100vh', minHeight: '100dvh', width: '100vw' }}
      role="alert"
    >
      <Heading size="3">Sorry, something went wrong.</Heading>
      <Button css={{ mt: '$4' }} onClick={() => window.location.assign(window.location.origin)}>
        Refresh
      </Button>
    </Flex>
  );
};

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense
      fallback={
        <Flex
          direction="column"
          justify="center"
          align="center"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          css={{ minHeight: '100vh', minHeight: '100dvh', width: '100vw' }}
        >
          <Spinner />
        </Flex>
      }
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            {import.meta.env.DEV && <ReactQueryDevtools />}
            <Toast>
              <Router>{children}</Router>
            </Toast>
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
