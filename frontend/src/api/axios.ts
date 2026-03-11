/// <reference types="vite/client" />
import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  return `${protocol}//${hostname}:5000/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
});

export const API_URL = getBaseURL();
export const UPLOAD_URL = API_URL.replace('/api', '');

export const fixUrl = (url?: string | null): string => {
  if (!url) return '';
  if (url.includes('localhost:5000')) {
    return url.replace(/http:\/\/localhost:5000/g, UPLOAD_URL);
  }
  return url;
};




// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
