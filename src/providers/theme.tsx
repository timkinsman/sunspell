import { useThemeStore } from '@/features/theme/stores/theme';
import { darkTheme, globalStyles } from '@nayhoo/components';
import { useBodyClassToggle } from '@nayhoo/hooks';
import React from 'react';

globalStyles();

type ThemeProviderProps = {
  children: React.ReactNode;
};

// todo: is this a provider???
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme } = useThemeStore();

  const isDarkTheme = theme === 'dark';

  useBodyClassToggle(darkTheme, isDarkTheme);

  return <>{children}</>;
};
