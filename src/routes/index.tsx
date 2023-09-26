import { useRoutes } from 'react-router-dom';

import { Landing } from '@/features/misc';

import { protectedRoutes } from './protected';
import { publicRoutes } from './public';
import { useAuth } from '@/hooks/useAuth';

export const AppRoutes = () => {
  const { user } = useAuth();

  const commonRoutes = [{ path: '/', element: <Landing /> }];

  const routes = user ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes, ...commonRoutes]);

  return <>{element}</>;
};
