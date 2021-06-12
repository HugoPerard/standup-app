import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

Axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return {
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
      ...config,
      headers: {
        ...config.headers,
      },
    };
  },
  (error) => Promise.reject(error)
);

Axios.interceptors.response.use((response: AxiosResponse) => {
  if (response.headers['x-total-count']) {
    return {
      content: response.data,
      totalItems: response?.headers['x-total-count'],
    };
  }
  return response.data;
});
