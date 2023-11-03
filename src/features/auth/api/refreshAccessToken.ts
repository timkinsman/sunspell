import { useAuthenticationStore } from '../stores/authentication';
import { Authentication } from '../types';

export async function refreshAccessToken(clientId: string, refresh_token: string): Promise<void> {
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refresh_token);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  if (!response.ok) throw response.statusText;

  const result = (await response.json()) as Omit<Authentication, 'refresh_token'>;

  useAuthenticationStore.getState().setAuthentication({ ...result, refresh_token });
}
