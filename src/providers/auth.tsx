import React, { useCallback, useEffect, useState } from 'react';
import { UserProfile } from '@/features/user';
import { getProfile } from '@/features/user/api/getProfile';
import { useNotificationStore } from '@/stores/notifications';
import { useAuthenticationStore } from '@/features/auth/stores/authentication';
import { refreshAccessToken } from '@/features/auth/api/refreshAccessToken';
import { CLIENT_ID } from '@/config';
import { useInterval } from '@/hooks/useInterval';
import { noop } from '@/utils/noop';

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

        useNotificationStore
          .getState()
          .addNotification({ type: 'error', title: 'Error', message: `${error}` });
      } finally {
        setIsLoggingIn(false);
      }
    }

    getUser();
  }, [authentication, logout]);

  async function refresh(refreshToken?: string) {
    if (!refreshToken) {
      return;
    }

    try {
      await refreshAccessToken(clientId, refreshToken);
    } catch (error) {
      useNotificationStore
        .getState()
        .addNotification({ type: 'error', title: 'Error', message: `${error}` });
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
