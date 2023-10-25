import { REDIRECT_URI } from '@/config';
import { useAuthenticationStore } from '../stores/authentication';
import { Authentication } from '../types';

export async function getAccessToken(clientId: string, code: string): Promise<void> {
  const verifier = localStorage.getItem('verifier');

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', REDIRECT_URI);
  params.append('code_verifier', verifier!);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  if (!response.ok) throw response.statusText;

  const result = (await response.json()) as Authentication;

  useAuthenticationStore.getState().setAuthentication(result);
}
