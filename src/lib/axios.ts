import { API_URL } from '@/config';
import { useAuthenticationStore } from '@/features/auth/stores/authentication';
import { useNotificationStore } from '@/stores/notifications';
import Axios, { InternalAxiosRequestConfig } from 'axios';
function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const authentication = useAuthenticationStore.getState().authentication;
  if (authentication) {
    config.headers.authorization = `${authentication.token_type} ${authentication.access_token}`;
  }
  return config;
}

export const axios = Axios.create({
  baseURL: API_URL,
});

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    useNotificationStore.getState().addNotification({
      type: 'error',
      title: 'Error',
      message,
    });

    return Promise.reject(error);
  }
);
