'use client';
import axios from 'axios';
import { getSession } from 'next-auth/react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    const token = session?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const session = await getSession();
        const refreshToken = session?.refreshToken;

        if (refreshToken) {
          // Attempt to refresh token
          const refreshResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/jwt/refresh/`,
            { refresh: refreshToken }
          );

          // Update session with new tokens
          const newSession = {
            ...session,
            accessToken: refreshResponse.data.access,
            accessTokenExpires: Date.now() + 2 * 60 * 60 * 1000,
          };

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newSession.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        // Optionally redirect to login here
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default api;
