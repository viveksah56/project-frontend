/**
 * API Interceptor with Token Management
 * Automatically handles JWT token injection and refresh logic using js-cookie
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { getAccessToken, getRefreshToken, setToken, clearTokens, getRole, type UserRole } from "./token";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple token refresh requests
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

/**
 * Subscribe to token refresh events
 */
function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

/**
 * Add subscriber to token refresh queue
 */
function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

/**
 * Request interceptor: Inject access token
 */
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor: Handle token refresh on 401
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Check for 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            originalRequest.headers!.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          clearTokens();
          window.location.href = "/auth/login";
          return Promise.reject(error);
        }

        // Call refresh token endpoint
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"}/auth/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;
        const role = getRole() as UserRole;

        // Update tokens using js-cookie
        setToken({ accessToken, refreshToken: newRefreshToken }, role);

        // Update authorization header
        api.defaults.headers.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers!.Authorization = `Bearer ${accessToken}`;

        // Notify all queued requests
        onRefreshed(accessToken);

        isRefreshing = false;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("[v0] Token refresh failed:", refreshError);

        // Clear tokens and redirect to login
        clearTokens();
        window.location.href = "/auth/login";

        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
