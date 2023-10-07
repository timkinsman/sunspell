import React, { useEffect, useState } from 'react';
import { UserProfile } from '@/features/user';
import storage from '@/utils/storage';
import { getProfile } from '@/features/user/api/getProfile';
import { useNotificationStore } from '@/stores/notifications';

const logout = () => {
  storage.clearToken();
  window.location.assign(window.location.origin);
};

export interface useAuthProps {
  isLoggingIn: boolean;
  logout: () => void;
  user?: UserProfile;
}

export const AuthContext = React.createContext<useAuthProps>({
  isLoggingIn: false,
  logout,
  user: undefined,
} as useAuthProps);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile>();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const token = storage.getToken();

    if (!token) {
      return;
    }

    async function getUser() {
      try {
        setIsLoggingIn(true);

        const profile = await getProfile();

        setUser(profile);
      } catch (error) {
        useNotificationStore
          .getState()
          .addNotification({ type: 'error', title: 'Error', message: `${error}` });

        storage.clearToken();
      } finally {
        setIsLoggingIn(false);
      }
    }

    getUser();
  }, []);

  const memoizedContextValue = React.useMemo<useAuthProps>(
    () => ({
      isLoggingIn,
      logout,
      user,
    }),
    [isLoggingIn, user]
  );

  return <AuthContext.Provider value={memoizedContextValue}>{children}</AuthContext.Provider>;
};
