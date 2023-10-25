import { create } from 'zustand';
import { Authentication } from '../types';
import { createJSONStorage, persist } from 'zustand/middleware';

type AuthenticationStore = {
  authentication?: Authentication;
  setAuthentication: (accessToken: Authentication) => void;
  clearAuthentication: () => void;
};

export const useAuthenticationStore = create<AuthenticationStore>()(
  persist(
    (set) => ({
      authentication: undefined,
      setAuthentication: (authentication) =>
        set((state) => ({
          ...state,
          authentication: { ...state.authentication, ...authentication },
        })),
      clearAuthentication: () =>
        set((state) => ({
          ...state,
          authentication: undefined,
        })),
    }),
    {
      name: 'authentication',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
