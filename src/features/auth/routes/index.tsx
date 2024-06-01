import { Route, Routes } from 'react-router-dom';

import { Login } from './Login';
import { NotFound } from '@/features/misc';

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
