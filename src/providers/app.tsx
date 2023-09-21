import * as React from 'react';
import { HelmetProvider } from 'react-helmet-async';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return <HelmetProvider>{children}</HelmetProvider>;
};
