import { Button } from '@/components/Elements';
import { getAccessToken } from '../api/getAccessToken';
import { redirectToAuthCodeFlow } from '../utils';
import storage from '@/utils/storage';
import { useEffect, useState } from 'react';
import { CLIENT_ID } from '@/config';
import { useNotificationStore } from '@/stores/notifications';

const clientId = CLIENT_ID;
const params = new URLSearchParams(window.location.search);
const code = params.get('code');

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    async function login(code: string) {
      try {
        setIsLoggingIn(true);

        const accessToken = await getAccessToken(clientId, code);
        storage.setToken(accessToken);

        onSuccess();
      } catch (error) {
        useNotificationStore
          .getState()
          .addNotification({ type: 'error', title: 'Error', message: `${error}` });

        storage.clearToken();
      } finally {
        setIsLoggingIn(false);
      }
    }

    if (!code) {
      // do nothing
    } else {
      login(code);
    }
  }, [onSuccess]);

  return (
    <div>
      <Button
        isLoading={isLoggingIn}
        onClick={() => redirectToAuthCodeFlow(clientId)}
        className="w-full"
      >
        Log in
      </Button>
    </div>
  );
};
