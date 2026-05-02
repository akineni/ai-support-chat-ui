import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/constants';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept':       'application/json',
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(STORAGE_KEYS.AGENT_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || 'Something went wrong.';
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;