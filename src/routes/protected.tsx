import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { MainLayout } from '@/components/Layout';
import { lazyImport } from '@/utils/lazyImport';
import { Flex, Spinner } from '@nayhoo/components';

const { Dashboard } = lazyImport(() => import('@/features/user'), 'Dashboard');

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  return (
    <MainLayout>
      <Suspense
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
        <Outlet />
      </Suspense>
    </MainLayout>
  );
};

export const protectedRoutes = [
  {
    path: '/app',
    element: <App />,
    children: [{ path: '/', element: <Dashboard /> }],
  },
  { path: '/', element: <Navigate to="/app" /> },
];
