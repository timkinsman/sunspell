import React, { useCallback, useEffect, useState } from 'react';
import { getProfile } from '@/features/user/api/getProfile';
import { useAuthenticationStore } from '@/features/auth/stores/authentication';
import { refreshAccessToken } from '@/features/auth/api/refreshAccessToken';
import { CLIENT_ID } from '@/config';
import { useInterval } from '@/hooks/useInterval';
import { noop } from '@/utils/noop';
import { useToast } from '@nayhoo/components';
import { UserProfile } from '@/features/user/types';
import { useNavigate } from 'react-router-dom';

const clientId = CLIENT_ID;

export interface useAuthProps {
  isLoggingIn: boolean;
  logout: () => void;
  user: UserProfile | null;
}

export const AuthContext = React.createContext<useAuthProps>({
  isLoggingIn: false,
  logout: noop,
  user: null,
} as useAuthProps);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { authentication, clearAuthentication } = useAuthenticationStore();
  const toast = useToast();

  const navigate = useNavigate();

  const logout = useCallback(() => {
    setUser(null);
    clearAuthentication();
    navigate('/auth/login');
  }, [clearAuthentication, navigate]);

  useEffect(() => {
    if (!authentication) {
      return;
    }

    async function getUser() {
      try {
        setIsLoggingIn(true);

        const profile = await getProfile();

        setUser(profile);
      } catch (error) {
        toast({ title: 'Error', description: `${error}`, error: true });

        logout();
      } finally {
        setIsLoggingIn(false);
      }
    }

    getUser();
  }, [authentication, logout, toast]);

  useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  async function refresh(refreshToken?: string) {
    if (!refreshToken) {
      return;
    }

    try {
      await refreshAccessToken(clientId, refreshToken);
    } catch (error) {
      toast({ title: 'Error', description: `${error}` });
    }
  }

  useInterval(
    () => {
      if (authentication) {
        refresh(authentication.refresh_token);
      }
    },
    authentication ? authentication.expires_in * 100 : null
  );

  const memoizedContextValue = React.useMemo<useAuthProps>(
    () => ({
      isLoggingIn,
      logout,
      user,
    }),
    [isLoggingIn, logout, user]
  );

  return <AuthContext.Provider value={memoizedContextValue}>{children}</AuthContext.Provider>;
};
