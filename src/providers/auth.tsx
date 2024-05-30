import React, { useCallback, useEffect, useState } from 'react';
import { getProfile } from '@/features/user/api/getProfile';
import { useAuthenticationStore } from '@/features/auth/stores/authentication';
import { refreshAccessToken } from '@/features/auth/api/refreshAccessToken';
import { CLIENT_ID } from '@/config';
import { useInterval } from '@/hooks/useInterval';
import { noop } from '@/utils/noop';
import { useToast } from '@nayhoo/components';
import { UserProfile } from '@/features/user/types';

const clientId = CLIENT_ID;

export interface useAuthProps {
  isLoggingIn: boolean;
  logout: () => void;
  user?: UserProfile;
}

export const AuthContext = React.createContext<useAuthProps>({
  isLoggingIn: false,
  logout: noop,
  user: undefined,
} as useAuthProps);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile>();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { authentication, clearAuthentication } = useAuthenticationStore();
  const toast = useToast();

  const logout = useCallback(() => {
    clearAuthentication();
    window.location.assign(window.location.origin);
  }, [clearAuthentication]);

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
        logout();

        toast({ title: 'Error', description: `${error}` });
      } finally {
        setIsLoggingIn(false);
      }
    }

    getUser();
  }, [authentication, logout, toast]);

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
